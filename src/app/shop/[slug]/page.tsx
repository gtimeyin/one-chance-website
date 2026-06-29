import {
  getProduct,
  getProducts,
  getProductReviews,
  getProductsByIds,
  type WooProduct,
} from "@/lib/woocommerce";
import { stripHtml, truncate, getImageSrc } from "@/lib/utils";
import { getActiveCountry } from "@/lib/currency.server";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const description = truncate(
    stripHtml(product.short_description || product.description),
    160,
  );
  const image = getImageSrc(product.images);
  const canonical = `/shop/${product.slug}`;

  return {
    title: product.name,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: canonical,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const country = await getActiveCountry();
  const product = await getProduct(slug, country);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product, country);
  const reviews = await getProductReviews(product.id);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      reviews={reviews}
    />
  );
}

const RELATED_LIMIT = 4;

async function getRelatedProducts(product: WooProduct, country: string): Promise<WooProduct[]> {
  // Prefer manually merchandised cross-sells, then Woo's auto-computed related_ids,
  // then fall back to recent products so the section never sits empty.
  const preferred = [...(product.cross_sell_ids ?? []), ...(product.related_ids ?? [])];
  const uniqueIds = Array.from(new Set(preferred));

  const byIds = uniqueIds.length > 0 ? await getProductsByIds(uniqueIds, country) : [];
  const ordered = uniqueIds
    .map((id) => byIds.find((p) => p.id === id))
    .filter((p): p is WooProduct => Boolean(p) && p!.id !== product.id);

  if (ordered.length >= RELATED_LIMIT) return ordered.slice(0, RELATED_LIMIT);

  // Fill the remainder from recent products
  const recent = await getProducts({ per_page: RELATED_LIMIT + 4, country });
  const seen = new Set(ordered.map((p) => p.id));
  for (const p of recent) {
    if (ordered.length >= RELATED_LIMIT) break;
    if (p.id === product.id || seen.has(p.id)) continue;
    ordered.push(p);
    seen.add(p.id);
  }
  return ordered;
}
