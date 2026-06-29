import "server-only";
import { cookies, headers } from "next/headers";
import {
  COUNTRY_COOKIE,
  DEFAULT_COUNTRY,
  currencyForCountry,
} from "./currency";

function readGeoHeaders(h: Headers): string | null {
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
