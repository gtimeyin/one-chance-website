"use client";

import { useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";

const defaultFaqs = [
  {
    question: "What is the recommended age range for players of the game?",
    answer:
      "One Chance is recommended for players aged 12 and above. The game includes references to Lagos culture and daily life that are best enjoyed by teens and adults.",
  },
  {
    question: "Are there multiple modes of playing the game?",
    answer:
      "Yes! One Chance can be played in multiple ways depending on your group size and time. There are quick-play and full-game modes to suit different occasions.",
  },
  {
    question: "How many players can play the game at once?",
    answer:
      "One Chance supports 2 to 6 players per game session, making it perfect for intimate gatherings or larger game nights with friends and family.",
  },
  {
    question: "How does the game end?",
    answer:
      "The game ends when a player successfully navigates all challenges of Lagos life and accumulates the most wealth. The richest Lagosian wins!",
  },
  {
    question: "Where can one find the game to play?",
    answer:
      "One Chance is available for purchase through our website and select retail partners. Check our social media for the latest availability updates.",
  },
  {
    question: "Can the game be customized or personalized in any way?",
    answer:
      "We offer customization options for bulk orders, including personalized cards and branding. Contact us for more details on custom orders.",
  },
  {
    question: "Is the game available for bulk purchases?",
    answer:
      "Absolutely! We offer special pricing for bulk purchases. Whether it's for events, corporate team building, or retail, reach out to us for wholesale options.",
  },
];

interface FAQsProps {
  faqs?: { question: string; answer: string }[];
  heading?: string;
  subheading?: string;
}

export default function FAQs({ faqs = defaultFaqs, heading = "Have a question?", subheading }: FAQsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="faq"
      ref={ref}
      className="flex flex-col items-center justify-center w-full"
      style={{
        padding: "clamp(60px, 6vw, 96px) clamp(20px, 4vw, 96px) clamp(60px, 8vw, 120px)",
        backgroundColor: "white",
        scrollMarginTop: 80,
        gap: 60,
      }}
    >
      <div
        className="flex flex-col items-center justify-center w-full"
        style={{ maxWidth: 1280, overflow: "hidden", gap: 60 }}
      >
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center text-center"
          style={{ maxWidth: 840, gap: 10, width: "100%" }}
        >
          <p
            className="font-barlow uppercase"
            style={{
              fontSize: 12,
              lineHeight: "130%",
              letterSpacing: "0.15em",
              color: "rgba(8, 59, 47, 0.8)",
            }}
          >
            {heading}
          </p>
          {subheading && (
            <p
              className="font-barlow"
              style={{
                fontSize: "clamp(18px, 3vw, 24px)",
                lineHeight: "130%",
                letterSpacing: "-0.01em",
                color: "rgb(207, 209, 208)",
              }}
            >
              {subheading}
            </p>
          )}
          {!subheading && (
            <p
              className="font-barlow"
              style={{
                fontSize: "clamp(18px, 3vw, 24px)",
                lineHeight: "130%",
                letterSpacing: "-0.01em",
                color: "rgb(207, 209, 208)",
              }}
            >
              We&apos;ve got the answers
            </p>
          )}
        </motion.div>

        {/* FAQ items */}
        <div className="w-full flex flex-col" style={{ maxWidth: 840, gap: 0 }}>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            >
              {/* Question row */}
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between cursor-pointer text-left"
                style={{
                  padding: "20px 0",
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid rgba(207, 209, 208, 0.2)",
                }}
              >
                <span
                  className="font-barlow"
                  style={{
                    fontSize: "clamp(18px, 2vw, 24px)",
                    lineHeight: "130%",
                    letterSpacing: "-0.01em",
                    fontWeight: 600,
                    color: "rgb(18, 27, 25)",
                    paddingRight: 16,
                  }}
                >
                  {faq.question}
                </span>

                {/* Plus icon that rotates to X */}
                <motion.div
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: [0.44, 0, 0.56, 1] }}
                  className="shrink-0"
                  style={{ width: 24, height: 24 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <line x1="12" y1="4" x2="12" y2="20" stroke="rgb(122, 122, 122)" strokeWidth="2" strokeLinecap="round" />
                    <line x1="4" y1="12" x2="20" y2="12" stroke="rgb(122, 122, 122)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </motion.div>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.44, 0, 0.56, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <p
                      className="font-barlow"
                      style={{
                        fontSize: 18,
                        lineHeight: "140%",
                        letterSpacing: "-0.01em",
                        color: "rgb(122, 122, 122)",
                        padding: "0 0 20px",
                      }}
                    >
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Still have questions */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="font-barlow text-center"
          style={{
            fontSize: 18,
            lineHeight: "140%",
            letterSpacing: "-0.01em",
            color: "rgb(163, 163, 163)",
          }}
        >
          Still have more questions? Send a message{" "}
          <a
            href="#contact"
            style={{ color: "rgb(252, 205, 33)", textDecoration: "underline" }}
          >
            here
          </a>
        </motion.p>
      </div>
    </section>
  );
}
