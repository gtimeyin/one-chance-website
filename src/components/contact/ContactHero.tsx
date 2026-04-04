"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ContactHero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "#fccd21",
        padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 40px)",
      }}
    >
      <div
        className="relative mx-auto flex items-center justify-center"
        style={{ maxWidth: 1280, minHeight: 300 }}
      >
        {/* Decorative squiggle top-right */}
        <svg
          className="absolute"
          style={{ top: -20, right: "15%", width: 180, height: 100 }}
          viewBox="0 0 180 100"
          fill="none"
        >
          <path
            d="M10 80 Q40 10 80 50 Q120 90 160 30 Q180 10 170 5"
            stroke="#fccd21"
            strokeWidth="6"
            fill="none"
            style={{ filter: "brightness(0.85)" }}
          />
        </svg>

        {/* Decorative squiggle bottom-left */}
        <svg
          className="absolute"
          style={{ bottom: 0, left: "5%", width: 160, height: 80 }}
          viewBox="0 0 160 80"
          fill="none"
        >
          <path
            d="M5 60 Q30 10 60 40 Q90 70 130 20 Q150 5 155 10"
            stroke="#fccd21"
            strokeWidth="5"
            fill="none"
            style={{ filter: "brightness(0.85)" }}
          />
        </svg>

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center relative z-10"
          style={{ gap: 8 }}
        >
          <h1
            className="text-display-title-bold font-display-title-bold uppercase -tracking-[3px] mobile:text-[48px] mobile:leading-[48px]"
            style={{ color: "#121B19" }}
          >
            NO NEED
            <br />
            TO BE SHY
          </h1>
          <p
            className="text-large-body-default font-large-body-default"
            style={{ color: "rgba(18, 27, 25, 0.7)" }}
          >
            Let&apos;s talk
          </p>
        </motion.div>

        {/* Character illustration - right side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="absolute right-0 bottom-0 hidden md:block"
          style={{ width: "clamp(180px, 20vw, 280px)" }}
        >
          <Image
            src="/images/char-chief.png"
            alt="Character"
            width={280}
            height={400}
            className="w-full h-auto object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}
