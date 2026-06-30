import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCheckoutSession,
  updateCheckoutSession,
} from "@/lib/checkout-session";
import { getStripeClient } from "@/lib/stripe";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { createWooOrder } from "@/lib/woocommerce";
import { createLogger } from "@/lib/logger";

const log = createLogger("checkout/complete");

const BodySchema = z.object({
  sessionId: z.string().uuid(),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }
  const { sessionId } = parsed.data;

  const session = await getCheckoutSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  // Idempotent: if already completed, return the existing order info
  if (session.status === "completed" && session.woo_order_id && session.woo_order_key) {
    return NextResponse.json({
      orderId: session.woo_order_id,
      orderKey: session.woo_order_key,
    });
  }

  if (!session.payment_intent_id) {
    return NextResponse.json({ error: "No payment intent on session" }, { status: 400 });
  }
  if (!session.shipping_address || !session.shipping_method) {
    return NextResponse.json({ error: "Session missing shipping data" }, { status: 400 });
  }

  // Verify payment server-side via the provider that owns this session.
  // Never trust the client to claim payment success — they could spoof it.
  const provider = session.payment_provider;
  let paymentMethodTitle: string;
  let providerRef: string;

  if (provider === "stripe") {
    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }
    let intent;
    try {
      intent = await stripe.paymentIntents.retrieve(session.payment_intent_id);
    } catch (error) {
      log.error("Failed to retrieve PaymentIntent", error);
      return NextResponse.json({ error: "Payment verification failed" }, { status: 502 });
    }
    if (intent.status !== "succeeded") {
      return NextResponse.json(
        { error: `Payment not completed (status: ${intent.status})` },
        { status: 402 },
      );
    }
    paymentMethodTitle = "Stripe (Card)";
    providerRef = intent.id;
  } else if (provider === "paystack") {
    let tx;
    try {
      tx = await verifyPaystackTransaction(session.payment_intent_id);
    } catch (error) {
      log.error("Failed to verify Paystack transaction", error);
      return NextResponse.json({ error: "Payment verification failed" }, { status: 502 });
    }
    if (tx.status !== "success") {
      return NextResponse.json(
        { error: `Payment not completed (status: ${tx.status})` },
        { status: 402 },
      );
    }
    paymentMethodTitle = "Paystack";
    providerRef = tx.reference;
  } else {
    return NextResponse.json({ error: "Unknown payment provider" }, { status: 400 });
  }

  // Create the Woo order
  const addr = session.shipping_address;
  const method = session.shipping_method;
  const billing = {
    first_name: addr.first_name,
    last_name: addr.last_name,
    company: "",
    address_1: addr.address_1,
    address_2: addr.address_2 ?? "",
    city: addr.city,
    state: addr.state ?? "",
    postcode: addr.postcode ?? "",
    country: addr.country,
    phone: addr.phone,
    email: session.email,
  };
  const shipping = {
    first_name: addr.first_name,
    last_name: addr.last_name,
    company: "",
    address_1: addr.address_1,
    address_2: addr.address_2 ?? "",
    city: addr.city,
    state: addr.state ?? "",
    postcode: addr.postcode ?? "",
    country: addr.country,
    phone: addr.phone,
  };

  try {
    const providerMetaKey =
      provider === "stripe" ? "_stripe_payment_intent_id" : "_paystack_reference";
    const order = await createWooOrder({
      customer_id: session.customer_id ?? 0,
      payment_method: provider,
      payment_method_title: paymentMethodTitle,
      set_paid: true,
      status: "processing",
      currency: session.currency,
      billing,
      shipping,
      line_items: session.cart.map((line) => ({
        product_id: line.productId,
        quantity: line.quantity,
        ...(line.variationId ? { variation_id: line.variationId } : {}),
      })),
      shipping_lines: [
        {
          method_id: method.method_id,
          method_title: method.title,
          total: method.cost.toFixed(2),
        },
      ],
      meta_data: [
        { key: "_oc_checkout_session_id", value: session.id },
        { key: providerMetaKey, value: providerRef },
      ],
    });

    await updateCheckoutSession(session.id, {
      status: "completed",
      woo_order_id: order.id,
      woo_order_key: order.order_key,
    });

    return NextResponse.json({
      orderId: order.id,
      orderKey: order.order_key,
    });
  } catch (error) {
    log.error("Failed to create Woo order after Stripe payment", error);
    await updateCheckoutSession(session.id, {
      status: "failed",
      failure_reason: "woo_order_creation_failed",
    });
    return NextResponse.json(
      { error: "Order creation failed. Your card has been charged — contact support." },
      { status: 500 },
    );
  }
}
