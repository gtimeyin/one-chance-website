import "server-only";
import { getSupabaseClient } from "./supabase";
import { createLogger } from "./logger";

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
  shipping_method: CheckoutShippingMethod | null;
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

export async function createCheckoutSession(input: {
  customerId: number | null;
  email: string;
  cart: CheckoutCartLine[];
  shippingAddress?: CheckoutAddress | null;
  shippingMethod?: CheckoutShippingMethod | null;
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
      shipping_method: input.shippingMethod ?? null,
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
