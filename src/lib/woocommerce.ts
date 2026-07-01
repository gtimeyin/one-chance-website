import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { unstable_cache } from "next/cache";
import { createLogger } from "./logger";
import { zoneSlugForCountry } from "./currency";
import { getMetaValue } from "./woocommerce-shared";

// Re-export the pure, client-safe types and helpers so existing server-side
// consumers can keep importing them from "@/lib/woocommerce". Client Components
// should import directly from "@/lib/woocommerce-shared" to avoid pulling the
// REST client into the browser bundle.
export type { WooProduct, WooReview, WooCategory } from "./woocommerce-shared";
export { getAttribute, getMetaValue, getMetaJson } from "./woocommerce-shared";

import type { WooProduct, WooReview, WooCategory } from "./woocommerce-shared";

const log = createLogger("woocommerce");

async function timed<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    return await fn();
  } finally {
    log.info(`${label} took ${Date.now() - start}ms`);
  }
}

/**
 * Override a product's `price`/`regular_price`/`sale_price` with the WCPBC
 * zone-specific values stored in meta_data (e.g. `_nigeria_regular_price`).
 * WCPBC ignores the REST `?country=` param, so we apply the zone here on the
 * server before products leave the data layer. If no zone matches the country,
 * the base prices (in the store's base currency) are returned unchanged.
 */
export function applyZonePricing(product: WooProduct, country: string | undefined): WooProduct {
  if (!country) return product;
  const zone = zoneSlugForCountry(country);
  if (!zone) return product;

  const zonePrice = getMetaValue(product, `_${zone}_price`);
  if (!zonePrice) return product;

  const regular = getMetaValue(product, `_${zone}_regular_price`) ?? zonePrice;
  const sale = getMetaValue(product, `_${zone}_sale_price`);
  const onSale = Boolean(sale && parseFloat(sale) < parseFloat(regular));

  return {
    ...product,
    price: zonePrice,
    regular_price: regular,
    sale_price: sale ?? "",
    on_sale: onSale,
  };
}

const hasApiCredentials = (): boolean => {
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  return Boolean(
    key && secret && key !== "" && secret !== "" &&
    !key.includes("your_consumer_key") && !secret.includes("your_consumer_secret")
  );
};

let api: WooCommerceRestApi | null = null;

const getApiClient = (): WooCommerceRestApi | null => {
  if (!hasApiCredentials()) {
    log.warn("API credentials not configured");
    return null;
  }

  if (!api) {
    api = new WooCommerceRestApi({
      url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "https://shopapi.yvpgame.com",
      consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY!,
      consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
      version: "wc/v3",
    });
  }

  return api;
};

export async function getProducts(params?: {
  per_page?: number;
  page?: number;
  category?: string;
  featured?: boolean;
  on_sale?: boolean;
  search?: string;
  orderby?: string;
  order?: "asc" | "desc";
  country?: string;
}): Promise<WooProduct[]> {
  const client = getApiClient();
  if (!client) return [];

  try {
    const response = await client.get("products", {
      per_page: params?.per_page || 12,
      page: params?.page || 1,
      category: params?.category,
      featured: params?.featured,
      on_sale: params?.on_sale,
      search: params?.search,
      orderby: params?.orderby || "date",
      order: params?.order || "desc",
      status: "publish",
    });

    const products: WooProduct[] = response.data;
    return products.map((p) => applyZonePricing(p, params?.country));
  } catch (error) {
    log.error("Error fetching products", error);
    return [];
  }
}

export async function getProduct(slug: string, country?: string): Promise<WooProduct | null> {
  const client = getApiClient();
  if (!client) return null;

  try {
    const response = await client.get("products", { slug });
    const product = response.data[0] as WooProduct | undefined;
    return product ? applyZonePricing(product, country) : null;
  } catch (error) {
    log.error("Error fetching product", error);
    return null;
  }
}

export async function getProductById(id: number, country?: string): Promise<WooProduct | null> {
  const client = getApiClient();
  if (!client) return null;

  try {
    const response = await client.get(`products/${id}`);
    const product = response.data as WooProduct | undefined;
    return product ? applyZonePricing(product, country) : null;
  } catch (error) {
    log.error("Error fetching product by ID", error);
    return null;
  }
}

export async function getFeaturedProducts(limit = 4, country?: string): Promise<WooProduct[]> {
  return getProducts({ featured: true, per_page: limit, country });
}

export async function getProductsByIds(ids: number[], country?: string): Promise<WooProduct[]> {
  if (ids.length === 0) return [];

  const client = getApiClient();
  if (!client) return [];

  try {
    const response = await client.get("products", {
      include: ids.join(","),
      per_page: ids.length,
    });
    const products: WooProduct[] = response.data;
    return products.map((p) => applyZonePricing(p, country));
  } catch (error) {
    log.error("Error fetching products by IDs", error);
    return [];
  }
}

