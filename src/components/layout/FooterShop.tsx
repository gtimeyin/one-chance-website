"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

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
    <footer ref={ref} className="w-full" style={{ background: "var(--color-dark)" }}>
      <div className="mx-auto" style={{ maxWidth: 1440 }}>
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Yellow area with CTA + Characters on bus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 flex flex-col"
            style={{
              background: "var(--color-yellow)",
              padding: "clamp(30px, 4vw, 48px) clamp(20px, 3vw, 40px) 0",
              position: "relative",
              overflow: "hidden",
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
                  opacity: 0.7,
                  lineHeight: 1.5,
                }}
              >
                Now, it&apos;s time to begin your One Chance experience.
              </p>
              <Link
                href="/shop"
                className="inline-block font-barlow font-bold no-underline uppercase"
                style={{
                  marginTop: 16,
                  padding: "12px 20px",
                  background: "var(--color-dark)",
                  color: "var(--color-yellow)",
                  fontSize: 13,
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                }}
              >
                BUY A GAME NOW !
              </Link>
            </div>

            {/* Characters on bus image */}
            <div
              className="relative w-full"
              style={{
                marginTop: "auto",
                paddingTop: 20,
                height: "clamp(160px, 22vw, 240px)",
              }}
            >
              <Image
                src="/images/characters-bus.png"
                alt="One Chance characters on a Lagos bus"
                fill
                className="object-contain object-bottom"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          </motion.div>

          {/* Middle Column: Discover links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
            style={{
              padding: "clamp(30px, 4vw, 48px) clamp(20px, 3vw, 40px)",
            }}
          >
            <p
              className="font-barlow uppercase"
              style={{
                fontSize: 12,
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.5)",
                marginBottom: 16,
                fontWeight: 500,
              }}
            >
              DISCOVER
            </p>
            <div className="flex flex-col" style={{ gap: 10 }}>
              {discoverLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-barlow no-underline"
                  style={{
                    fontSize: 14,
                    color: "var(--color-yellow)",
                    textDecoration: "none",
                    fontWeight: 400,
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

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
                fontSize: "clamp(22px, 3vw, 28px)",
                lineHeight: 1.1,
                color: "white",
                letterSpacing: "-1px",
              }}
            >
              JOIN OUR COMMUNITY
            </h3>
            <p
              className="font-barlow"
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                marginTop: 6,
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
              className="flex"
              style={{
                marginTop: 14,
                maxWidth: 340,
                border: "1px solid var(--color-yellow)",
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
                  padding: "10px 12px",
                  fontSize: 11,
                  color: "white",
                  outline: "none",
                  letterSpacing: "0.04em",
                }}
                required
              />
              <button
                type="submit"
                className="cursor-pointer border-none flex items-center justify-center"
                style={{
                  padding: "10px 14px",
                  background: "var(--color-yellow)",
                  color: "var(--color-dark)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </form>

            {/* Social Links */}
            <div className="flex flex-col" style={{ marginTop: 28, gap: 16 }}>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="no-underline flex flex-col"
                  style={{ textDecoration: "none" }}
                >
                  <span
                    className="font-barlow uppercase"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      color: "rgba(255,255,255,0.4)",
                      fontWeight: 500,
                    }}
                  >
                    {link.prefix}
                  </span>
                  <span className="flex items-center gap-2" style={{ marginTop: 2 }}>
                    <span
                      className="font-barlow font-semibold"
                      style={{ fontSize: 18, color: "white" }}
                    >
                      {link.label}
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>
                </a>
              ))}
            </div>

            {/* Designed by */}
            <p
              className="font-barlow"
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
                marginTop: 30,
                textAlign: "right",
              }}
            >
              DESIGNED BY <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>KE</span>
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
