import "server-only";
import { cookies, headers } from "next/headers";

export const COUNTRY_COOKIE = "oc-country";
export const DEFAULT_COUNTRY = "NG";

// Country → currency (ISO 4217). Defaults to NGN for anywhere we don't list.
// Extend as your WCPBC zones expand. Currency is what we'll charge in;
// country is the geo identity (passed to Woo's `?country=XX` for WCPBC).
const CURRENCY_BY_COUNTRY: Record<string, string> = {
  NG: "NGN",
  KE: "KES",
  GB: "GBP",
  IE: "EUR",
  DE: "EUR",
  FR: "EUR",
  ES: "EUR",
  IT: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  PT: "EUR",
  FI: "EUR",
  GR: "EUR",
  US: "USD",
  CA: "USD",
};

export function currencyForCountry(country: string): string {
  return CURRENCY_BY_COUNTRY[country.toUpperCase()] ?? "NGN";
}

function readGeoHeaders(h: Headers): string | null {
  // Vercel, Cloudflare, then a generic X-Country header for proxies.
  const v = h.get("x-vercel-ip-country");
  if (v && v.length === 2) return v.toUpperCase();
  const c = h.get("cf-ipcountry");
  if (c && c.length === 2 && c !== "XX") return c.toUpperCase();
  const x = h.get("x-country");
  if (x && x.length === 2) return x.toUpperCase();
  return null;
}

/**
 * Country to use for this request:
 *  1. `oc-country` cookie (user override or previously detected)
 *  2. Geo header from Vercel/Cloudflare
 *  3. DEFAULT_COUNTRY
 */
export async function getActiveCountry(): Promise<string> {
  const c = await cookies();
  const cookieValue = c.get(COUNTRY_COOKIE)?.value;
  if (cookieValue && cookieValue.length === 2) return cookieValue.toUpperCase();

  const h = await headers();
  return readGeoHeaders(h) ?? DEFAULT_COUNTRY;
}

export async function getActiveCurrency(): Promise<string> {
  return currencyForCountry(await getActiveCountry());
}
