import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import { fulfillCheckoutSession, FulfillmentError } from "@/lib/checkout-fulfillment";
import { createLogger } from "@/lib/logger";

const log = createLogger("webhook/stripe");

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 503 });
  }

  // Raw body required for signature verification
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    log.warn("Invalid signature", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // We only act on success. payment_intent.payment_failed and others we
  // acknowledge with 200 so Stripe stops retrying.
  if (event.type !== "payment_intent.succeeded") {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const intent = event.data.object as Stripe.PaymentIntent;
  const sessionId = intent.metadata?.checkout_session_id;
  if (!sessionId) {
    log.warn("PaymentIntent missing checkout_session_id metadata", { intentId: intent.id });
    return NextResponse.json({ ok: true, skipped: "no_session_metadata" });
  }

  try {
    const result = await fulfillCheckoutSession(sessionId);
    log.info("Webhook fulfilled", { sessionId, orderId: result.orderId, created: result.created });
    return NextResponse.json({ ok: true, orderId: result.orderId, created: result.created });
  } catch (error) {
    if (error instanceof FulfillmentError) {
      // Returning 200 for "already completed" or "not_paid" prevents Stripe
      // from retrying forever; only 5xx for real server errors so it retries.
      if (error.code === "session_not_found" || error.code === "not_paid") {
        log.warn(`Fulfillment skip (${error.code})`, { sessionId });
        return NextResponse.json({ ok: true, skipped: error.code });
      }
      log.error("Fulfillment failed", { sessionId, code: error.code, message: error.message });
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.httpStatus >= 500 ? error.httpStatus : 500 },
      );
    }
    log.error("Unexpected fulfillment error", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
