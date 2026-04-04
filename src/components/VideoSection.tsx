"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function VideoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="flex w-full flex-col items-center justify-center bg-white"
      style={{ padding: "clamp(60px, 8vw, 128px) 24px" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="flex w-full items-center justify-center cursor-pointer group"
        style={{
          minHeight: 576,
          background: "#99CAF1",
          padding: "48px",
          maxWidth: 1280,
        }}
      >
        <div className="flex items-center justify-center gap-6">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgb(18, 27, 25)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:scale-110"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span
            className="font-barlow-condensed uppercase"
            style={{
              fontSize: "clamp(48px, 6vw, 96px)",
              fontWeight: 800,
              letterSpacing: "-3px",
              color: "rgb(18, 27, 25)",
            }}
          >
            Watch game play
          </span>
        </div>
      </motion.div>
    </section>
  );
}
