"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ProductCard from "@/components/ui/ProductCard";
import type { WooProduct } from "@/lib/woocommerce";

interface ShopProductGridProps {
  products: WooProduct[];
}

export default function ShopProductGrid({ products }: ShopProductGridProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Group products into rows of 3
  const rows: WooProduct[][] = [];
  for (let i = 0; i < products.length; i += 3) {
    rows.push(products.slice(i, i + 3));
  }

  return (
    <section
      id="products"
      ref={ref}
      className="w-full"
      style={{
        padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px)",
        background: "white",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 1280 }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 40 }}
        >
          <h2
            className="font-barlow-condensed font-extrabold uppercase"
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              color: "var(--color-dark)",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            SHOP ALL PRODUCTS
          </h2>
          <p
            className="font-barlow"
            style={{
              fontSize: 14,
              color: "var(--color-dark)",
              marginTop: 12,
              maxWidth: 480,
              lineHeight: 1.5,
              opacity: 0.7,
            }}
          >
            Shop our wide selection of merch, games and expansion packs. Order directly from One Chance and enjoy a 90-day risk-free trial. Try it, love it.
          </p>
        </motion.div>

        {/* Product Grid with row separators */}
        {products.length > 0 ? (
          <div className="flex flex-col">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex}>
                {/* Row separator line */}
                {rowIndex > 0 && (
                  <div
                    style={{
                      height: 1,
                      background: "var(--color-border-light)",
                      margin: "8px 0",
                    }}
                  />
                )}
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  style={{ gap: "clamp(16px, 3vw, 32px)" }}
                >
                  {row.map((product, i) => {
                    const globalIndex = rowIndex * 3 + i;
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{
                          duration: 0.4,
                          delay: 0.1 + globalIndex * 0.05,
                        }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="flex items-center justify-center"
            style={{ padding: "80px 0" }}
          >
            <p
              className="font-barlow"
              style={{ fontSize: 18, color: "var(--color-text-muted)" }}
            >
              Products coming soon...
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