export async function getProductReviews(
  productId: number,
  limit = 10
): Promise<WooReview[]> {
  const client = getApiClient();
  if (!client) return [];

  try {
    const response = await client.get("products/reviews", {
      product: productId,
      per_page: limit,
      status: "approved",
      orderby: "date",
      order: "desc",
    });
    return response.data;
  } catch (error) {
    log.error("Error fetching product reviews", error);
    return [];
  }
}

export async function createProductReview(data: {
  product_id: number;
  reviewer: string;
  reviewer_email: string;
  review: string;
  rating: number;
}): Promise<WooReview> {
  const client = getApiClient();
  if (!client) throw new Error("API not configured");

  const response = await client.post("products/reviews", data);
  return response.data;
}

// ─── Shipping zones ──────────────────────────────────────────────

export interface WooShippingZone {
  id: number;
  name: string;
  order: number;
}

export interface WooShippingZoneLocation {
  code: string;       // ISO 3166-1 alpha-2 country code (or state code for "state" type)
  type: "country" | "state" | "postcode" | "continent";
}

export interface WooShippingMethod {
  id: number;             // instance id
  instance_id: number;
  title: string;
  order: number;
  enabled: boolean;
  method_id: string;      // e.g. "flat_rate", "free_shipping", "local_pickup"
  method_title: string;
  method_description: string;
  settings?: Record<string, { id: string; value: string }>;
}

export async function getShippingZones(): Promise<WooShippingZone[]> {
  const client = getApiClient();
  if (!client) return [];
  try {
    const response = await client.get("shipping/zones");
    return response.data;
  } catch (error) {
    log.error("Error fetching shipping zones", error);
    return [];
  }
}

export async function getShippingZoneLocations(
  zoneId: number
): Promise<WooShippingZoneLocation[]> {
  const client = getApiClient();
  if (!client) return [];
  try {
    const response = await client.get(`shipping/zones/${zoneId}/locations`);
    return response.data;
  } catch (error) {
    log.error("Error fetching shipping zone locations", error);
    return [];
  }
}

export async function getShippingZoneMethods(
  zoneId: number
): Promise<WooShippingMethod[]> {
  const client = getApiClient();
  if (!client) return [];
  try {
    const response = await client.get(`shipping/zones/${zoneId}/methods`);
    return response.data;
  } catch (error) {
    log.error("Error fetching shipping zone methods", error);
    return [];
  }
}

// ─── Order creation ──────────────────────────────────────────────

export interface CreateWooOrderInput {
  customer_id?: number;
  payment_method: string;
  payment_method_title: string;
  set_paid?: boolean;
  status?: string;
  currency: string;
  billing: WooAddress & { email: string };
  shipping: WooAddress;
  line_items: { product_id: number; quantity: number; variation_id?: number }[];
  shipping_lines?: { method_id: string; method_title: string; total: string }[];
  customer_note?: string;
  meta_data?: { key: string; value: string | number | boolean }[];
}

export async function createWooOrder(input: CreateWooOrderInput): Promise<WooOrder> {
  const client = getApiClient();
  if (!client) throw new Error("Woo API not configured");
  const response = await client.post("orders", input);
  return response.data;
}

export async function getCategories(): Promise<WooCategory[]> {
  const client = getApiClient();
  if (!client) return [];

  try {
    const response = await client.get("products/categories", {
      per_page: 100,
      hide_empty: true,
    });
    return response.data;
  } catch (error) {
    log.error("Error fetching categories", error);
    return [];
  }
}

export function isApiConfigured(): boolean {
  return hasApiCredentials();
}

// ─── Customer CRUD ───────────────────────────────────────────────

import type { WooCustomer, WooOrder, WooAddress } from "./auth-definitions";

export async function getCustomerByEmail(email: string): Promise<WooCustomer | null> {
  const client = getApiClient();
  if (!client) return null;

  try {
    // role: "all" so we match every WordPress user by email, not just those
    // with the "customer" role. Otherwise admins/shop-managers/subscribers —
    // valid WP accounts — return nothing here and can never log in.
    const response = await timed("GET customers?email=", () =>
      client.get("customers", { email, per_page: 1, role: "all" })
    );
    return response.data[0] || null;
  } catch (error) {
    log.error("Error fetching customer by email", error);
    return null;
  }
}

async function fetchCustomerById(id: number): Promise<WooCustomer | null> {
  const client = getApiClient();
  if (!client) return null;

  try {
    const response = await timed(`GET customers/${id}`, () =>
      client.get(`customers/${id}`)
    );
    return response.data;
  } catch (error) {
    log.error("Error fetching customer by ID", error);
    return null;
  }
}

