import "server-only";
import Stripe from "stripe";
import { createLogger } from "./logger";

const log = createLogger("stripe");

let client: Stripe | null = null;

function hasStripeCredentials(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripeClient(): Stripe | null {
  if (!hasStripeCredentials()) {
    log.warn("STRIPE_SECRET_KEY not configured");
    return null;
  }
  if (!client) {
    // No explicit apiVersion — let the installed SDK default apply, which
    // matches the types pinned in @types/stripe via the `stripe` package.
    client = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return client;
}

export function isStripeConfigured(): boolean {
  return hasStripeCredentials();
}

// Stripe expects amounts in the smallest currency unit (e.g. cents, kobo).
// Zero-decimal currencies are charged as-is; everything else multiplies by 100.
const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW",
  "MGA", "PYG", "RWF", "UGX", "VND", "VUV", "XAF", "XOF", "XPF",
]);

export function toMinorUnits(amount: number, currency: string): number {
  const upper = currency.toUpperCase();
  if (ZERO_DECIMAL_CURRENCIES.has(upper)) return Math.round(amount);
  return Math.round(amount * 100);
}

export function fromMinorUnits(amount: number, currency: string): number {
  const upper = currency.toUpperCase();
  if (ZERO_DECIMAL_CURRENCIES.has(upper)) return amount;
  return amount / 100;
}
