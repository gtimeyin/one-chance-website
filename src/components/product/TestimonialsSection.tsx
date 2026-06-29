"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import TestimonialCard from "@/components/ui/TestimonialCard";
import WriteReviewDialog from "./WriteReviewDialog";
import { stripHtml } from "@/lib/utils";
import type { WooReview } from "@/lib/woocommerce";

interface TestimonialsSectionProps {
  productId: number;
  productName: string;
  reviews: WooReview[];
}

export default function TestimonialsSection({
  productId,
  productName,
  reviews,
}: TestimonialsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [open, setOpen] = useState(false);

  const testimonials = reviews.slice(0, 3).map((r) => ({
    name: r.reviewer,
    rating: r.rating,
    text: stripHtml(r.review).trim(),
  }));

  return (
    <section
      ref={ref}
      className="w-full"
      style={{
        padding: "clamp(60px, 6vw, 96px) clamp(20px, 4vw, 60px)",
        background: "white",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 1280 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between"
          style={{ marginBottom: 40, gap: 16 }}
        >
          <h2
            className="font-barlow-condensed font-extrabold uppercase"
            style={{
              fontSize: "clamp(32px, 5vw, 64px)",
              color: "black",
              letterSpacing: "-0.02em",
              lineHeight: "100%",
            }}
          >
            WORDS ON THE<br />STREET ABOUT US
          </h2>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="font-barlow-condensed font-bold uppercase cursor-pointer flex items-center gap-2"
            style={{
              padding: "10px 20px",
              border: "1px solid var(--color-dark)",
              background: "white",
              color: "var(--color-dark)",
              fontSize: 12,
              letterSpacing: "0.05em",
            }}
          >
            WRITE A REVIEW
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </button>
        </motion.div>

        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
              >
                <TestimonialCard {...t} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-barlow-condensed"
            style={{
              fontSize: 16,
              color: "var(--color-text-muted)",
              padding: "32px 0",
              borderTop: "1px solid var(--color-border-light)",
            }}
          >
            No reviews yet — be the first to share what you thought.
          </motion.p>
        )}
      </div>

      <WriteReviewDialog
        productId={productId}
        productName={productName}
        open={open}
        onOpenChange={setOpen}
      />
    </section>
  );
}
