"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LottieBackground from "./LottieBackground";
import { Button } from "@/ui/components/Button";
import { FeatherShoppingBag, FeatherChevronDown } from "@subframe/core";

const rotatingWords = ["A CHAOTIC", "AN AWESOME", "A FUN"];

const headingLines = [
  { words: ["LAGOS", "CAN", "BE"], startIndex: 0 },
  { words: ["__ROTATING__", "PLACE"], startIndex: 3 },
];

const LOADER_DELAY = 2.5;

const EASE_CURVE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const flip3d = (delay: number) => ({
  initial: {
    opacity: 0,
    rotateX: 60,
    y: 40,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      delay,
      ease: EASE_CURVE,
    },
  },
});

const wordAnimation = {
  initial: { opacity: 0.001, rotateX: 60, y: 40, scale: 0.9 },
  animate: (i: number) => ({
    opacity: 1,
    rotateX: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: LOADER_DELAY + 0.15 * i,
      ease: EASE_CURVE,
    },
  }),
};

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.span
      custom={3}
      variants={wordAnimation}
      initial="initial"
      animate="animate"
      className="leading-[82px] mobile:leading-[60px]"
      style={{
        display: "inline-block",
        background: "black",
        padding: "4px 12px",
        marginRight: "0.125em",
        transformStyle: "preserve-3d",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={rotatingWords[index]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{ display: "inline-block" }}
        >
          {rotatingWords[index]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

export default function Hero() {
  return (
    <section
      className="relative flex flex-col items-center justify-start w-full overflow-hidden max-md:min-h-[175vh]"
      style={{
        background:
          "linear-gradient(180deg, #37bbf0 8.37%, #66d8ea 27.3%, rgba(255,222,156,0.49) 66.67%)",
        zIndex: 1,
        perspective: 1200,
      }}
    >
      {/* Lottie drives the section height */}
      <LottieBackground />

      {/* Text content overlaid on top — centered via inset+margin instead of transform to avoid conflict with Framer Motion */}
      <div
        className="absolute top-0 left-0 right-0 mx-auto flex flex-col items-center justify-center overflow-hidden z-[2] pointer-events-none"
        style={{
          height: "80vh",
          width: 1027,
          maxWidth: "100%",
          padding: "200px 0",
          gap: 32,
          perspective: 1200,
        }}
      >
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex flex-col items-center justify-center gap-2">
            {headingLines.map((line, lineIndex) => (
              <h1
                key={lineIndex}
                className="text-display-title-bold font-display-title-bold text-white text-center uppercase -tracking-[3px] mobile:text-[60px] mobile:leading-[60px]"
              >
                {line.words.map((word, wi) => {
                  const globalIndex = line.startIndex + wi;
                  if (word === "__ROTATING__") {
                    return <RotatingWord key="rotating" />;
                  }
                  return (
                    <motion.span
                      key={globalIndex}
                      custom={globalIndex}
                      variants={wordAnimation}
                      initial="initial"
                      animate="animate"
                      style={{ display: "inline-block", marginRight: wi < line.words.length - 1 ? "0.125em" : 0, transformStyle: "preserve-3d" }}
                    >
                      {word}
                    </motion.span>
                  );
                })}
              </h1>
            ))}
          </div>
          <motion.span
            {...flip3d(LOADER_DELAY + 0.8)}
            className="text-button-large font-button-large text-default-font text-center mobile:text-[16px] mobile:leading-[16px]"
            style={{ transformStyle: "preserve-3d" }}
          >
            so we made a board game out of it
          </motion.span>
        </div>

        <motion.div
          {...flip3d(LOADER_DELAY + 1.0)}
          style={{ transformStyle: "preserve-3d" }}
          className="pointer-events-auto"
        >
          <Button
            variant="brand-primary"
            size="medium"
            iconRight={<FeatherShoppingBag />}
            onClick={() => { window.location.href = "/shop"; }}
          >
            Buy Now!
          </Button>
        </motion.div>

        <motion.div
          {...flip3d(LOADER_DELAY + 1.2)}
          animate={{
            opacity: 1,
            rotateX: 0,
            y: [0, 8, 0],
            scale: 1,
          }}
          transition={{
            opacity: { duration: 0.8, delay: LOADER_DELAY + 1.2, ease: [0.16, 1, 0.3, 1] },
            rotateX: { duration: 0.8, delay: LOADER_DELAY + 1.2, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 0.8, delay: LOADER_DELAY + 1.2, ease: [0.16, 1, 0.3, 1] },
            y: { repeat: Infinity, duration: 2, ease: "easeInOut", delay: LOADER_DELAY + 2 },
          }}
          className="flex h-14 w-14 flex-none items-center justify-center bg-white pointer-events-auto"
          style={{ transformStyle: "preserve-3d" }}
        >
          <FeatherChevronDown className="font-['Barlow'] text-[24px] font-[400] leading-[36px] text-default-font" />
        </motion.div>
      </div>
    </section>
  );
}
