import { NextResponse } from "next/server";
import { z } from "zod";
import { headers, cookies } from "next/headers";
import {
  createCheckoutSession,
  updateCheckoutSession,
  priceCart,
  PriceCartError,
} from "@/lib/checkout-session";
import { getStripeClient, toMinorUnits } from "@/lib/stripe";
import { rateLimit } from "@/lib/rate-limit";
import { decrypt } from "@/lib/session-crypto";
import { validateReferralCodeForCheckout } from "@/lib/referral";
import { createLogger } from "@/lib/logger";

const log = createLogger("checkout/create-session");

const CartLineSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(99),
  variationId: z.number().int().positive().optional(),
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

const GiftOptionsSchema = z.object({
  isGift: z.boolean(),
  message: z.string().trim().max(500).optional(),
  from: z.string().trim().max(100).optional(),
  wrap: z.boolean().optional(),
  giftReceipt: z.boolean().optional(),
});

// Note: `cart` lines accept only productId/quantity/variationId — name,
// unitPrice, image, currency etc. are looked up server-side. Any extra
// fields sent by the client are ignored.
const BodySchema = z.object({
  email: z.string().trim().email().max(254),
  cart: z.array(CartLineSchema).min(1).max(50),
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema.optional(),
  giftOptions: GiftOptionsSchema.optional(),
  referralCode: z.string().trim().max(64).optional(),
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
  const { email, cart, shippingAddress, billingAddress, giftOptions, referralCode } = parsed.data;

  // Server-authoritative pricing. The client's displayed prices are derived
  // from the same source, so they should match what the user saw — but if
  // they don't, the server value wins.
  let priced;
  try {
    priced = await priceCart(cart, shippingAddress.country);
  } catch (error) {
    if (error instanceof PriceCartError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 400 });
    }
    log.error("priceCart failed", error);
    return NextResponse.json({ error: "Could not price cart" }, { status: 500 });
  }

  const cookieStore = await cookies();
  const session = await decrypt(cookieStore.get("session")?.value);
  const customerId = session?.customerId ?? null;

  // Validate & apply the referral discount if one was provided. Fail closed:
  // if the user passed a code that no longer validates (e.g. they used it on
  // a prior order between the preview and submit), reject the checkout so
  // they see the reason rather than silently drop the discount.
  let referralDiscount = 0;
  let acceptedReferralCode: string | undefined;
  if (referralCode) {
    const referralResult = await validateReferralCodeForCheckout({
      code: referralCode,
      buyerCustomerId: customerId,
      subtotal: priced.subtotal,
    });
    if (!referralResult.valid) {
      return NextResponse.json(
        { error: referralResult.message || "Referral code is not valid.", code: "referral_invalid" },
        { status: 400 },
      );
    }
    referralDiscount = referralResult.discount;
    acceptedReferralCode = referralResult.code;
  }

  const amount = Math.max(0, priced.subtotal - referralDiscount);
  if (amount <= 0) {
    return NextResponse.json({ error: "Amount must be > 0" }, { status: 400 });
  }

  const checkoutSession = await createCheckoutSession({
    customerId,
    email,
    cart: priced.cart,
    shippingAddress,
    billingAddress: giftOptions?.isGift ? billingAddress : undefined,
    giftOptions: giftOptions?.isGift ? giftOptions : undefined,
    currency: priced.currency,
    amount,
  });
  if (!checkoutSession) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: toMinorUnits(amount, priced.currency),
      currency: priced.currency.toLowerCase(),
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
      metadata: {
        checkout_session_id: checkoutSession.id,
        ...(acceptedReferralCode
          ? {
              referral_code: acceptedReferralCode,
              referral_discount: String(referralDiscount),
            }
          : {}),
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
      subtotal: priced.subtotal,
      referralDiscount,
      referralCode: acceptedReferralCode,
      currency: priced.currency,
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
