"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Char } from "@/ui/components/Char";

const characters = [
  { name: "The Mama", image: "/images/char-mama.png" },
  { name: "The Business Woman", image: "/images/char-business-woman.png" },
  { name: "The Worker", image: "/images/char-worker.png" },
  { name: "The Big Man", image: "/images/char-big-man.png" },
  { name: "The Slay Queen", image: "/images/char-slay-queen.png" },
  { name: "The Laughing Girl", image: "/images/char-laughing-girl.png" },
  { name: "The Area Boy", image: "/images/char-area-boy.png" },
  { name: "The Chief", image: "/images/char-chief.png" },
];

export default function Characters() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="meetthelagosians"
      ref={ref}
      className="flex w-full flex-col items-center justify-center bg-white"
      style={{ padding: "clamp(60px, 8vw, 128px) 24px" }}
    >
      <div className="flex w-full max-w-[1280px] flex-col items-center">
        {/* Overline — character name on hover */}
        <div style={{ height: 32 }}>
          <AnimatePresence mode="wait">
            {hoveredIndex !== null && (
              <motion.span
                key={characters[hoveredIndex].name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="font-['Barlow'] text-[16px] font-[600] uppercase tracking-[0.15em] text-neutral-500 text-center block"
              >
                {characters[hoveredIndex].name}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Giant title */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full font-['Barlow_Condensed'] text-[200px] font-[800] leading-[145px] text-neutral-800 text-center uppercase -tracking-[8px] mobile:text-[60px] mobile:leading-[58px] mobile:-tracking-[2px]"
        >
          MEET THE LAGOSIANS
        </motion.span>

        {/* Character row — fixed height container, scale via CSS transform to avoid layout shift */}
        <div className="flex h-[420px] w-full max-w-[1024px] flex-none items-end gap-3 overflow-x-auto px-4 pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-gutter:stable] mt-[20px] md:h-[625px] md:gap-8 md:overflow-visible md:px-0 md:pb-0">
          {characters.map((char, i) => (
            <motion.div
              key={char.name}
              initial={{ opacity: 0, y: 40 }}
              animate={
                isInView
                  ? {
                      opacity:
                        hoveredIndex === null || hoveredIndex === i ? 1 : 0.15,
                      y: 0,
                    }
                  : { opacity: 0, y: 40 }
              }
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 200,
                delay: isInView && hoveredIndex === null ? 0.1 + i * 0.08 : 0,
              }}
              className="h-auto w-[min(28vw,140px)] shrink-0 self-stretch md:w-auto md:grow md:basis-0"
              style={{
                transformOrigin: "bottom center",
                transform: hoveredIndex === i ? "scale(1.5)" : "scale(1)",
                transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                zIndex: hoveredIndex === i ? 10 : 0,
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Char
                className="h-full w-full"
                image={char.image}
              />
            </motion.div>
          ))}
        </div>

        {/* Subtitle */}
        <div className="flex flex-col items-center py-6">
          <span className="text-button-small font-button-small text-subtext-color text-center">
            hover on the characters to see what they&apos;re about
          </span>
        </div>
      </div>
    </section>
  );
}
