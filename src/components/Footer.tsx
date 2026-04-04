"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer
      id="contact"
      ref={ref}
      className="flex flex-col items-center w-full"
      style={{
        backgroundColor: "#fccd21",
        padding: "clamp(60px, 8vw, 96px) 24px",
      }}
    >
      <div
        className="flex w-full flex-wrap items-start"
        style={{ maxWidth: 1280, gap: 48 }}
      >
        {/* Left: Thanks for exploring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start"
          style={{ minWidth: 320, gap: 16 }}
        >
          <h2
            className="font-barlow-condensed uppercase"
            style={{
              fontSize: "clamp(48px, 6vw, 80px)",
              fontWeight: 800,
              lineHeight: "90%",
              letterSpacing: "-2px",
              color: "#121B19",
              whiteSpace: "pre-wrap",
            }}
          >
            {"Thanks for\nexploring"}
          </h2>
          <p
            className="font-barlow"
            style={{
              fontSize: 16,
              lineHeight: "24px",
              color: "rgba(18, 27, 25, 0.6)",
            }}
          >
            Now it&apos;s time to begin your One Chance experience
          </p>
          <a
            href="/shop"
            className="font-barlow font-semibold inline-block"
            style={{
              fontSize: 16,
              padding: "16px 32px",
              background: "white",
              color: "rgb(18, 27, 25)",
              textDecoration: "none",
            }}
          >
            Buy a GAME
          </a>
        </motion.div>

        {/* Right: Newsletter + Social */}
        <div
          className="flex flex-1 flex-wrap items-start"
          style={{ gap: 48, minWidth: 288 }}
        >
          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-start"
            style={{ maxWidth: 448, flex: 1, minWidth: 280, gap: 16 }}
          >
            <p
              className="font-barlow"
              style={{
                fontSize: 18,
                lineHeight: "26px",
                color: "rgb(18, 27, 25)",
              }}
            >
              Subscribe to our newsletter
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
              className="flex w-full items-center"
              style={{ gap: 8 }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 font-barlow"
                style={{
                  height: 48,
                  border: "1px solid rgba(18, 27, 25, 0.2)",
                  background: "transparent",
                  padding: "0 16px",
                  fontSize: 16,
                  color: "rgb(18, 27, 25)",
                  outline: "none",
                }}
                required
              />
              <button
                type="submit"
                className="font-barlow font-semibold cursor-pointer"
                style={{
                  height: 48,
                  background: "white",
                  color: "rgb(18, 27, 25)",
                  padding: "0 24px",
                  fontSize: 16,
                  border: "none",
                }}
              >
                Sign Up
              </button>
            </form>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center"
            style={{ gap: 32 }}
          >
            {["TikTok", "Instagram", "x.com"].map((social) => (
              <a
                key={social}
                href="#"
                className="font-barlow font-bold"
                style={{
                  fontSize: 20,
                  color: "rgb(18, 27, 25)",
                  textDecoration: "none",
                  transition: "opacity 0.3s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.opacity = "0.6")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.opacity = "1")
                }
              >
                {social}
              </a>
            ))}
          </motion.div>

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="font-barlow"
            style={{
              fontSize: 14,
              color: "rgba(18, 27, 25, 0.5)",
            }}
          >
            @ 2025 All rights reserved
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
