// Pure, client-safe Woo types and helpers. No REST client, no secrets — safe to
// import from Client Components. The server-only data layer lives in
// `woocommerce.ts`, which re-exports everything here for server consumers.

export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  status: string;
  featured: boolean;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  stock_quantity: number | null;
  weight: string;
  dimensions: { length: string; width: string; height: string };
  average_rating: string;
  rating_count: number;
  categories: { id: number; name: string; slug: string }[];
  tags: { id: number; name: string; slug: string }[];
  images: { id: number; src: string; name: string; alt: string }[];
  attributes: { id: number; name: string; options: string[] }[];
  variations: number[];
  related_ids: number[];
  cross_sell_ids: number[];
  upsell_ids: number[];
  meta_data?: { id: number; key: string; value: unknown }[];
}

export interface WooReview {
  id: number;
  product_id: number;
  reviewer: string;
  review: string;
  rating: number;
  date_created: string;
  verified: boolean;
}

export interface WooCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  image: { id: number; src: string; name: string; alt: string } | null;
  count: number;
}

export function getAttribute(product: WooProduct, name: string): string | null {
  const target = name.trim().toLowerCase();
  const attr = product.attributes?.find((a) => a.name.trim().toLowerCase() === target);
  const value = attr?.options?.[0];
  return value && value.length > 0 ? value : null;
}

export function getMetaValue(product: WooProduct, key: string): string | null {
  const entry = product.meta_data?.find((m) => m.key === key);
  if (!entry || entry.value == null) return null;
  const value = typeof entry.value === "string" ? entry.value : String(entry.value);
  return value.length > 0 ? value : null;
}

export function getMetaJson<T>(product: WooProduct, key: string): T | null {
  const entry = product.meta_data?.find((m) => m.key === key);
  if (!entry || entry.value == null) return null;
  if (typeof entry.value === "object") return entry.value as T;
  if (typeof entry.value !== "string") return null;
  try {
    return JSON.parse(entry.value) as T;
  } catch {
    return null;
  }
}
