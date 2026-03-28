"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import TestimonialCard from "@/components/ui/TestimonialCard";

const testimonials = [
  {
    name: "Joke Stack",
    rating: 5,
    text: "A combination of old classic family fun. Monopoly and politics make for hilarious moments! 5 star for the team that created this masterpiece.",
  },
  {
    name: "Joke Stack",
    rating: 5,
    text: "Tristique ac quis turpis nulla sagittis scelerisque. Et diam faucibus tincidunt varius non. A adipiscing proin lorem morbi feugiat. Imperdiet sit quis justo venenatis congue.",
  },
  {
    name: "Joke Stack",
    rating: 5,
    text: "Tristique ac quis turpis nulla sagittis scelerisque. Et diam faucibus tincidunt varius non. A adipiscing proin lorem morbi feugiat. Est vel orci tempor lorem facilisi.",
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="w-full"
      style={{
        padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px)",
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
              fontSize: "clamp(28px, 4vw, 44px)",
              color: "var(--color-dark)",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            WORDS ON THE<br />STREET ABOUT US
          </h2>
          <button
            className="font-barlow font-bold uppercase cursor-pointer flex items-center gap-2"
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
      </div>
    </section>
  );
}
