"use client";

import { useState } from "react";
import StarRating from "@/components/ui/StarRating";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { useCart } from "@/store/cart";
import { formatPrice, getImageSrc } from "@/lib/utils";
import { getAttribute, getMetaValue, type WooProduct } from "@/lib/woocommerce";

interface ProductInfoProps {
  product: WooProduct;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((s) => s.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity,
      image: getImageSrc(product.images),
      slug: product.slug,
    });
  };

  const tagline = getMetaValue(product, "oc_tagline");
  const age = getAttribute(product, "Age");
  const players = getAttribute(product, "Players");
  const playTime = getAttribute(product, "Play Time");
  const ratingValue = parseFloat(product.average_rating || "0");
  const ratingCount = product.rating_count || 0;

  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      {/* Tagline */}
      {tagline && (
        <p className="font-barlow-condensed" style={{ fontSize: 13, color: "var(--color-text-muted)", letterSpacing: "0.02em" }}>
          {tagline}
        </p>
      )}

      {/* Title */}
      <h1
        className="font-barlow-condensed font-extrabold uppercase"
        style={{
          fontSize: "clamp(24px, 3vw, 36px)",
          color: "var(--color-dark)",
          lineHeight: 1.1,
          letterSpacing: "-1px",
        }}
      >
        {product.name}
      </h1>

      {/* Badges */}
      {(age || players || playTime) && (
        <div className="flex items-center gap-2 flex-wrap">
          {age && (
            <div className="px-3 py-1.5 rounded-md font-barlow-condensed font-medium" style={{ background: "#E1F2FF", color: "#4A5568", fontSize: 13 }}>
              Age {age}
            </div>
          )}
          {players && (
            <div className="px-3 py-1.5 rounded-md font-barlow-condensed font-medium flex items-center gap-1.5" style={{ background: "#E1F2FF", color: "#4A5568", fontSize: 13 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              {players}
            </div>
          )}
          {playTime && (
            <div className="px-3 py-1.5 rounded-md font-barlow-condensed font-medium flex items-center gap-1.5" style={{ background: "#E1F2FF", color: "#4A5568", fontSize: 13 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {playTime}
            </div>
          )}
        </div>
      )}

      {/* Rating */}
      {ratingCount > 0 && (
        <div className="flex items-center gap-3">
          <StarRating rating={ratingValue} size={18} />
          <span className="font-barlow-condensed" style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
            {ratingCount} {ratingCount === 1 ? "Review" : "Reviews"}
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex flex-col gap-1" style={{ marginTop: 10 }}>
        <span
          className="font-barlow-condensed font-extrabold"
          style={{ fontSize: 64, color: "#1A202C", lineHeight: 1 }}
        >
          {formatPrice(product.price)}
        </span>
      </div>

      {/* Quantity + Total Price */}
      <div className="flex items-center gap-6" style={{ marginTop: 10 }}>
        <QuantitySelector quantity={quantity} onChange={setQuantity} />
        <span className="font-barlow-condensed font-bold" style={{ fontSize: 28, color: "var(--color-dark)" }}>
          {formatPrice(parseFloat(product.price) * quantity)}
        </span>
      </div>

      {/* Short Description */}
      {product.short_description && (
        <div
          className="font-barlow-condensed"
          style={{ fontSize: 16, color: "#4A5568", lineHeight: 1.5, marginTop: 16, maxWidth: "45ch" }}
          dangerouslySetInnerHTML={{ __html: product.short_description }}
        />
      )}

      {/* Add to Cart Button */}
      <div style={{ marginTop: 24 }}>
        <button
          onClick={handleAddToCart}
          className="w-full font-barlow-condensed font-bold uppercase cursor-pointer border-none flex items-center justify-center gap-3"
          style={{
            padding: "18px 24px",
            background: "#FFD600",
            color: "var(--color-dark)",
            fontSize: 18,
            letterSpacing: "0.05em",
          }}
        >
          ADD TO CART
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </button>
      </div>

    </div>
  );
}