export async function getCustomerById(id: number): Promise<WooCustomer | null> {
  return unstable_cache(
    () => fetchCustomerById(id),
    ["wc-customer-by-id", String(id)],
    { tags: [`customer:${id}`], revalidate: 30 }
  )();
}

export async function createCustomer(data: {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}): Promise<WooCustomer> {
  const client = getApiClient();
  if (!client) throw new Error("API not configured");

  const response = await client.post("customers", {
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    password: data.password,
    username: data.email,
  });
  return response.data;
}

export async function updateCustomer(
  id: number,
  data: Partial<{
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    billing: Partial<WooAddress>;
    shipping: Partial<WooAddress>;
  }>
): Promise<WooCustomer> {
  const client = getApiClient();
  if (!client) throw new Error("API not configured");

  const response = await client.put(`customers/${id}`, data);
  return response.data;
}

// ─── Orders ──────────────────────────────────────────────────────

async function fetchCustomerOrders(
  customerId: number,
  perPage: number,
  page: number
): Promise<WooOrder[]> {
  const client = getApiClient();
  if (!client) return [];

  try {
    const response = await timed(
      `GET orders?customer=${customerId}&per_page=${perPage}&page=${page}`,
      () =>
        client.get("orders", {
          customer: customerId,
          per_page: perPage,
          page,
          orderby: "date",
          order: "desc",
        })
    );
    return response.data;
  } catch (error) {
    log.error("Error fetching customer orders", error);
    return [];
  }
}

export async function getCustomerOrders(
  customerId: number,
  params?: { per_page?: number; page?: number }
): Promise<WooOrder[]> {
  const perPage = params?.per_page || 20;
  const page = params?.page || 1;
  return unstable_cache(
    () => fetchCustomerOrders(customerId, perPage, page),
    ["wc-orders-by-customer", String(customerId), String(perPage), String(page)],
    { tags: [`orders:${customerId}`], revalidate: 30 }
  )();
}

export async function getOrderById(orderId: number): Promise<WooOrder | null> {
  const client = getApiClient();
  if (!client) return null;

  try {
    const response = await client.get(`orders/${orderId}`);
    return response.data;
  } catch (error) {
    log.error("Error fetching order by ID", error);
    return null;
  }
}

// ─── WordPress Authentication ────────────────────────────────────

// Pull a named member's scalar value out of an XML-RPC <struct> response.
function extractXmlRpcMember(xml: string, name: string): string | null {
  const re = new RegExp(
    `<name>${name}</name>\\s*<value>\\s*<(?:string|int|i4|base64)>([\\s\\S]*?)</(?:string|int|i4|base64)>`,
    "i"
  );
  const m = xml.match(re);
  return m ? m[1] : null;
}

export async function verifyWordPressCredentials(
  email: string,
  password: string
): Promise<{ wpUserId: number; email: string } | null> {
  const wpUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "https://shopapi.yvpgame.com";

  // Reject inputs containing XML control sequences before building payload
  if (/[<>&]/.test(email) || email.length > 254) return null;
  if (password.length > 1000 || password.length === 0) return null;

  try {
    // Use XML-RPC to verify credentials (works without Application Passwords).
    // wp.getProfile both authenticates AND returns the authenticated user's own
    // profile, so we can bind the session to the *real* identity (canonical
    // email + user id) instead of trusting that the submitted string maps to a
    // single account. Base64-encode credentials to avoid any XML injection.
    const emailB64 = Buffer.from(email, "utf-8").toString("base64");
    const passB64 = Buffer.from(password, "utf-8").toString("base64");

    const xmlBody = `<?xml version="1.0"?><methodCall><methodName>wp.getProfile</methodName><params><param><value><int>1</int></value></param><param><value><base64>${emailB64}</base64></value></param><param><value><base64>${passB64}</base64></value></param></params></methodCall>`;

    const response = await timed("POST xmlrpc.php (wp.getProfile)", () =>
      fetch(`${wpUrl}/xmlrpc.php`, {
        method: "POST",
        headers: { "Content-Type": "text/xml" },
        body: xmlBody,
      })
    );

    if (!response.ok) return null;

    const text = await response.text();

    // XML-RPC returns <fault> on auth failure
    if (text.includes("faultCode")) return null;

    // Bind to the authenticated principal. Fail closed if the response shape is
    // unexpected rather than falling back to the submitted email.
    const canonicalEmail = extractXmlRpcMember(text, "email");
    if (!canonicalEmail) return null;
    const userIdStr = extractXmlRpcMember(text, "user_id");

    return {
      wpUserId: userIdStr ? parseInt(userIdStr, 10) : 0,
      email: canonicalEmail.trim().toLowerCase(),
    };
  } catch (error) {
    log.error("Error verifying WordPress credentials", error);
    return null;
  }
}
