"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { formatPrice, getImageSrc } from "@/lib/utils";
import { useCurrency } from "@/components/CurrencyProvider";
import type { WooProduct } from "@/lib/woocommerce-shared";

interface BundleContentsProps {
  bundle: WooProduct;
  items: WooProduct[];
}

export default function BundleContents({ bundle, items }: BundleContentsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const currency = useCurrency();

  if (items.length === 0) return null;

  const bundlePrice = parseFloat(bundle.price || "0");
  const sumOfItems = items.reduce(
    (sum, i) => sum + parseFloat(i.price || "0"),
    0,
  );
  const savings = sumOfItems - bundlePrice;
  const showSavings = savings > 0 && bundlePrice > 0;

  return (
    <section
      ref={ref}
      className="w-full"
      style={{ padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px)", background: "white" }}
    >
      <div className="mx-auto" style={{ maxWidth: 1280 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between"
          style={{ marginBottom: 32, gap: 16 }}
        >
          <div className="flex flex-col" style={{ gap: 8 }}>
            <span className="type-eyebrow" style={{ color: "var(--color-text-muted)" }}>
              BUNDLE · {items.length} ITEMS
            </span>
            <h2 className="type-h1 uppercase" style={{ color: "var(--color-dark)" }}>
              What&apos;s in this bundle
            </h2>
          </div>
          {showSavings && (
            <div
              className="font-barlow-condensed font-bold uppercase"
              style={{
                background: "var(--color-yellow)",
                color: "var(--color-dark)",
                padding: "10px 16px",
                fontSize: 14,
                letterSpacing: "0.05em",
                alignSelf: "flex-start",
              }}
            >
              Save {formatPrice(String(savings), currency)} vs buying separately
            </div>
          )}
        </motion.div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: 16 }}
        >
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.05 + i * 0.05 }}
            >
              <BundleItem item={item} currency={currency} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BundleItem({ item, currency }: { item: WooProduct; currency: string }) {
  const imageSrc = getImageSrc(item.images);
  return (
    <Link
      href={`/shop/${item.slug}`}
      className="flex flex-col no-underline"
      style={{ gap: 12 }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "1/1",
          background: "var(--color-light-bg)",
        }}
      >
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>
      <div className="flex flex-col" style={{ gap: 4 }}>
        <span
          className="font-barlow-condensed font-semibold uppercase"
          style={{ fontSize: 16, color: "var(--color-dark)", lineHeight: 1.3 }}
        >
          {item.name}
        </span>
        <span
          className="font-barlow-condensed"
          style={{ fontSize: 14, color: "var(--color-text-muted)" }}
        >
          {formatPrice(item.price, currency)}
        </span>
      </div>
    </Link>
  );
}
