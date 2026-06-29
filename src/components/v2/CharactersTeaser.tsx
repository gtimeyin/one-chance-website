"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Char } from "@/ui/components/Char";

const teaserCharacters = [
  { name: "The Mama", realName: "Iya Bose", color: "#A0CA3A", image: "/images/char-mama.png" },
  { name: "The Hustler", realName: "Obi", color: "#FBAC43", image: "/images/char-worker.png" },
  { name: "The Slay Queen", realName: "Chioma", color: "#C73367", image: "/images/char-slay-queen.png" },
  { name: "The Area Boy", realName: "2 Bobo", color: "#D03B3F", image: "/images/char-area-boy.png" },
];

export default function CharactersTeaser() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });

  return (
    <section
      id="meetthelagosians"
      ref={ref}
      className="flex w-full flex-col items-center justify-center bg-white"
      style={{ padding: "clamp(60px, 8vw, 128px) 24px" }}
    >
      <div className="flex w-full max-w-[1280px] flex-col items-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full font-['Barlow_Condensed'] text-[200px] font-[800] leading-[145px] text-neutral-800 text-center uppercase -tracking-[8px] mobile:text-[60px] mobile:leading-[58px] mobile:-tracking-[2px]"
        >
          MEET THE LAGOSIANS
        </motion.span>

        <div
          className="flex w-full max-w-[1024px] flex-none items-end gap-3 overflow-x-auto px-4 pb-1 [-webkit-overflow-scrolling:touch] mt-[20px] md:gap-8 md:overflow-visible md:px-0 md:pb-0"
          style={{ minHeight: 420 }}
        >
          {teaserCharacters.map((char, i) => (
            <motion.div
              key={char.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 200,
                delay: isInView ? 0.1 + i * 0.08 : 0,
              }}
              className="relative h-auto w-[min(28vw,140px)] shrink-0 self-stretch md:w-auto md:grow md:basis-0 flex flex-col items-center gap-3"
            >
              <div className="flex-1 w-full flex items-end justify-center">
                <Char className="h-full w-full" image={char.image} />
              </div>
              <div className="flex flex-col items-center text-center gap-0.5 pb-2">
                <span
                  className="font-['Barlow_Condensed'] uppercase"
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    lineHeight: 1,
                    color: char.color,
                    letterSpacing: "0.02em",
                  }}
                >
                  {char.realName}
                </span>
                <span className="font-['Barlow'] text-[12px] font-[500] uppercase tracking-[0.12em] text-neutral-500">
                  {char.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col items-center gap-3 pt-12"
        >
          <span
            className="font-barlow"
            style={{ fontSize: 16, color: "#3f4745" }}
          >
            Four of eight. Every one of them is somebody you know.
          </span>
          <Link
            href="/characters"
            className="font-['Barlow'] text-[20px] font-[700] leading-[26px] text-[#121B19] underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Meet all 8 Lagosians →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
