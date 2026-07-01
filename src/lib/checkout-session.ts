import "server-only";
import { getSupabaseClient } from "./supabase";
import { createLogger } from "./logger";
import { getProductsByIds, type WooProduct } from "./woocommerce";
import { currencyForCountry } from "./currency";
import { getImageSrc } from "./utils";

const log = createLogger("checkout-session");

export interface CheckoutCartLine {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number; // major units, e.g. 45000 (NGN) or 32 (GBP)
  sku?: string;
  variationId?: number;
  image?: string;
}

export interface CheckoutAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state?: string;
  postcode?: string;
  country: string;
  phone: string;
}

export interface GiftOptions {
  isGift: boolean;
  message?: string;      // personalised note, printed on a gift card
  from?: string;         // "from" name
  wrap?: boolean;        // add (free) gift wrapping
  giftReceipt?: boolean; // omit prices on the packing slip
}

export interface CheckoutShippingMethod {
  zone_id: number;
  method_id: string;       // e.g. "flat_rate", "free_shipping"
  instance_id: number;
  title: string;
  cost: number;            // major units
}

export type CheckoutStatus =
  | "started"
  | "payment_started"
  | "completed"
  | "failed"
  | "abandoned";

export type PaymentProvider = "stripe" | "paystack";

export interface CheckoutSession {
  id: string;
  customer_id: number | null;
  email: string;
  cart: CheckoutCartLine[];
  shipping_address: CheckoutAddress | null;
  billing_address: CheckoutAddress | null;
  shipping_method: CheckoutShippingMethod | null;
  gift_options: GiftOptions | null;
  currency: string;
  amount: number;
  status: CheckoutStatus;
  payment_provider: PaymentProvider | null;
  payment_intent_id: string | null;
  woo_order_id: number | null;
  woo_order_key: string | null;
  failure_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartRequestLine {
  productId: number;
  quantity: number;
  variationId?: number;
}

export interface PricedCartResult {
  cart: CheckoutCartLine[];
  subtotal: number;
  currency: string;
}

/**
 * Server-side pricing: given a country and a list of (productId, quantity)
 * pairs, fetches each product, applies WCPBC zone pricing, and computes the
 * authoritative subtotal + currency. Throws a tagged error if any line is
 * unfulfillable (product missing or has a zero price). Never trusts the
 * client to supply prices or currency.
 */
export async function priceCart(
  lines: CartRequestLine[],
  country: string,
): Promise<PricedCartResult> {
  if (lines.length === 0) {
    throw new PriceCartError("cart_empty", "Cart is empty");
  }

  const ids = Array.from(new Set(lines.map((l) => l.productId)));
  const products = await getProductsByIds(ids, country);
  const byId = new Map<number, WooProduct>(products.map((p) => [p.id, p]));

  const cart: CheckoutCartLine[] = [];
  let subtotal = 0;

  for (const line of lines) {
    const product = byId.get(line.productId);
    if (!product) {
      throw new PriceCartError(
        "product_missing",
        `Product ${line.productId} not found`,
      );
    }
    const unitPrice = parseFloat(product.price || "0");
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      throw new PriceCartError(
        "product_no_price",
        `Product ${product.name} has no price for this region`,
      );
    }
    if (product.stock_status === "outofstock") {
      throw new PriceCartError(
        "product_out_of_stock",
        `${product.name} is out of stock`,
      );
    }

    cart.push({
      productId: product.id,
      name: product.name,
      quantity: line.quantity,
      unitPrice,
      sku: product.sku || undefined,
      ...(line.variationId ? { variationId: line.variationId } : {}),
      image: getImageSrc(product.images),
    });
    subtotal += unitPrice * line.quantity;
  }

  return {
    cart,
    subtotal,
    currency: currencyForCountry(country),
  };
}

export class PriceCartError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "PriceCartError";
  }
}

export async function createCheckoutSession(input: {
  customerId: number | null;
  email: string;
  cart: CheckoutCartLine[];
  shippingAddress?: CheckoutAddress | null;
  billingAddress?: CheckoutAddress | null;
  shippingMethod?: CheckoutShippingMethod | null;
  giftOptions?: GiftOptions | null;
  currency: string;
  amount: number;
}): Promise<CheckoutSession | null> {
  const sb = getSupabaseClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from("checkout_sessions")
    .insert({
      customer_id: input.customerId,
      email: input.email,
      cart: input.cart,
      shipping_address: input.shippingAddress ?? null,
      billing_address: input.billingAddress ?? null,
      shipping_method: input.shippingMethod ?? null,
      gift_options: input.giftOptions ?? null,
      currency: input.currency,
      amount: input.amount,
      status: "started",
    })
    .select()
    .single();

  if (error) {
    log.error("Failed to create checkout session", error);
    return null;
  }
  return data as CheckoutSession;
}

export async function getCheckoutSession(id: string): Promise<CheckoutSession | null> {
  const sb = getSupabaseClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from("checkout_sessions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    log.error("Failed to fetch checkout session", error);
    return null;
  }
  return data as CheckoutSession | null;
}

export async function updateCheckoutSession(
  id: string,
  patch: Partial<
    Pick<
      CheckoutSession,
      | "status"
      | "payment_provider"
      | "payment_intent_id"
      | "woo_order_id"
      | "woo_order_key"
      | "failure_reason"
      | "amount"
      | "shipping_address"
      | "shipping_method"
    >
  >,
): Promise<CheckoutSession | null> {
  const sb = getSupabaseClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from("checkout_sessions")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    log.error("Failed to update checkout session", error);
    return null;
  }
  return data as CheckoutSession;
}
