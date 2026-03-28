"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const columns = [
  {
    title: "Our Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Community", href: "#" },
      { label: "Our Blog", href: "/updates" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Community", href: "#" },
      { label: "Our Blog", href: "/updates" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Community", href: "#" },
      { label: "Our Blog", href: "/updates" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
];

export default function FooterDark() {
  const [email, setEmail] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer
      ref={ref}
      className="w-full"
      style={{ background: "var(--color-dark)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mx-auto"
        style={{
          maxWidth: 1280,
          padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px)",
        }}
      >
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-barlow-condensed font-extrabold uppercase text-white no-underline"
              style={{ fontSize: 22, letterSpacing: "-1px", textDecoration: "none" }}
            >
              ONE CHANCE
            </Link>
            <p className="font-barlow" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 12, lineHeight: 1.6 }}>
              Lorem ipsum dolor sit amet consectetur.<br />
              Tristique ac quis turpis nulla sagittis<br />
              scelerisque.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); setEmail(""); }}
              className="flex"
              style={{ marginTop: 20, maxWidth: 300 }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 font-barlow"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRight: "none",
                  padding: "10px 12px",
                  fontSize: 12,
                  color: "white",
                  outline: "none",
                }}
                required
              />
              <button
                type="submit"
                className="font-barlow font-semibold cursor-pointer border-none flex items-center gap-1"
                style={{
                  padding: "10px 14px",
                  background: "white",
                  color: "var(--color-dark)",
                  fontSize: 12,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
                Subscribe
              </button>
            </form>
          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p
                className="font-barlow font-semibold uppercase"
                style={{ fontSize: 13, letterSpacing: "0.05em", color: "rgba(255,255,255,0.8)", marginBottom: 16 }}
              >
                {col.title}
              </p>
              <div className="flex flex-col gap-2">
                {col.links.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="font-barlow no-underline uppercase"
                    style={{
                      fontSize: 12,
                      color: "var(--color-yellow)",
                      textDecoration: "none",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between"
          style={{
            marginTop: 60,
            paddingTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            gap: 12,
          }}
        >
          <Link
            href="/privacy"
            className="font-barlow no-underline"
            style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
          >
            Privacy policy
          </Link>
          <p className="font-barlow" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            All rights reserved 2024&copy;one chance
          </p>
          <Link
            href="/terms"
            className="font-barlow no-underline"
            style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
          >
            Terms of service
          </Link>
        </div>
      </motion.div>
    </footer>
  );
}
