"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function ShopHeroBanner() {
  return (
    <section
      className="w-full relative"
      style={{
        padding: "0",
        background: "white",
      }}
    >
      <div
        className="mx-auto flex items-stretch overflow-hidden"
        style={{ 
          maxWidth: 1280,
          background: "var(--color-hero-blue, #68C5F2)",
          margin: "0 auto",
        }}
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
            zIndex: 10,
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
            className="text-heading-xxlarge-bold font-heading-xxlarge-bold uppercase -tracking-[2px] mobile:text-[36px] mobile:leading-[36px]"
            style={{ color: "var(--color-dark)" }}
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
              padding: "14px 32px",
              background: "var(--color-yellow)",
              color: "var(--color-dark)",
              fontSize: 14,
              textDecoration: "none",
              alignSelf: "flex-start",
              marginTop: 12,
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
            minHeight: 460,
          }}
        >
          <Image
            src="/images/shop/hero-man.png"
            alt="Young man in white sweatshirt"
            fill
            className="object-contain object-bottom"
            sizes="(max-width: 1024px) 100vw, 40vw"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
