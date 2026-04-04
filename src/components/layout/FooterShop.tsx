"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { TextField } from "@/ui/components/TextField";

const discoverLinks = [
  { label: "About Us", href: "/about" },
  { label: "Community", href: "#" },
  { label: "Our Blog", href: "/updates" },
  { label: "#Ask Otopa", href: "#" },
];

const socialLinks = [
  { prefix: "FOLLOW OUR", label: "X", href: "#" },
  { prefix: "FOLLOW OUR", label: "Instagram", href: "#" },
  { prefix: "SUBSCRIBE TO OUR", label: "Youtube", href: "#" },
  { prefix: "DROP US A MESSAGE", label: "Contact", href: "/#contact" },
];

export default function FooterShop() {
  const [email, setEmail] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="w-full" style={{ background: "var(--color-yellow)" }}>
      <div className="mx-auto" style={{ maxWidth: 1440, position: "relative" }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10">
          {/* Left Column: Yellow area with CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 flex flex-col"
            style={{
              padding: "clamp(30px, 4vw, 48px) clamp(20px, 3vw, 40px) 120px",
              position: "relative",
            }}
          >
            {/* Text content */}
            <div style={{ position: "relative", zIndex: 2 }}>
              <h3
                className="font-barlow-condensed font-extrabold uppercase"
                style={{
                  fontSize: "clamp(36px, 5vw, 52px)",
                  lineHeight: 0.92,
                  color: "var(--color-dark)",
                  letterSpacing: "-2px",
                }}
              >
                THANKS FOR
                <br />
                EXPLORING
              </h3>
              <p
                className="font-barlow"
                style={{
                  fontSize: 13,
                  color: "var(--color-dark)",
                  marginTop: 12,
                  opacity: 0.8,
                  lineHeight: 1.5,
                }}
              >
                Now, it&apos;s time to begin your One Chance experience.
              </p>
              <Link
                href="/shop"
                className="inline-block font-barlow font-bold no-underline uppercase"
                style={{
                  marginTop: 24,
                  padding: "12px 32px",
                  background: "var(--color-dark)",
                  color: "var(--color-yellow)",
                  fontSize: 14,
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                }}
              >
                BUY A GAME NOW !
              </Link>
            </div>
          </motion.div>

          {/* Middle Column: Discover links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
            style={{
              padding: "clamp(30px, 4vw, 48px) clamp(20px, 3vw, 40px) 120px",
            }}
          >
            <p
              className="font-barlow uppercase"
              style={{
                fontSize: 13,
                letterSpacing: "0.08em",
                color: "var(--color-dark)",
                marginBottom: 20,
                fontWeight: 600,
              }}
            >
              DISCOVER
            </p>
            <div className="flex flex-col" style={{ gap: 12 }}>
              {discoverLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-barlow no-underline"
                  style={{
                    fontSize: 14,
                    color: "var(--color-dark)",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Bus Image Absolute Container (Spanning Left + Middle) */}
          <div
            className="hidden lg:block absolute bottom-0 left-0"
            style={{
              width: "66.66%", // Spans approximately 8 columns
              height: "clamp(200px, 26vw, 320px)",
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            <Image
              src="/images/characters-bus.png"
              alt="One Chance characters on a Lagos bus"
              fill
              className="object-contain object-bottom"
              sizes="60vw"
              priority
            />
          </div>

          {/* Mobile Bus Image (Inside spacing) */}
          <div className="lg:hidden w-full relative h-[200px] mt-4">
             <Image
              src="/images/characters-bus.png"
              alt="One Chance characters on a Lagos bus"
              fill
              className="object-contain object-bottom"
              sizes="100vw"
            />
          </div>

          {/* Right Column: Join Our Community + Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
            style={{
              padding: "clamp(30px, 4vw, 48px) clamp(20px, 3vw, 40px)",
            }}
          >
            {/* Join Community */}
            <h3
              className="font-barlow-condensed font-extrabold uppercase"
              style={{
                fontSize: "clamp(24px, 3vw, 32px)",
                lineHeight: 1.1,
                color: "var(--color-dark)",
                letterSpacing: "-1px",
              }}
            >
              JOIN OUR COMMUNITY
            </h3>
            <p
              className="font-barlow"
              style={{
                fontSize: 13,
                color: "var(--color-dark)",
                marginTop: 6,
                opacity: 0.8,
              }}
            >
              Get news, photos, events, and business updates
            </p>

            {/* Email input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
              className="flex items-stretch"
              style={{
                marginTop: 20,
                maxWidth: 400,
                border: "1px solid var(--color-dark)",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL ADDRESS..."
                className="flex-1 font-barlow uppercase"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "12px 16px",
                  fontSize: 12,
                  color: "var(--color-dark)",
                  outline: "none",
                  letterSpacing: "0.04em",
                }}
                required
              />
              <button
                type="submit"
                className="cursor-pointer border-none flex items-center justify-center"
                style={{
                  padding: "0 16px",
                  background: "transparent",
                  color: "var(--color-dark)",
                  borderLeft: "1px solid var(--color-dark)",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 8 16 12 12 16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </button>
            </form>

            {/* Subframe variant */}
            <div style={{ marginTop: 12, maxWidth: 400 }}>
              <TextField variant="outline">
                <TextField.Input
                  type="email"
                  placeholder="ENTER YOUR EMAIL ADDRESS..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </TextField>
            </div>

            {/* Social Links with Separators */}
            <div className="flex flex-col" style={{ marginTop: 40 }}>
              {socialLinks.map((link, index) => (
                <div key={link.label}>
                  {index > 0 && (
                    <div
                      style={{
                        height: "1px",
                        background: "rgba(0,0,0,0.1)",
                        width: "100%",
                        margin: "12px 0",
                      }}
                    />
                  )}
                  <a
                    href={link.href}
                    className="no-underline flex flex-col group"
                    style={{ textDecoration: "none" }}
                  >
                    <span
                      className="font-barlow uppercase"
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.08em",
                        color: "var(--color-dark)",
                        opacity: 0.7,
                        fontWeight: 500,
                      }}
                    >
                      {link.prefix}
                    </span>
                    <span className="flex items-center gap-2" style={{ marginTop: 2 }}>
                      <span
                        className="font-barlow font-bold uppercase transition-transform group-hover:translate-x-1"
                        style={{ fontSize: 20, color: "var(--color-dark)" }}
                      >
                        {link.label}
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-dark)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </span>
                  </a>
                </div>
              ))}
            </div>

            {/* Designed by */}
            <p
              className="font-barlow"
              style={{
                fontSize: 11,
                color: "var(--color-dark)",
                opacity: 0.7,
                marginTop: 48,
                textAlign: "right",
              }}
            >
              DESIGNED BY <span style={{ fontWeight: 800, color: "var(--color-dark)" }}>NK</span>
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
