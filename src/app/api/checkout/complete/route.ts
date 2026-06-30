import { NextResponse } from "next/server";
import { z } from "zod";
import { fulfillCheckoutSession, FulfillmentError } from "@/lib/checkout-fulfillment";
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

  try {
    const result = await fulfillCheckoutSession(parsed.data.sessionId);
    return NextResponse.json({
      orderId: result.orderId,
      orderKey: result.orderKey,
    });
  } catch (error) {
    if (error instanceof FulfillmentError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.httpStatus },
      );
    }
    log.error("Unexpected fulfillment error", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
