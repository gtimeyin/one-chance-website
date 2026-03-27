"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const characters = [
  // Row 1 — apex (centered)
  { name: "The Mama", image: "/images/char-mama.png", width: 181, height: 648, left: 519, top: 12, zIndex: 1 },
  // Row 2 — middle (3 characters, narrower spread)
  { name: "The Business Woman", image: "/images/char-business-woman.png", width: 277, height: 577, left: 160, top: 153, zIndex: 2 },
  { name: "The Worker", image: "/images/char-worker.png", width: 245, height: 661, left: 468, top: 69, zIndex: 2 },
  { name: "The Big Man", image: "/images/char-big-man.png", width: 317, height: 657, left: 743, top: 73, zIndex: 2 },
  // Row 3 — base (4 characters, full width)
  { name: "The Slay Queen", image: "/images/char-slay-queen.png", width: 315, height: 659, left: 0, top: 129, zIndex: 3 },
  { name: "The Laughing Girl", image: "/images/char-laughing-girl.png", width: 287, height: 672, left: 358, top: 116, zIndex: 3 },
  { name: "The Area Boy", image: "/images/char-area-boy.png", width: 255, height: 680, left: 687, top: 108, zIndex: 3 },
  { name: "The Chief", image: "/images/char-chief.png", width: 234, height: 625, left: 985, top: 163, zIndex: 3 },
];

export default function Characters() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });

  return (
    <section
      id="meetthelagosians"
      ref={ref}
      className="relative w-full overflow-visible"
      style={{
        backgroundColor: "white",
        height: "auto",
        minHeight: 1386,
      }}
    >
      {/* Large MEET THE LAGOSIANS heading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute w-full overflow-hidden"
        style={{ top: 0, left: 0, right: 0 }}
      >
        <h2
          className="font-barlow-condensed uppercase text-center font-extrabold"
          style={{
            fontSize: "clamp(60px, 14vw, 256px)",
            lineHeight: "78%",
            letterSpacing: "-0.03em",
            color: "rgba(39, 48, 46, 1)",
            padding: "40px 0",
          }}
        >
          MEET THE LAGOSIANS
        </h2>
      </motion.div>

      {/* Characters spread - absolutely positioned like Framer */}
      <div
        className="hidden md:block relative mx-auto"
        style={{
          width: 1219,
          maxWidth: "100%",
          height: 788,
          marginTop: 200,
        }}
      >
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
            className="absolute group cursor-pointer"
            style={{
              left: char.left,
              top: char.top,
              width: char.width,
              height: char.height,
              zIndex: char.zIndex,
            }}
          >
            <Image
              src={char.image}
              alt={char.name}
              fill
              className="object-contain object-bottom transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-2"
            />
          </motion.div>
        ))}
      </div>

      {/* Mobile: group image */}
      <div className="block md:hidden px-6 pt-32 pb-8">
        <Image
          src="/images/characters-group.png"
          alt="All the Lagosian characters"
          width={1920}
          height={957}
          className="w-full h-auto"
        />
      </div>

      {/* Subtitle */}
      <div
        className="relative w-full text-center"
        style={{ marginTop: 20, paddingBottom: 80 }}
      >
        <p
          className="font-barlow"
          style={{
            fontSize: 24,
            lineHeight: "34px",
            letterSpacing: "-0.4px",
            color: "rgba(39, 48, 46, 1)",
          }}
        >
          hover on the characters to see what they&apos;re about
        </p>
      </div>
    </section>
  );
}
