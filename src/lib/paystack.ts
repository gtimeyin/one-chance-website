import "server-only";
import { createLogger } from "./logger";

const log = createLogger("paystack");

const PAYSTACK_BASE = "https://api.paystack.co";

export function isPaystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface PaystackInitResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaystackTransaction {
  id: number;
  reference: string;
  amount: number;       // minor units (kobo for NGN)
  currency: string;
  status: string;       // "success", "failed", "abandoned", "pending"
  paid_at?: string;
  customer?: { email: string };
  metadata?: Record<string, unknown>;
}

async function paystackRequest<T>(
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<PaystackResponse<T>> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("PAYSTACK_SECRET_KEY not configured");

  const response = await fetch(`${PAYSTACK_BASE}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    // Paystack is a payment API — never cache, always fresh.
    cache: "no-store",
  });

  const text = await response.text();
  let parsed: PaystackResponse<T>;
  try {
    parsed = JSON.parse(text);
  } catch {
    log.error(`Non-JSON response from Paystack ${path}`, { status: response.status, body: text.slice(0, 200) });
    throw new Error("Paystack returned a non-JSON response");
  }
  if (!response.ok || !parsed.status) {
    log.error(`Paystack ${path} failed`, { status: response.status, message: parsed.message });
    throw new Error(parsed.message || `Paystack ${response.status}`);
  }
  return parsed;
}

// Paystack expects amounts in the smallest currency unit. For all currencies
// it supports (NGN, GHS, ZAR, USD, KES) the smallest unit is 1/100 of the
// major unit, so a simple ×100 applies.
export function toPaystackAmount(amount: number): number {
  return Math.round(amount * 100);
}

export async function initializePaystackTransaction(input: {
  email: string;
  amount: number;       // major units
  currency: string;     // ISO 4217 (NGN, GHS, ZAR, USD, KES)
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, unknown>;
}): Promise<PaystackInitResponse> {
  const res = await paystackRequest<PaystackInitResponse>("/transaction/initialize", {
    method: "POST",
    body: {
      email: input.email,
      amount: toPaystackAmount(input.amount),
      currency: input.currency.toUpperCase(),
      ...(input.reference && { reference: input.reference }),
      ...(input.callback_url && { callback_url: input.callback_url }),
      ...(input.metadata && { metadata: input.metadata }),
    },
  });
  return res.data;
}

export async function verifyPaystackTransaction(
  reference: string,
): Promise<PaystackTransaction> {
  const res = await paystackRequest<PaystackTransaction>(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );
  return res.data;
}
