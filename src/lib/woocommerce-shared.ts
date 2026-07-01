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
  // WooCommerce native "grouped" products expose child IDs here.
  grouped_products?: number[];
  // WooCommerce Product Bundles plugin exposes bundled items here.
  bundled_items?: { bundled_item_id: number; product_id: number; quantity_min?: number; quantity_max?: number }[];
  meta_data?: { id: number; key: string; value: unknown }[];
}

export type BundleKind = "grouped" | "bundle" | "yith_bundle";

/**
 * Returns the flavour of bundle for a product, or null for anything else.
 * - "grouped"     — native WooCommerce grouped products
 * - "bundle"      — WooCommerce Product Bundles plugin
 * - "yith_bundle" — YITH WooCommerce Product Bundles plugin
 */
export function bundleKind(product: WooProduct): BundleKind | null {
  if (product.type === "grouped") return "grouped";
  if (product.type === "bundle") return "bundle";
  if (product.type === "yith_bundle") return "yith_bundle";
  return null;
}

export function isBundle(product: WooProduct): boolean {
  return bundleKind(product) !== null;
}

// YITH stores bundle children as an object keyed by string ordinals, not an
// array — e.g. { "1": { bundle_order, product_id, bp_quantity }, "2": {...} }.
interface YithBundleEntry {
  bundle_order?: string | number;
  product_id?: string | number;
  bp_quantity?: string | number;
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return parseInt(value, 10) || 0;
  return 0;
}

/**
 * Extracts the child-product IDs from a bundle/grouped product, regardless
 * of which plugin (or native type) declared them. Preserves the merchant-
 * configured order.
 */
export function getBundleChildIds(product: WooProduct): number[] {
  if (product.type === "grouped" && Array.isArray(product.grouped_products)) {
    return product.grouped_products;
  }
  if (product.type === "bundle" && Array.isArray(product.bundled_items)) {
    return product.bundled_items.map((b) => b.product_id).filter((id) => id > 0);
  }
  if (product.type === "yith_bundle") {
    const raw = product.meta_data?.find((m) => m.key === "_yith_wcpb_bundle_data")?.value;
    if (raw && typeof raw === "object") {
      const entries = Object.values(raw as Record<string, YithBundleEntry>);
      return entries
        .slice()
        .sort((a, b) => toNumber(a.bundle_order) - toNumber(b.bundle_order))
        .map((e) => toNumber(e.product_id))
        .filter((id) => id > 0);
    }
  }
  return [];
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
