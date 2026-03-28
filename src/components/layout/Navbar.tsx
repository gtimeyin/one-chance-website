"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/store/cart";
import CartDrawer from "./CartDrawer";

const navLinks = [
  { label: "SHOP", href: "/shop" },
  { label: "COMICS", href: "/updates" },
  { label: "RULES", href: "/#howtoplay" },
  { label: "UPDATES", href: "/updates" },
  { label: "CONTACT US", href: "/#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const cartItemCount = useCart((s) => s.getItemCount());
  const toggleCart = useCart((s) => s.toggleCart);
  const isCartOpen = useCart((s) => s.isOpen);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50"
        style={{
          background: "white",
        }}
      >
        <div
          className="flex items-center justify-between w-full mx-auto"
          style={{ maxWidth: 1440, padding: "12px clamp(20px, 4vw, 40px)", height: 56 }}
        >
          {/* Left: Yellow Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 cursor-pointer border-none"
            aria-label="Toggle menu"
            style={{
              padding: "10px 16px",
              background: "var(--color-yellow)",
            }}
          >
            {/* Hamburger lines */}
            <div className="flex flex-col" style={{ gap: 3 }}>
              <div style={{ width: 16, height: 2, background: "var(--color-dark)" }} />
              <div style={{ width: 16, height: 2, background: "var(--color-dark)" }} />
              <div style={{ width: 16, height: 2, background: "var(--color-dark)" }} />
            </div>
            <span
              className="font-barlow font-semibold"
              style={{
                fontSize: 14,
                color: "var(--color-dark)",
                letterSpacing: "0.02em",
              }}
            >
              Menu
            </span>
          </button>
          {/* Middle: Logo */}
          <Link
            href="/"
            className="font-barlow-condensed font-extrabold uppercase no-underline"
            style={{
              fontSize: 24,
              color: "var(--color-dark)",
              letterSpacing: "-1px",
              lineHeight: 1,
              textDecoration: "none",
            }}
          >
            ONE CHANCE
          </Link>

          {/* Right: Search + Cart */}
          <div className="flex items-center gap-4">
            {/* Search icon */}
            <button
              className="cursor-pointer bg-transparent border-none"
              style={{ padding: 4 }}
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Cart icon */}
            <button
              onClick={toggleCart}
              className="relative cursor-pointer bg-transparent border-none"
              style={{ padding: 4 }}
              aria-label="Open cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {hasMounted && cartItemCount > 0 && (
                <span
                  className="absolute font-barlow font-bold flex items-center justify-center"
                  style={{
                    top: -2,
                    right: -4,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "var(--color-yellow)",
                    color: "var(--color-dark)",
                    fontSize: 10,
                  }}
                >
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
            style={{ background: "rgba(18, 27, 25, 0.98)" }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-6 text-white text-3xl cursor-pointer bg-transparent border-none"
              aria-label="Close menu"
            >
              &times;
            </button>
            <div className="flex flex-col items-center gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, type: "spring", damping: 30, stiffness: 400 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="font-barlow-condensed text-white font-extrabold uppercase text-center no-underline hover:text-yellow transition-colors"
                    style={{
                      fontSize: "clamp(36px, 8vw, 64px)",
                      letterSpacing: "-2px",
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring", damping: 30, stiffness: 400 }}
              >
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="font-barlow font-bold text-center no-underline inline-block"
                  style={{
                    fontSize: 18,
                    padding: "16px 40px",
                    background: "var(--color-yellow)",
                    color: "var(--color-dark)",
                    textDecoration: "none",
                    marginTop: 16,
                  }}
                >
                  BUY NOW
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} />
    </>
  );
}
