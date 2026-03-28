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
