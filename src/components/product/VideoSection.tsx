"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function VideoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="w-full"
      style={{
        padding: "clamp(60px, 6vw, 96px) clamp(20px, 4vw, 60px)",
        background: "#FFD600",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 1280 }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-barlow-condensed font-extrabold uppercase"
          style={{
            fontSize: "clamp(32px, 5vw, 64px)",
            color: "black",
            letterSpacing: "-0.02em",
            lineHeight: "100%",
            marginBottom: 48,
            maxWidth: 800,
          }}
        >
          HEY! READING IS THE WORST WAY TO LEARN HOW TO PLAY A GAME.
          <br />
          WATCH THIS INSTEAD
        </motion.h2>

        {/* Video container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-full flex items-center justify-center cursor-pointer"
          style={{
            aspectRatio: "16/9",
            background: "black",
            maxWidth: 1000,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          {/* Play button */}
          <div
            className="flex items-center gap-3"
            style={{ color: "white" }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--color-yellow)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--color-dark)">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <span
              className="font-barlow font-bold uppercase"
              style={{ fontSize: 16, letterSpacing: "0.05em" }}
            >
              WATCH HOW TO PLAY
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
