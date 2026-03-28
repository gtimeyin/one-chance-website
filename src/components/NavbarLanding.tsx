"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { label: "How to Play", href: "#howtoplay" },
    { label: "Characters", href: "#meetthelagosians" },
    { label: "Gallery", href: "#gallery" },
    { label: "FAQs", href: "#faq" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 w-full flex items-center justify-center overflow-hidden z-10"
      style={{ padding: 0 }}
    >
      <div
        className="flex items-center justify-start w-full overflow-hidden"
        style={{ maxWidth: 1440, padding: "24px 100px 0" }}
      >
        {/* Menu toggle button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-0 cursor-pointer bg-white rounded-none"
          style={{ padding: "16px" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle menu"
        >
          <span
            className="font-barlow text-lg font-semibold"
            style={{
              fontSize: 18,
              lineHeight: "24px",
              letterSpacing: "-0.4px",
              color: "rgb(38, 52, 53)",
            }}
          >
            Menu
          </span>
          <div className="w-6 h-6 relative overflow-hidden ml-2">
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 4 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-1.5 left-1 right-1 h-0.5 bg-black"
            />
            <motion.div
              animate={{ opacity: isOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="absolute top-3 left-1 right-1 h-0.5 bg-black"
            />
            <motion.div
              animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -4 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-[18px] left-1 right-1 h-0.5 bg-black"
            />
          </div>
        </motion.button>
      </div>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed inset-0 z-50 bg-[rgb(38,52,53)] flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 text-white text-3xl cursor-pointer"
              aria-label="Close menu"
            >
              &times;
            </button>
            <div className="flex flex-col items-center gap-8">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, type: "spring", damping: 30, stiffness: 400 }}
                  className="font-barlow-condensed text-white text-5xl md:text-7xl font-800 uppercase tracking-tight hover:text-yellow transition-colors duration-300"
                  style={{ letterSpacing: "-3px" }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
