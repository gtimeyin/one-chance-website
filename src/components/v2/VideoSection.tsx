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
      style={{ padding: "clamp(60px, 8vw, 128px) 24px", gap: 40 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex w-full max-w-[1024px] flex-col items-start gap-3"
      >
        <span
          className="font-['Barlow'] uppercase"
          style={{
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "16px",
            letterSpacing: "0.15em",
            color: "#3f4745",
          }}
        >
          See it in action
        </span>
        <h2
          className="text-display-title-bold font-display-title-bold uppercase -tracking-[2px] mobile:text-[48px] mobile:leading-[48px]"
          style={{ color: "#121B19" }}
        >
          One round, 60 seconds
        </h2>
        <span className="text-large-body-default font-large-body-default text-neutral-700 max-w-[640px]">
          Real players, real wahala. Watch what happens when four friends pick up a card they didn&apos;t see coming.
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="w-full"
        style={{ maxWidth: 1280 }}
      >
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/TVMIKgn9cy8"
            title="One Chance Gameplay"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: "none" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
