"use client";

import { useState } from "react";
import StarRating from "@/components/ui/StarRating";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { useCart } from "@/store/cart";
import { formatPrice, getImageSrc, stripHtml } from "@/lib/utils";
import type { WooProduct } from "@/lib/woocommerce";

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

  return (
    <div className="flex flex-col" style={{ gap: 20 }}>
      {/* Tagline */}
      <p className="font-barlow" style={{ fontSize: 13, color: "var(--color-text-muted)", letterSpacing: "0.02em" }}>
        The first authentic Nigerian board game
      </p>

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

      {/* Rating */}
      <div className="flex items-center gap-3">
        <StarRating rating={5} size={16} />
        <span className="font-barlow" style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
          (5.0)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span
          className="font-barlow font-bold"
          style={{ fontSize: 32, color: "var(--color-dark)" }}
        >
          {formatPrice(product.price)}
        </span>
        {product.on_sale && product.regular_price && (
          <span
            className="font-barlow"
            style={{
              fontSize: 20,
              color: "var(--color-text-muted)",
              textDecoration: "line-through",
            }}
          >
            {formatPrice(product.regular_price)}
          </span>
        )}
      </div>

      {/* Short Description */}
      {product.short_description && (
        <p className="font-barlow" style={{ fontSize: 14, color: "var(--color-text-muted)", lineHeight: 1.6 }}>
          {stripHtml(product.short_description)}
        </p>
      )}

      {/* Quantity + Add to Cart */}
      <div className="flex items-center gap-4" style={{ marginTop: 8 }}>
        <QuantitySelector quantity={quantity} onChange={setQuantity} />
        <button
          onClick={handleAddToCart}
          className="flex-1 font-barlow font-bold uppercase cursor-pointer border-none"
          style={{
            padding: "14px 24px",
            background: "var(--color-yellow)",
            color: "var(--color-dark)",
            fontSize: 16,
            letterSpacing: "0.02em",
          }}
        >
          ADD TO CART
        </button>
      </div>

      {/* Description section */}
      <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--color-border-light)" }}>
        <h3 className="font-barlow font-bold" style={{ fontSize: 16, color: "var(--color-dark)", marginBottom: 8 }}>
          Description
        </h3>
        <div
          className="font-barlow"
          style={{ fontSize: 14, color: "var(--color-text-muted)", lineHeight: 1.7 }}
          dangerouslySetInnerHTML={{ __html: product.description || "One Chance is an intense and exciting party experience. It is also fun and highly educational. The very first authentically Nigerian board game. One Chance packs the highs and lows of being Nigerian into a very intense and exciting experience for everyone." }}
        />
      </div>

      {/* Additional Info */}
      <div style={{ paddingTop: 16 }}>
        <h3 className="font-barlow font-bold" style={{ fontSize: 16, color: "var(--color-dark)", marginBottom: 8 }}>
          Additional Information
        </h3>
        <div className="flex flex-col gap-2 font-barlow" style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
          <div className="flex justify-between" style={{ borderBottom: "1px solid var(--color-border-light)", paddingBottom: 8 }}>
            <span>Players</span>
            <span>2 - 12</span>
          </div>
          <div className="flex justify-between" style={{ borderBottom: "1px solid var(--color-border-light)", paddingBottom: 8 }}>
            <span>Dimensions</span>
            <span>25cm * 25cm * 6cm</span>
          </div>
          <div className="flex justify-between" style={{ paddingBottom: 8 }}>
            <span>Weight</span>
            <span>30 - 50 mins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
