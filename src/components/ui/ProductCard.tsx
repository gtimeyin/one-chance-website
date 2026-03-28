"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, getImageSrc } from "@/lib/utils";
import { useCart } from "@/store/cart";
import type { WooProduct } from "@/lib/woocommerce";

interface ProductCardProps {
  product: WooProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc = getImageSrc(product.images);
  const addItem = useCart((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1,
      image: imageSrc,
      slug: product.slug,
    });
  };

  return (
    <div className="flex flex-col">
      {/* Image area */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative block no-underline"
        style={{
          aspectRatio: "1/1",
          background: "#E8E8E8",
        }}
      >
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Star/bookmark icon - top right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute cursor-pointer bg-transparent border-none"
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

      {/* Product info */}
      <div style={{ padding: "12px 0" }}>
        <Link
          href={`/shop/${product.slug}`}
          className="font-barlow font-medium no-underline block"
          style={{
            fontSize: 14,
            color: "var(--color-dark)",
            textDecoration: "none",
            lineHeight: 1.4,
          }}
        >
          {product.name}
        </Link>

        {/* Price row with cart icon */}
        <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
          <span
            className="font-barlow font-medium"
            style={{ fontSize: 15, color: "var(--color-dark)" }}
          >
            {formatPrice(product.price)}
          </span>
          {/* Cart/bag icon */}
          <button
            onClick={handleAddToCart}
            className="cursor-pointer bg-transparent border-none"
            style={{ padding: 2 }}
            aria-label="Add to cart"
          >
            <svg
              width="18"
              height="18"
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
    </div>
  );
}
