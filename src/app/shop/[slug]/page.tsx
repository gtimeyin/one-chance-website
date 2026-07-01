import {
  getProduct,
  getProducts,
  getProductReviews,
  getProductsByIds,
  type WooProduct,
  type WooReview,
} from "@/lib/woocommerce";
import { getBundleChildIds } from "@/lib/woocommerce-shared";
import { stripHtml, truncate, getImageSrc } from "@/lib/utils";
import { getActiveCountry } from "@/lib/currency.server";
import { currencyForCountry } from "@/lib/currency";
import { siteUrl } from "@/lib/site";
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

  const bundleChildIds = getBundleChildIds(product);
  const [relatedProducts, reviews, bundleItems] = await Promise.all([
    getRelatedProducts(product, country),
    getProductReviews(product.id),
    bundleChildIds.length > 0 ? getProductsByIds(bundleChildIds, country) : Promise.resolve<WooProduct[]>([]),
  ]);
  // Preserve the order the merchant configured in WooCommerce.
  const orderedBundleItems = bundleChildIds
    .map((id) => bundleItems.find((p) => p.id === id))
    .filter((p): p is WooProduct => Boolean(p));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProductJsonLd(product, reviews, country)),
        }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
        reviews={reviews}
        bundleItems={orderedBundleItems}
      />
    </>
  );
}

const AVAILABILITY: Record<string, string> = {
  instock: "https://schema.org/InStock",
  outofstock: "https://schema.org/OutOfStock",
  onbackorder: "https://schema.org/BackOrder",
};

function buildProductJsonLd(
  product: WooProduct,
  reviews: WooReview[],
  country: string,
) {
  const url = `${siteUrl}/shop/${product.slug}`;
  const description = stripHtml(product.short_description || product.description);
  const image = getImageSrc(product.images);

  const offers = {
    "@type": "Offer",
    url,
    priceCurrency: currencyForCountry(country),
    price: product.price,
    availability: AVAILABILITY[product.stock_status] ?? "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
  };

  const ratingValue = parseFloat(product.average_rating || "0");
  const ratingCount = product.rating_count || 0;
  const aggregateRating =
    ratingCount > 0 && ratingValue > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: ratingValue.toFixed(1),
          reviewCount: ratingCount,
        }
      : undefined;

  const review =
    reviews.length > 0
      ? reviews.slice(0, 5).map((r) => ({
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: r.rating,
            bestRating: 5,
          },
          author: { "@type": "Person", name: r.reviewer },
          datePublished: r.date_created,
          reviewBody: stripHtml(r.review),
        }))
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    sku: product.sku || undefined,
    image: image ? [image] : undefined,
    url,
    brand: { "@type": "Brand", name: "One Chance" },
    offers,
    aggregateRating,
    review,
  };
}

const RELATED_LIMIT = 4;

async function getRelatedProducts(product: WooProduct, country: string): Promise<WooProduct[]> {
  // Woo convention: upsells live on the product page ("get the better one"),
  // cross-sells live in the cart ("complete your purchase"). So on the PDP
  // we prefer upsells, fall back to Woo's auto-computed related_ids, then
  // recent products so the section never sits empty.
  const preferred = [...(product.upsell_ids ?? []), ...(product.related_ids ?? [])];
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
