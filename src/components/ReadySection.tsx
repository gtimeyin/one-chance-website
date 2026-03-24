"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function ReadySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="flex flex-col items-center justify-center w-full"
      style={{
        padding: "clamp(120px, 15vw, 250px) 0 clamp(60px, 10vw, 150px)",
        overflow: "hidden",
        maxWidth: 826,
        margin: "0 auto",
        gap: 32,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center text-center w-full"
        style={{ gap: 0 }}
      >
        <p
          className="font-barlow"
          style={{
            fontSize: 24,
            lineHeight: "100%",
            letterSpacing: "0.02em",
            color: "rgb(207, 209, 208)",
            marginBottom: 24,
          }}
        >
          Grab your copy
        </p>

        <div className="flex flex-col items-center" style={{ gap: 13 }}>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", damping: 30, stiffness: 200, delay: 0.2 }}
            className="font-barlow-condensed uppercase text-center"
            style={{
              fontSize: "clamp(60px, 10vw, 96px)",
              lineHeight: "82px",
              letterSpacing: "-3px",
              fontWeight: 800,
              color: "white",
            }}
          >
            Ready
            <br />
            <span style={{ color: "#fccd21" }}>experience</span>
            <br />
            one
            <br />
            chance?
          </motion.h2>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="font-barlow text-center"
        style={{
          fontSize: 24,
          lineHeight: "100%",
          letterSpacing: "0.02em",
          color: "rgb(207, 209, 208)",
        }}
      >
        Begin your adventure
      </motion.p>

      <motion.a
        href="#buy"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.4 }}
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
    </section>
  );
}
