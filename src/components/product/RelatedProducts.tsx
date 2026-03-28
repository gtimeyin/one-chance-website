"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ProductCard from "@/components/ui/ProductCard";
import type { WooProduct } from "@/lib/woocommerce";

interface RelatedProductsProps {
  products: WooProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (products.length === 0) return null;

  return (
    <section
      ref={ref}
      className="w-full"
      style={{
        padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px)",
        background: "var(--color-light-bg)",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 1280 }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-barlow-condensed font-extrabold uppercase"
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            color: "var(--color-dark)",
            letterSpacing: "-2px",
            lineHeight: 1,
            marginBottom: 40,
          }}
        >
          YOU MIGHT ALSO LIKE
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "clamp(12px, 2vw, 24px)" }}>
          {products.slice(0, 4).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
