"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ShopHeroBanner() {
  return (
    <section
      className="w-full relative overflow-hidden"
      style={{
        background: "#68C5F2",
      }}
    >
      <div
        className="mx-auto flex items-stretch"
        style={{ maxWidth: 1440 }}
      >
        {/* Left: Text content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="flex flex-col justify-center"
          style={{
            flex: "1 1 60%",
            padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px)",
            gap: 16,
          }}
        >
          <p
            className="font-barlow uppercase"
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "var(--color-dark)",
              fontWeight: 500,
            }}
          >
            GRAB UP TO 60% OFF ON SELECTED PRODUCTS
          </p>
          <h1
            className="font-barlow-condensed font-extrabold uppercase"
            style={{
              fontSize: "clamp(36px, 6vw, 68px)",
              lineHeight: 0.92,
              letterSpacing: "-2px",
              color: "var(--color-dark)",
            }}
          >
            SHOP FROM OUR
            <br />
            EXTENSIVE
            <br />
            COLLECTION
          </h1>
          <Link
            href="#products"
            className="font-barlow-condensed font-bold uppercase no-underline inline-block"
            style={{
              padding: "12px 24px",
              background: "var(--color-dark)",
              color: "white",
              fontSize: 14,
              textDecoration: "none",
              alignSelf: "flex-start",
              marginTop: 8,
              letterSpacing: "0.02em",
            }}
          >
            SHOP NOW
          </Link>
        </motion.div>

        {/* Right: Person photo area */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300, delay: 0.1 }}
          className="hidden md:flex items-end justify-end"
          style={{
            flex: "0 0 40%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Placeholder for person photo - shows a styled silhouette */}
          <div
            className="flex items-center justify-center"
            style={{
              width: "100%",
              height: "100%",
              minHeight: 300,
              background: "rgba(255,255,255,0.12)",
            }}
          >
            <div
              className="flex flex-col items-center justify-center"
              style={{
                width: 200,
                height: 260,
                borderRadius: "50% 50% 0 0",
                background: "rgba(255,255,255,0.18)",
              }}
            >
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
