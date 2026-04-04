"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/cart";
import CartDrawer from "./CartDrawer";
import { Button } from "@/ui/components/Button";
import {
  FeatherMenu,
  FeatherSearch,
  FeatherShoppingBag,
  FeatherX,
  FeatherFacebook,
  FeatherInstagram,
  FeatherTwitter,
  FeatherLinkedin,
  FeatherMusic,
  FeatherYoutube,
} from "@subframe/core";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "SHOP", href: "/shop" },
  { label: "RULES", href: "/#howtoplay" },
  { label: "CHARACTERS", href: "/#meetthelagosians" },
  { label: "UPDATES", href: "/updates" },
  { label: "CONTACT US", href: "/contact" },
];

const secondaryLinks = [
  { label: "Explore Olopa", href: "#" },
  { label: "Terms & Condition", href: "#" },
  { label: "Legal", href: "#" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobileNav, setIsMobileNav] = useState(false);
  const [hidden, setHidden] = useState(false);
  const cartItemCount = useCart((s) => s.getItemCount());
  const toggleCart = useCart((s) => s.toggleCart);
  const isCartOpen = useCart((s) => s.isOpen);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobileNav(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
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
        className="flex w-full max-w-[1280px] items-start justify-between px-6 fixed left-1/2 z-50 transition-all duration-300"
        style={{
          top: hidden && !isOpen ? -100 : 24,
          transform: "translateX(-50%)",
          opacity: hidden && !isOpen ? 0 : 1,
        }}
      >
        <div className="flex items-start">
          <Button
            size="small"
            icon={<FeatherMenu />}
            onClick={() => setIsOpen(!isOpen)}
          >
            Menu
          </Button>
        </div>
        <div className="flex items-start gap-2">
          <Button
            variant="white"
            size="small"
            icon={<FeatherSearch />}
            onClick={() => {}}
          />
          <Button
            variant="white"
            size="small"
            icon={<FeatherShoppingBag />}
            onClick={() => toggleCart()}
          />
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
            className="fixed inset-0 z-[60] flex h-full w-full flex-col items-center justify-between bg-brand-yellow px-16 py-16 mobile:px-6 mobile:py-8"
          >
            <div className="flex w-full max-w-[1280px] grow shrink-0 basis-0 flex-col items-center justify-between">
              {/* Top: Close button */}
              <div className="flex w-full flex-col items-start pb-4">
                <Button
                  variant="white"
                  size={isMobileNav ? "small" : "medium"}
                  icon={<FeatherX />}
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
              </div>

              {/* Middle: Nav links + secondary */}
              <div className="flex w-full items-start gap-32 mobile:flex-col mobile:gap-12">
                <div className="mb-[12px] mt-[12px] flex flex-col items-start gap-2">
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
                        className={`text-[48px] leading-[48px] font-extrabold font-display-title-bold tracking-[-0.03125em] text-black-950 uppercase no-underline ${
                          (link.href === "/" && pathname === "/") ||
                          (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]))
                            ? "opacity-30"
                            : ""
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
                  className="flex flex-col items-start gap-1 pt-8 mobile:px-0 mobile:py-0"
                >
                  {secondaryLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-[16px] leading-[24px] font-heading-medium-default text-black-800 no-underline"
                      style={{ textDecoration: "none" }}
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
                className="flex w-full items-end justify-between mobile:flex-col mobile:items-start mobile:gap-8"
              >
                <div className="flex flex-col items-start gap-1">
                  <span className="text-body-bold font-body-bold text-black-800">
                    T: 2349031114455
                  </span>
                  <span className="text-body-bold font-body-bold text-black-800">
                    E: info@onechancegame.com
                  </span>
                </div>
                <div className="flex flex-col items-end gap-8 mobile:w-full mobile:items-start">
                  <div className="flex items-center gap-4">
                    <FeatherFacebook className="font-['Barlow'] text-[20px] font-[400] leading-[30px] text-default-font" />
                    <FeatherInstagram className="font-['Barlow'] text-[20px] font-[400] leading-[30px] text-default-font" />
                    <FeatherTwitter className="font-['Barlow'] text-[20px] font-[400] leading-[30px] text-default-font" />
                    <FeatherLinkedin className="font-['Barlow'] text-[20px] font-[400] leading-[30px] text-default-font" />
                    <FeatherMusic className="font-['Barlow'] text-[20px] font-[400] leading-[30px] text-default-font" />
                    <FeatherYoutube className="font-['Barlow'] text-[20px] font-[400] leading-[30px] text-default-font" />
                  </div>
                  <span className="text-caption-bold font-caption-bold text-black-800">
                    DESIGNED BY N6
                  </span>
                </div>
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
