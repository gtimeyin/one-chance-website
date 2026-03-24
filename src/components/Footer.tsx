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
        padding: "clamp(60px, 8vw, 120px) clamp(20px, 4vw, 60px)",
        gap: 60,
      }}
    >
      {/* Top: CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center"
        style={{ gap: 24 }}
      >
        <p
          className="font-barlow"
          style={{
            fontSize: 18,
            lineHeight: "24px",
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          Thanks for exploring
        </p>

        <p
          className="font-barlow"
          style={{
            fontSize: 18,
            lineHeight: "24px",
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          Now, it&apos;s time to begin your One Chance experience.
        </p>

        <motion.a
          href="#buy"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="font-barlow text-center cursor-pointer inline-block"
          style={{
            fontSize: 24,
            lineHeight: "100%",
            letterSpacing: "0.02em",
            padding: "16px 32px",
            background: "white",
            color: "rgb(18, 27, 25)",
            borderRadius: 999,
            textDecoration: "none",
          }}
        >
          Buy a GAME
        </motion.a>
      </motion.div>

      {/* Newsletter form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col items-center text-center w-full"
        style={{ maxWidth: 480, gap: 16 }}
      >
        <p
          className="font-barlow"
          style={{
            fontSize: 14,
            lineHeight: "160%",
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          Sign up for our newsletter to&nbsp;receive updates and&nbsp;content
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEmail("");
          }}
          className="flex w-full"
          style={{ gap: 8 }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 font-barlow"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 999,
              padding: "12px 20px",
              fontSize: 14,
              color: "white",
              outline: "none",
            }}
            required
          />
          <button
            type="submit"
            className="font-barlow cursor-pointer"
            style={{
              background: "white",
              color: "rgb(18, 27, 25)",
              borderRadius: 999,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 600,
              border: "none",
            }}
          >
            Sign Up
          </button>
        </form>

        <p
          className="font-barlow"
          style={{
            fontSize: 14,
            lineHeight: "160%",
            color: "rgba(255, 255, 255, 0.4)",
          }}
        >
          By signing up to receive emails from One Chance, you agree to our{" "}
          <a
            href="#"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              textDecoration: "underline",
            }}
          >
            Privacy&nbsp;Policy
          </a>
        </p>
      </motion.div>

      {/* Bottom links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col md:flex-row items-center justify-between w-full"
        style={{
          maxWidth: 1280,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 32,
          gap: 16,
        }}
      >
        <div className="flex items-center" style={{ gap: 24 }}>
          {["TikTok", "Instagram", "x.com"].map((social) => (
            <a
              key={social}
              href="#"
              className="font-barlow"
              style={{
                fontSize: 24,
                lineHeight: "31px",
                fontWeight: 600,
                color: "rgb(255, 255, 255)",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "#fccd21")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "rgb(255, 255, 255)")
              }
            >
              {social}
            </a>
          ))}
        </div>

        <p
          className="font-barlow"
          style={{
            fontSize: 14,
            lineHeight: "22px",
            letterSpacing: "-0.02em",
            fontWeight: 600,
            color: "rgba(255, 255, 255, 0.4)",
          }}
        >
          @ 2025 All rights reserved
        </p>
      </motion.div>
    </footer>
  );
}
