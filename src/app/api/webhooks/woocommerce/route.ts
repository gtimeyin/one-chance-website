import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { processReferralForOrder } from "@/lib/referral";
import { createLogger } from "@/lib/logger";

const log = createLogger("webhook");

function verifyWebhookSignature(
  body: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(body).digest("base64");
  return signature === expected;
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.WOOCOMMERCE_WEBHOOK_SECRET;

  const body = await request.text();
  const signature = request.headers.get("x-wc-webhook-signature");
  const topic = request.headers.get("x-wc-webhook-topic");

  // Verify signature if secret is configured
  if (webhookSecret) {
    if (!verifyWebhookSignature(body, signature, webhookSecret)) {
      log.warn("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  // Only process order completion events
  if (topic !== "order.completed" && topic !== "order.updated") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  let order;
  try {
    order = JSON.parse(body);
  } catch {
    log.error("Failed to parse webhook body");
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Only process completed orders
  if (order.status !== "completed") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const customerId = order.customer_id;
  const orderId = order.id;
  const orderTotal = parseFloat(order.total || "0");

  if (!customerId || !orderId || orderTotal <= 0) {
    log.warn("Incomplete order data in webhook", { customerId, orderId, orderTotal });
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    const processed = await processReferralForOrder(customerId, orderId, orderTotal);
    log.info("Webhook processed", { orderId, referralProcessed: processed });
    return NextResponse.json({ ok: true, processed });
  } catch (error) {
    log.error("Webhook processing failed", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}

// WooCommerce sends a ping on webhook creation
export async function GET() {
  return NextResponse.json({ ok: true });
}
