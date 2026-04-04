"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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

  return (
    <section
      id="meetthelagosians"
      ref={ref}
      className="flex w-full flex-col items-center justify-center bg-white"
      style={{ padding: "clamp(60px, 8vw, 128px) 24px" }}
    >
      <div className="flex w-full max-w-[1280px] flex-col items-center">
        {/* Giant title */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full font-['Barlow_Condensed'] text-[200px] font-[800] leading-[145px] text-neutral-800 text-center uppercase -tracking-[8px] mobile:text-[60px] mobile:leading-[58px] mobile:-tracking-[2px]"
        >
          MEET THE LAGOSIANS
        </motion.span>

        {/* Characters row - desktop */}
        <div className="hidden md:flex h-[625px] w-full max-w-[1024px] flex-none items-end gap-8 mt-[20px]">
          {characters.map((char, i) => (
            <motion.div
              key={char.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 200,
                delay: 0.1 + i * 0.08,
              }}
              className="h-auto grow shrink-0 basis-0 self-stretch"
            >
              <Char
                className="h-full w-full"
                image={char.image}
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile: group image */}
        <div className="block md:hidden px-6 pt-16 pb-8">
          <Image
            src="/images/characters-group.png"
            alt="All the Lagosian characters"
            width={1920}
            height={957}
            className="w-full h-auto"
          />
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
