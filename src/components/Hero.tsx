"use client";

import { motion } from "framer-motion";
import LottieBackground from "./LottieBackground";

const headingLines = [
  { words: ["LAGOS", "CAN", "BE"], startIndex: 0 },
  { words: ["A CHAOTIC"], startIndex: 3 },
  { words: ["PLACE"], startIndex: 4 },
];

const wordAnimation = {
  initial: { opacity: 0.001, y: 60, scale: 1, rotate: 0, skewX: 0, skewY: 0 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 30,
      stiffness: 400,
      delay: 0.2 + i * 0.1,
    },
  }),
};

const fadeUp = {
  initial: { opacity: 0.001, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 30,
      stiffness: 400,
      delay: 1.2,
    },
  },
};

const headingStyle = {
  lineHeight: "82px",
  letterSpacing: "-3px",
  fontWeight: 800,
  color: "white",
} as const;

export default function Hero() {
  return (
    <section
      className="relative flex flex-col items-center justify-start w-full overflow-visible"
      style={{
        background:
          "linear-gradient(180deg, #37bbf0 8.37%, #66d8ea 27.3%, rgba(255,222,156,0.49) 66.67%)",
        zIndex: 1,
        minHeight: "100vh",
      }}
    >
      <LottieBackground />

      <a
        href="#howtoplay"
        className="absolute overflow-hidden"
        style={{
          top: 423,
          left: "calc(50% - 50%)",
          height: "100vh",
          width: "100%",
          zIndex: 1,
          textDecoration: "none",
        }}
      >
        <motion.div
          className="absolute left-1/2 flex items-center justify-center"
          style={{
            bottom: 40,
            transform: "translateX(-50%)",
            width: 56,
            height: 56,
            background: "white",
            borderRadius: "50%",
            zIndex: 10,
          }}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="rgb(38,52,53)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </a>

      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        className="absolute top-0 flex flex-col items-center justify-center overflow-hidden z-[2]"
        style={{
          height: "80vh",
          width: 1027,
          maxWidth: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "200px 0",
          gap: 24,
        }}
      >
        <div className="flex flex-col items-center justify-center overflow-hidden" style={{ gap: 13, width: "100%" }}>
          {headingLines.map((line, lineIndex) => (
            <h1
              key={lineIndex}
              className="font-barlow-condensed uppercase hero-heading text-center"
              style={headingStyle}
            >
              {line.words.map((word, wi) => {
                const globalIndex = line.startIndex + wi;
                return (
                  <motion.span
                    key={globalIndex}
                    custom={globalIndex}
                    variants={wordAnimation}
                    initial="initial"
                    animate="animate"
                    style={{ display: "inline-block" }}
                  >
                    {word}
                    {wi < line.words.length - 1 ? " " : ""}
                  </motion.span>
                );
              })}
            </h1>
          ))}
        </div>

        <motion.p
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="font-barlow text-center"
          style={{
            fontSize: 28,
            lineHeight: "0.8em",
            letterSpacing: "0px",
            color: "rgb(71, 71, 71)",
          }}
        >
          so we made a game out of it
        </motion.p>

        <motion.a
          href="#buy"
          variants={fadeUp}
          initial="initial"
          animate="animate"
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
          Buy NOW !
        </motion.a>
      </motion.div>
    </section>
  );
}
