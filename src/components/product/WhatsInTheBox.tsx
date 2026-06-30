"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface WhatsInTheBoxProps {
  items: string[];
}

export default function WhatsInTheBox({ items }: WhatsInTheBoxProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (items.length === 0) return null;

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
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="type-h1 uppercase"
          style={{ color: "black", marginBottom: 48 }}
        >
          WHAT&apos;S IN THE BOX?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 40 }}>
          {/* Image placeholder area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center"
            style={{
              aspectRatio: "4/3",
              background: "var(--color-light-bg)",
              padding: 40,
            }}
          >
            <div className="grid grid-cols-2 gap-4" style={{ width: "100%", maxWidth: 300 }}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-center"
                  style={{
                    aspectRatio: "1/1",
                    background: "white",
                    border: "1px solid var(--color-border-light)",
                    borderRadius: 8,
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-border-light)" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Checklist */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            <h3
              className="font-barlow-condensed font-bold"
              style={{ fontSize: 20, color: "var(--color-dark)", marginBottom: 24 }}
            >
              What&apos;s in the Box
            </h3>
            <div className="flex flex-col" style={{ gap: 12 }}>
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 font-barlow-condensed"
                  style={{
                    fontSize: 17,
                    color: "var(--color-dark)",
                    paddingBottom: 12,
                    borderBottom: "1px solid var(--color-border-light)",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-yellow)" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
