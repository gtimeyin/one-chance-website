import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { fulfillCheckoutSession, FulfillmentError } from "@/lib/checkout-fulfillment";
import { createLogger } from "@/lib/logger";

const log = createLogger("webhook/paystack");

interface PaystackEventData {
  reference?: string;
  metadata?: { checkout_session_id?: string };
}
interface PaystackEvent {
  event: string;
  data: PaystackEventData;
}

function verifyPaystackSignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  // Paystack uses HMAC SHA-512 over the raw request body with the secret key.
  const expected = createHmac("sha512", secret).update(body).digest("hex");
  try {
    return timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Paystack webhook not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  if (!verifyPaystackSignature(body, signature, secret)) {
    log.warn("Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: PaystackEvent;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event !== "charge.success") {
    return NextResponse.json({ ok: true, ignored: event.event });
  }

  // Prefer metadata.checkout_session_id (we set it on initialize); fall back
  // to parsing it from the `oc_<sessionId>` reference we generated.
  let sessionId = event.data.metadata?.checkout_session_id;
  if (!sessionId && event.data.reference?.startsWith("oc_")) {
    sessionId = event.data.reference.slice("oc_".length);
  }
  if (!sessionId) {
    log.warn("Paystack event missing session id", { reference: event.data.reference });
    return NextResponse.json({ ok: true, skipped: "no_session_id" });
  }

  try {
    const result = await fulfillCheckoutSession(sessionId);
    log.info("Webhook fulfilled", { sessionId, orderId: result.orderId, created: result.created });
    return NextResponse.json({ ok: true, orderId: result.orderId, created: result.created });
  } catch (error) {
    if (error instanceof FulfillmentError) {
      if (error.code === "session_not_found" || error.code === "not_paid") {
        log.warn(`Fulfillment skip (${error.code})`, { sessionId });
        return NextResponse.json({ ok: true, skipped: error.code });
      }
      log.error("Fulfillment failed", { sessionId, code: error.code });
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.httpStatus >= 500 ? error.httpStatus : 500 },
      );
    }
    log.error("Unexpected fulfillment error", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
