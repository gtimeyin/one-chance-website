import { NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";
import {
  createCheckoutSession,
  updateCheckoutSession,
  type CheckoutCartLine,
} from "@/lib/checkout-session";
import { getStripeClient, toMinorUnits } from "@/lib/stripe";
import { rateLimit } from "@/lib/rate-limit";
import { decrypt } from "@/lib/session-crypto";
import { cookies } from "next/headers";
import { createLogger } from "@/lib/logger";

const log = createLogger("checkout/create-session");

const CartLineSchema = z.object({
  productId: z.number().int().positive(),
  name: z.string().min(1).max(500),
  quantity: z.number().int().min(1).max(99),
  unitPrice: z.number().nonnegative(),
  sku: z.string().max(100).optional(),
  variationId: z.number().int().positive().optional(),
  image: z.string().url().optional(),
});

const AddressSchema = z.object({
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  address_1: z.string().trim().min(1).max(200),
  address_2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(1).max(100),
  state: z.string().trim().max(100).optional(),
  postcode: z.string().trim().max(20).optional(),
  country: z.string().length(2),
  phone: z.string().trim().min(5).max(30),
});

const ShippingMethodSchema = z.object({
  zone_id: z.number().int().nonnegative(),
  method_id: z.string().min(1).max(50),
  instance_id: z.number().int().nonnegative(),
  title: z.string().min(1).max(100),
  cost: z.number().nonnegative(),
});

const BodySchema = z.object({
  email: z.string().trim().email().max(254),
  cart: z.array(CartLineSchema).min(1).max(50),
  shippingAddress: AddressSchema,
  shippingMethod: ShippingMethodSchema,
  currency: z.string().length(3).toUpperCase(),
});

export async function POST(request: Request) {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`checkout:${ip}`, 10, 15 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Try again later." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { email, cart, shippingAddress, shippingMethod, currency } = parsed.data;

  // Compute amounts on the server — never trust client-supplied totals.
  const subtotal = cart.reduce(
    (sum: number, line: CheckoutCartLine) => sum + line.unitPrice * line.quantity,
    0,
  );
  const amount = subtotal + shippingMethod.cost;
  if (amount <= 0) {
    return NextResponse.json({ error: "Amount must be > 0" }, { status: 400 });
  }

  // Optional: associate with a logged-in customer if a session exists.
  const cookieStore = await cookies();
  const session = await decrypt(cookieStore.get("session")?.value);
  const customerId = session?.customerId ?? null;

  const checkoutSession = await createCheckoutSession({
    customerId,
    email,
    cart,
    shippingAddress,
    shippingMethod,
    currency,
    amount,
  });
  if (!checkoutSession) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }

  // Create Stripe PaymentIntent and attach to the session
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: toMinorUnits(amount, currency),
      currency: currency.toLowerCase(),
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
      metadata: {
        checkout_session_id: checkoutSession.id,
      },
      shipping: {
        name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
        phone: shippingAddress.phone,
        address: {
          line1: shippingAddress.address_1,
          line2: shippingAddress.address_2 || undefined,
          city: shippingAddress.city,
          state: shippingAddress.state || undefined,
          postal_code: shippingAddress.postcode || undefined,
          country: shippingAddress.country,
        },
      },
    });

    await updateCheckoutSession(checkoutSession.id, {
      status: "payment_started",
      payment_provider: "stripe",
      payment_intent_id: intent.id,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      clientSecret: intent.client_secret,
      amount,
      currency,
    });
  } catch (error) {
    log.error("Failed to create Stripe PaymentIntent", error);
    await updateCheckoutSession(checkoutSession.id, {
      status: "failed",
      failure_reason: "stripe_payment_intent_creation_failed",
    });
    return NextResponse.json({ error: "Payment provider error" }, { status: 502 });
  }
}
