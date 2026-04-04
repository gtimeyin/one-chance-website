"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const newsItems = [
  {
    date: "07 July, 2024",
    title: "One Chance Board Game Launches in Lagos",
    color: "#FCD958",
  },
  {
    date: "15 August, 2024",
    title: "How One Chance Brings Families Together",
    color: "#5AD46F",
  },
  {
    date: "22 September, 2024",
    title: "Behind the Design of One Chance Characters",
    color: "#99CAF1",
  },
];

export default function NewsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="flex w-full flex-col items-center justify-center bg-white"
      style={{ padding: "clamp(60px, 8vw, 128px) 24px" }}
    >
      <div className="flex w-full flex-col items-start" style={{ maxWidth: 1280, gap: 48 }}>
        {/* Header */}
        <div className="flex w-full items-end justify-between">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-barlow-condensed uppercase"
            style={{
              fontSize: "clamp(48px, 6vw, 96px)",
              fontWeight: 800,
              letterSpacing: "-3px",
              color: "rgb(18, 27, 25)",
              lineHeight: "90%",
            }}
          >
            {"News, Updates\n& Amebo"}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/updates"
              className="font-barlow font-semibold no-underline flex items-center gap-2"
              style={{
                fontSize: 14,
                color: "rgb(18, 27, 25)",
                textDecoration: "none",
                padding: "10px 16px",
                border: "1px solid rgb(229, 229, 229)",
              }}
            >
              View all
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="flex w-full items-start gap-4" style={{ minWidth: 0 }}>
          {newsItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="flex flex-1 flex-col items-start justify-between cursor-pointer"
              style={{
                height: 448,
                minWidth: 288,
                background: item.color,
                padding: 24,
              }}
            >
              <span
                className="font-barlow-condensed uppercase"
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: "24px",
                  color: "rgb(18, 27, 25)",
                }}
              >
                {item.date}
              </span>
              <span
                className="font-barlow-condensed uppercase"
                style={{
                  fontSize: 30,
                  fontWeight: 500,
                  lineHeight: "36px",
                  color: "rgb(18, 27, 25)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {item.title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
