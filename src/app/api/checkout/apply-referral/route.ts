import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session-crypto";
import { priceCart, PriceCartError } from "@/lib/checkout-session";
import { validateReferralCodeForCheckout } from "@/lib/referral";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { createLogger } from "@/lib/logger";

const log = createLogger("checkout/apply-referral");

const BodySchema = z.object({
  code: z.string().trim().min(1).max(64),
  country: z.string().length(2),
  cart: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().min(1).max(99),
    variationId: z.number().int().positive().optional(),
  })).min(1).max(50),
});

export async function POST(request: Request) {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`apply-referral:${ip}`, 20, 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { code, country, cart } = parsed.data;

  let priced;
  try {
    priced = await priceCart(cart, country);
  } catch (e) {
    if (e instanceof PriceCartError) {
      return NextResponse.json({ error: e.message, code: e.code }, { status: 400 });
    }
    log.error("priceCart failed", e);
    return NextResponse.json({ error: "Could not price cart" }, { status: 500 });
  }

  const cookieStore = await cookies();
  const session = await decrypt(cookieStore.get("session")?.value);
  const buyerCustomerId = session?.customerId ?? null;

  const result = await validateReferralCodeForCheckout({
    code,
    buyerCustomerId,
    subtotal: priced.subtotal,
  });

  return NextResponse.json({
    valid: result.valid,
    discount: result.discount,
    percent: result.percent,
    currency: priced.currency,
    code: result.code,
    message: result.message,
  });
}
