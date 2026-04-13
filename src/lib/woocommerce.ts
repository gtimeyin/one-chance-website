import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { createLogger } from "./logger";

const log = createLogger("woocommerce");

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
  categories: { id: number; name: string; slug: string }[];
  tags: { id: number; name: string; slug: string }[];
  images: { id: number; src: string; name: string; alt: string }[];
  attributes: { id: number; name: string; options: string[] }[];
  variations: number[];
  cross_sell_ids: number[];
  upsell_ids: number[];
  meta_data?: { id: number; key: string; value: string }[];
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
      ...(params?.country && { country: params.country }),
    });

    return response.data;
  } catch (error) {
    log.error("Error fetching products", error);
    return [];
  }
}

export async function getProduct(slug: string, country?: string): Promise<WooProduct | null> {
  const client = getApiClient();
  if (!client) return null;

  try {
    const response = await client.get("products", {
      slug,
      ...(country && { country }),
    });
    return response.data[0] || null;
  } catch (error) {
    log.error("Error fetching product", error);
    return null;
  }
}

export async function getProductById(id: number, country?: string): Promise<WooProduct | null> {
  const client = getApiClient();
  if (!client) return null;

  try {
    const queryParams = country ? `?country=${country}` : "";
    const response = await client.get(`products/${id}${queryParams}`);
    return response.data;
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
      ...(country && { country }),
    });
    return response.data;
  } catch (error) {
    log.error("Error fetching products by IDs", error);
    return [];
  }
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
    const response = await client.get("customers", { email, per_page: 1 });
    return response.data[0] || null;
  } catch (error) {
    log.error("Error fetching customer by email", error);
    return null;
  }
}

export async function getCustomerById(id: number): Promise<WooCustomer | null> {
  const client = getApiClient();
  if (!client) return null;

  try {
    const response = await client.get(`customers/${id}`);
    return response.data;
  } catch (error) {
    log.error("Error fetching customer by ID", error);
    return null;
  }
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

export async function getCustomerOrders(
  customerId: number,
  params?: { per_page?: number; page?: number }
): Promise<WooOrder[]> {
  const client = getApiClient();
  if (!client) return [];

  try {
    const response = await client.get("orders", {
      customer: customerId,
      per_page: params?.per_page || 20,
      page: params?.page || 1,
      orderby: "date",
      order: "desc",
    });
    return response.data;
  } catch (error) {
    log.error("Error fetching customer orders", error);
    return [];
  }
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

export async function verifyWordPressCredentials(
  email: string,
  password: string
): Promise<{ wpUserId: number; email: string } | null> {
  const wpUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "https://shopapi.yvpgame.com";

  // Reject inputs containing XML control sequences before building payload
  if (/[<>&]/.test(email) || email.length > 254) return null;
  if (password.length > 1000 || password.length === 0) return null;

  try {
    // Use XML-RPC to verify credentials (works without Application Passwords)
    // Base64-encode credentials to avoid any XML injection regardless of input content
    const emailB64 = Buffer.from(email, "utf-8").toString("base64");
    const passB64 = Buffer.from(password, "utf-8").toString("base64");

    const xmlBody = `<?xml version="1.0"?><methodCall><methodName>wp.getUsersBlogs</methodName><params><param><value><base64>${emailB64}</base64></value></param><param><value><base64>${passB64}</base64></value></param></params></methodCall>`;

    const response = await fetch(`${wpUrl}/xmlrpc.php`, {
      method: "POST",
      headers: { "Content-Type": "text/xml" },
      body: xmlBody,
    });

    if (!response.ok) return null;

    const text = await response.text();

    // XML-RPC returns <fault> on auth failure
    if (text.includes("faultCode")) return null;

    return { wpUserId: 0, email };
  } catch (error) {
    log.error("Error verifying WordPress credentials", error);
    return null;
  }
}
