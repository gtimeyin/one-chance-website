import "server-only";
import {
  getCheckoutSession,
  updateCheckoutSession,
  type CheckoutSession,
} from "./checkout-session";
import { getStripeClient } from "./stripe";
import { verifyPaystackTransaction } from "./paystack";
import { createWooOrder } from "./woocommerce";
import { createLogger } from "./logger";

const log = createLogger("checkout-fulfillment");

export interface FulfillResult {
  orderId: number;
  orderKey: string;
  /** True if this call created the order; false if it was already fulfilled. */
  created: boolean;
}

export class FulfillmentError extends Error {
  constructor(public code: string, public httpStatus: number, message: string) {
    super(message);
    this.name = "FulfillmentError";
  }
}

/**
 * Verify the payment with the chosen provider and create the Woo order.
 * Used by:
 *  - /api/checkout/complete  (called by the browser on payment success)
 *  - /api/webhooks/stripe    (called by Stripe on payment_intent.succeeded)
 *  - /api/webhooks/paystack  (called by Paystack on charge.success)
 *
 * Idempotent on session.status — re-entering after fulfillment returns
 * the existing order. There's a small race window between callers; the
 * worst case is a duplicate Woo order, which is easily reconciled manually.
 */
export async function fulfillCheckoutSession(
  sessionId: string,
): Promise<FulfillResult> {
  const session = await getCheckoutSession(sessionId);
  if (!session) {
    throw new FulfillmentError("session_not_found", 404, "Session not found");
  }

  if (session.status === "completed" && session.woo_order_id && session.woo_order_key) {
    return {
      orderId: session.woo_order_id,
      orderKey: session.woo_order_key,
      created: false,
    };
  }

  if (!session.payment_intent_id) {
    throw new FulfillmentError("no_payment_intent", 400, "Session has no payment intent");
  }
  if (!session.shipping_address) {
    throw new FulfillmentError("no_address", 400, "Session missing address");
  }

  const { paymentMethodTitle, providerRef } = await verifyPayment(session);
  const order = await createWooOrderForSession(session, paymentMethodTitle, providerRef);

  await updateCheckoutSession(session.id, {
    status: "completed",
    woo_order_id: order.id,
    woo_order_key: order.order_key,
  });

  return { orderId: order.id, orderKey: order.order_key, created: true };
}

async function verifyPayment(
  session: CheckoutSession,
): Promise<{ paymentMethodTitle: string; providerRef: string }> {
  const provider = session.payment_provider;
  const ref = session.payment_intent_id!;

  if (provider === "stripe") {
    const stripe = getStripeClient();
    if (!stripe) throw new FulfillmentError("stripe_unconfigured", 503, "Stripe not configured");
    let intent;
    try {
      intent = await stripe.paymentIntents.retrieve(ref);
    } catch (error) {
      log.error("Failed to retrieve PaymentIntent", error);
      throw new FulfillmentError("verify_failed", 502, "Payment verification failed");
    }
    if (intent.status !== "succeeded") {
      throw new FulfillmentError(
        "not_paid",
        402,
        `Payment not completed (status: ${intent.status})`,
      );
    }
    return { paymentMethodTitle: "Stripe (Card)", providerRef: intent.id };
  }

  if (provider === "paystack") {
    let tx;
    try {
      tx = await verifyPaystackTransaction(ref);
    } catch (error) {
      log.error("Failed to verify Paystack transaction", error);
      throw new FulfillmentError("verify_failed", 502, "Payment verification failed");
    }
    if (tx.status !== "success") {
      throw new FulfillmentError(
        "not_paid",
        402,
        `Payment not completed (status: ${tx.status})`,
      );
    }
    return { paymentMethodTitle: "Paystack", providerRef: tx.reference };
  }

  throw new FulfillmentError("unknown_provider", 400, "Unknown payment provider");
}

async function createWooOrderForSession(
  session: CheckoutSession,
  paymentMethodTitle: string,
  providerRef: string,
) {
  const shipAddr = session.shipping_address!;
  // Billing defaults to the shipping address (single-address checkout). When
  // the order ships to a different recipient, the buyer's billing address is
  // stored separately.
  const billAddr = session.billing_address ?? shipAddr;
  const provider = session.payment_provider!;
  const gift = session.gift_options;

  const billing = {
    first_name: billAddr.first_name,
    last_name: billAddr.last_name,
    company: "",
    address_1: billAddr.address_1,
    address_2: billAddr.address_2 ?? "",
    city: billAddr.city,
    state: billAddr.state ?? "",
    postcode: billAddr.postcode ?? "",
    country: billAddr.country,
    phone: billAddr.phone,
    email: session.email,
  };
  const shipping = {
    first_name: shipAddr.first_name,
    last_name: shipAddr.last_name,
    company: "",
    address_1: shipAddr.address_1,
    address_2: shipAddr.address_2 ?? "",
    city: shipAddr.city,
    state: shipAddr.state ?? "",
    postcode: shipAddr.postcode ?? "",
    country: shipAddr.country,
    phone: shipAddr.phone,
  };
  const providerMetaKey =
    provider === "stripe" ? "_stripe_payment_intent_id" : "_paystack_reference";

  const metaData: { key: string; value: string | number | boolean }[] = [
    { key: "_oc_checkout_session_id", value: session.id },
    { key: providerMetaKey, value: providerRef },
  ];

  // Attach gift options for fulfillment. The message goes into customer_note
  // (native WC field, shown on the order); the rest are meta flags.
  let customerNote: string | undefined;
  if (gift?.isGift) {
    metaData.push({ key: "_oc_is_gift", value: true });
    if (gift.wrap) metaData.push({ key: "_oc_gift_wrap", value: true });
    if (gift.giftReceipt) metaData.push({ key: "_oc_gift_receipt", value: true });
    if (gift.from) metaData.push({ key: "_oc_gift_from", value: gift.from });

    const parts: string[] = ["🎁 GIFT ORDER"];
    if (gift.wrap) parts.push("Gift wrapping requested.");
    if (gift.giftReceipt) parts.push("Gift receipt — do not show prices.");
    if (gift.message) parts.push(`Message: "${gift.message}"`);
    if (gift.from) parts.push(`From: ${gift.from}`);
    customerNote = parts.join("\n");
  }

  try {
    return await createWooOrder({
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
      ...(customerNote ? { customer_note: customerNote } : {}),
      meta_data: metaData,
    });
  } catch (error) {
    log.error("Failed to create Woo order", error);
    await updateCheckoutSession(session.id, {
      status: "failed",
      failure_reason: "woo_order_creation_failed",
    });
    throw new FulfillmentError(
      "woo_failed",
      500,
      "Order creation failed. Your card was charged — contact support.",
    );
  }
}
