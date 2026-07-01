"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, getImageSrc } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useCurrency } from "@/components/CurrencyProvider";
import { trackAddToCart } from "@/lib/analytics";
import { bundleKind, getBundleChildIds, type WooProduct } from "@/lib/woocommerce-shared";

interface ProductCardProps {
  product: WooProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc = getImageSrc(product.images);
  const addItem = useCart((s) => s.addItem);
  const currency = useCurrency();

  const activePrice = parseFloat(product.price || "0");
  const regularPrice = parseFloat(product.regular_price || "0");
  const onSale = product.on_sale && regularPrice > activePrice;
  const discountPct = onSale
    ? Math.round(((regularPrice - activePrice) / regularPrice) * 100)
    : 0;
  const kind = bundleKind(product);
  const bundleCount = kind ? getBundleChildIds(product).length : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const price = parseFloat(product.price);
    addItem({
      productId: product.id,
      name: product.name,
      price,
      quantity: 1,
      image: imageSrc,
      slug: product.slug,
    });
    trackAddToCart({
      productId: product.id,
      name: product.name,
      price,
      quantity: 1,
      category: product.categories?.[0]?.name,
    });
  };

  return (
    <div className="flex flex-col group relative">
      {/* Image area */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative block no-underline overflow-hidden"
        style={{
          aspectRatio: "1/1",
          background: (product.name.toLowerCase().includes("one chance") && product.name.toLowerCase().includes("game")) 
            ? "#FFD600" 
            : "#E8E8E8",
        }}
      >
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div
          className="absolute z-10 flex flex-row flex-wrap items-start"
          style={{ top: 12, left: 12, gap: 6 }}
        >
          {onSale && (
            <span
              className="font-barlow-condensed font-bold uppercase"
              style={{
                padding: "4px 8px",
                background: "var(--color-dark)",
                color: "var(--color-yellow)",
                fontSize: 11,
                letterSpacing: "0.05em",
              }}
            >
              {discountPct}% OFF
            </span>
          )}
          {kind && (
            <span
              className="font-barlow-condensed font-bold uppercase"
              style={{
                padding: "4px 8px",
                background: "var(--color-yellow)",
                color: "var(--color-dark)",
                fontSize: 11,
                letterSpacing: "0.05em",
              }}
            >
              {bundleCount > 0 ? `BUNDLE · ${bundleCount} ITEMS` : "BUNDLE"}
            </span>
          )}
        </div>
        {/* Star/bookmark icon - top right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute cursor-pointer bg-transparent border-none z-10"
          style={{ top: 12, right: 12, padding: 2 }}
          aria-label="Save to wishlist"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-dark)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </Link>

      {/* Product info below image */}
      <div className="flex flex-col relative" style={{ padding: "16px 0 24px" }}>
        <Link
          href={`/shop/${product.slug}`}
          className="font-barlow-condensed font-medium no-underline block uppercase"
          style={{
            fontSize: 20,
            color: "var(--color-dark)",
            textDecoration: "none",
            lineHeight: 1.2,
            maxWidth: "calc(100% - 32px)",
          }}
        >
          {product.name}
        </Link>
        <span
          className="font-barlow-condensed flex items-baseline"
          style={{
            fontSize: 21,
            color: "var(--color-dark)",
            marginTop: 4,
            fontWeight: 400,
            gap: 8,
          }}
        >
          {onSale && (
            <span
              style={{
                fontSize: 17,
                color: "var(--color-text-muted)",
                textDecoration: "line-through",
              }}
            >
              {formatPrice(product.regular_price, currency)}
            </span>
          )}
          <span style={{ fontWeight: onSale ? 600 : 400, color: onSale ? "#B91C1C" : "var(--color-dark)" }}>
            {formatPrice(product.price, currency)}
          </span>
        </span>

        {/* Cart/bag icon - positioned at bottom right of the card info area */}
        <button
          onClick={handleAddToCart}
          className="absolute right-0 bottom-2 cursor-pointer bg-transparent hover:bg-[var(--color-yellow)] border-none flex items-center justify-center transition-colors duration-200"
          style={{ padding: 8 }}
          aria-label="Add to cart"
          title="Add to cart"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-dark)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}
