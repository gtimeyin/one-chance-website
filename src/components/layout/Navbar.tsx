"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { useAuth } from "@/components/AuthProvider";
import { logout } from "@/app/actions/auth";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";
import { Button } from "@/ui/components/Button";
import {
  FeatherMenu,
  FeatherSearch,
  FeatherShoppingBag,
  FeatherUser,
  FeatherX,
} from "@subframe/core";
import { SocialIcon, type SocialName } from "@/components/icons/SocialIcons";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "SHOP", href: "/shop" },
  { label: "RULES", href: "/rules" },
  { label: "UPDATES", href: "/updates" },
  { label: "CONTACT US", href: "/contact" },
];

const secondaryLinks = [
  { label: "Explore Olopa", href: "#" },
  { label: "Terms & Condition", href: "#" },
  { label: "Legal", href: "#" },
];

// TODO: replace "#" with real profile URLs once available.
const socialLinks: { name: SocialName; label: string; href: string }[] = [
  { name: "facebook", label: "Facebook", href: "#" },
  { name: "instagram", label: "Instagram", href: "#" },
  { name: "x", label: "X (Twitter)", href: "#" },
  { name: "linkedin", label: "LinkedIn", href: "#" },
  { name: "tiktok", label: "TikTok", href: "#" },
  { name: "youtube", label: "YouTube", href: "#" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuth, firstName } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const cartItemCount = useCart((s) => s.getItemCount());
  const toggleCart = useCart((s) => s.toggleCart);
  const isCartOpen = useCart((s) => s.isOpen);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      <div
        className={`flex w-full max-w-[1280px] items-start justify-between px-0 z-50 transition-all duration-300 ${
          pathname === "/" ? "fixed left-1/2" : "relative"
        }`}
        style={{
          top: pathname === "/"
            ? (hidden && !isOpen ? -100 : 24)
            : 0,
          transform: pathname === "/" ? "translateX(-50%)" : "none",
          opacity: pathname === "/" ? (hidden && !isOpen ? 0 : 1) : 1,
          ...(pathname !== "/" && {
            left: 0,
            right: 0,
            margin: "0 auto",
            padding: "24px 0",
          }),
        }}
      >
        <Button
          size="small"
          icon={<FeatherMenu />}
          onClick={() => setIsOpen(!isOpen)}
        >
          Menu
        </Button>
        <div className="flex items-start gap-2">
          <Button
            variant="white"
            size="small"
            icon={<FeatherUser />}
            onClick={() => router.push(isAuth ? "/account" : "/login")}
            aria-label={isAuth ? "My account" : "Sign in"}
            title={isAuth ? "My account" : "Sign in"}
          />
          <Button
            variant="white"
            size="small"
            icon={<FeatherSearch />}
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search"
          />
          <div className="relative isolate">
            <Button
              variant="white"
              size="small"
              icon={<FeatherShoppingBag />}
              onClick={() => toggleCart()}
            />
            {hasMounted && cartItemCount > 0 && (
              <span
                className="absolute font-barlow-condensed font-bold flex items-center justify-center pointer-events-none"
                style={{
                  top: -2,
                  right: -4,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "var(--color-yellow)",
                  color: "var(--color-dark)",
                  fontSize: 10,
                  zIndex: 50,
                }}
              >
                {cartItemCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex h-full w-full flex-col items-center bg-brand-yellow px-0 pt-6 pb-16 mobile:pt-6 mobile:pb-8"
          >
            <div className="flex w-full max-w-[1280px] grow shrink-0 basis-0 flex-col items-center justify-between">
              {/* Top: Close button — mirrors the menu trigger exactly (same size,
                  variant, and position: flush to the 1280px container edge at 24px top). */}
              <div className="flex w-full flex-col items-start pb-4">
                <Button
                  size="small"
                  icon={<FeatherX />}
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
              </div>

              {/* Middle: Nav links (fill width) + secondary (right) */}
              <div className="flex w-full items-start justify-between gap-16 px-16 mobile:flex-col mobile:gap-12 mobile:px-6">
                <div className="mb-[12px] mt-[12px] flex flex-1 flex-col items-start gap-2">
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
                        className={`text-[48px] leading-[48px] md:text-[72px] md:leading-[72px] font-extrabold font-display-title-bold tracking-[-0.03125em] uppercase no-underline transition-all duration-200 ${
                          (link.href === "/" && pathname === "/") ||
                          (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]))
                            ? "text-black-950 opacity-100"
                            : "text-black-950 opacity-30 hover:opacity-100"
                        }`}
                        style={{ textDecoration: "none" }}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="flex flex-col items-start gap-2 pt-8 mobile:px-0 mobile:py-0"
                >
                  {/* Account */}
                  <span className="font-barlow-condensed font-bold uppercase text-black-800 opacity-50 mb-2" style={{ fontSize: 16, letterSpacing: "0.05em" }}>
                    {isAuth && firstName ? `Hi, ${firstName}` : "Account"}
                  </span>
                  {isAuth ? (
                    <>
                      <Link
                        href="/account"
                        onClick={() => setIsOpen(false)}
                        className="font-barlow-condensed font-semibold text-black-950 no-underline opacity-70 hover:opacity-100 transition-opacity duration-200"
                        style={{ textDecoration: "none", fontSize: 22, lineHeight: 1.3 }}
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setIsOpen(false)}
                        className="font-barlow-condensed font-semibold text-black-950 no-underline opacity-70 hover:opacity-100 transition-opacity duration-200"
                        style={{ textDecoration: "none", fontSize: 22, lineHeight: 1.3 }}
                      >
                        My Orders
                      </Link>
                      <form action={logout} onSubmit={() => setIsOpen(false)}>
                        <button
                          type="submit"
                          className="font-barlow-condensed font-semibold text-black-950 no-underline bg-transparent border-none cursor-pointer p-0 opacity-70 hover:opacity-100 transition-opacity duration-200"
                          style={{ fontSize: 22, lineHeight: 1.3 }}
                        >
                          Sign Out
                        </button>
                      </form>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="font-barlow-condensed font-semibold text-black-950 no-underline opacity-70 hover:opacity-100 transition-opacity duration-200"
                        style={{ textDecoration: "none", fontSize: 22, lineHeight: 1.3 }}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsOpen(false)}
                        className="font-barlow-condensed font-semibold text-black-950 no-underline opacity-70 hover:opacity-100 transition-opacity duration-200"
                        style={{ textDecoration: "none", fontSize: 22, lineHeight: 1.3 }}
                      >
                        Create Account
                      </Link>
                    </>
                  )}

                  <span className="font-barlow-condensed font-bold uppercase text-black-800 opacity-50 mt-6 mb-2" style={{ fontSize: 16, letterSpacing: "0.05em" }}>
                    More
                  </span>
                  {secondaryLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="font-barlow-condensed font-semibold text-black-800 no-underline opacity-70 hover:opacity-100 transition-opacity duration-200"
                      style={{ textDecoration: "none", fontSize: 22, lineHeight: 1.3 }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              </div>

              {/* Bottom: Contact + Social */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="flex w-full items-end justify-between px-16 mobile:flex-col mobile:items-start mobile:gap-8 mobile:px-6"
              >
                <div className="flex flex-col items-start gap-1">
                  <a
                    href="tel:+2349027305417"
                    className="font-barlow-condensed font-bold text-black-800 no-underline opacity-80 hover:opacity-100 transition-opacity duration-200"
                    style={{ fontSize: 18, textDecoration: "none" }}
                  >
                    T: +234 902 730 5417
                  </a>
                  <a
                    href="mailto:info@onechancegame.com"
                    className="font-barlow-condensed font-bold text-black-800 no-underline opacity-80 hover:opacity-100 transition-opacity duration-200"
                    style={{ fontSize: 18, textDecoration: "none" }}
                  >
                    E: info@onechancegame.com
                  </a>
                </div>
                <div className="flex flex-col items-end gap-3 mobile:w-full mobile:items-start">
                  <div className="flex items-center gap-4">
                    {socialLinks.map((s) => (
                      <a
                        key={s.name}
                        href={s.href}
                        aria-label={s.label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-default-font opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-200"
                      >
                        <SocialIcon name={s.name} size={20} />
                      </a>
                    ))}
                  </div>
                  <a
                    href="https://neuro6.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-barlow-condensed font-bold uppercase text-black-800 no-underline opacity-80 hover:opacity-100 transition-opacity duration-200"
                    style={{ fontSize: 12, letterSpacing: "0.05em", textDecoration: "none" }}
                  >
                    DESIGNED BY N6
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
