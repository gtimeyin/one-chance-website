"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Accordion } from "@/ui/components/Accordion";

const defaultFaqs = [
  {
    question: "What is One Chance?",
    answer:
      "One Chance is a Lagos-themed board game that captures the chaotic, fun, and unpredictable nature of life in Lagos, Nigeria. Navigate through traffic, avoid scams, and build your fortune!",
  },
  {
    question: "How many players can play?",
    answer:
      "One Chance can be played with 2-6 players, making it perfect for family game nights or gatherings with friends.",
  },
  {
    question: "How long does a typical game last?",
    answer:
      "A typical game of One Chance lasts between 45 minutes to 1.5 hours, depending on the number of players and how the dice roll!",
  },
  {
    question: "What age group is this game suitable for?",
    answer:
      "One Chance is suitable for ages 12 and above. The game contains themes and references that are best appreciated by teens and adults.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes! We ship to most countries worldwide. Shipping costs and delivery times vary based on your location.",
  },
  {
    question: "Can I buy the game as a gift?",
    answer:
      "Absolutely! One Chance makes a great gift. We offer gift wrapping options at checkout and can include a personalized message.",
  },
  {
    question: "What comes in the box?",
    answer:
      "The game includes a game board, 6 character pieces, 2 dice, money cards, action cards, property cards, and a comprehensive rule book.",
  },
];

interface FAQsProps {
  faqs?: { question: string; answer: string }[];
  heading?: string;
  subheading?: string;
}

export default function FAQs({
  faqs = defaultFaqs,
  heading = "HAVE A QUESTION?",
  subheading = "WE HAVE ANSWERS",
}: FAQsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="faq"
      ref={ref}
      className="flex w-full flex-col items-center justify-center bg-[#121b19]"
      style={{
        padding: "clamp(60px, 6vw, 128px) 24px",
        gap: 48,
      }}
    >
      <div
        className="flex w-full max-w-[1024px] flex-col items-start"
        style={{ gap: 32 }}
      >
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start"
          style={{ gap: 24 }}
        >
          <span
            className="font-['Barlow'] uppercase"
            style={{
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "16px",
              letterSpacing: "0.15em",
              color: "#a3a3a3",
            }}
          >
            {heading}
          </span>
          <span className="text-display-title-bold font-display-title-bold text-white uppercase -tracking-[2px]">
            {subheading}
          </span>
        </motion.div>

        {/* FAQ items */}
        <div className="flex w-full flex-col items-start">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
              className="w-full"
            >
              <Accordion
                trigger={
                  <div className="flex w-full items-center gap-4 py-6">
                    <span className="grow shrink-0 basis-0 text-large-body-bold font-large-body-bold text-white">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === i ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: [0.44, 0, 0.56, 1] }}
                      className="shrink-0"
                      style={{ width: 24, height: 24 }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <line x1="12" y1="4" x2="12" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        <line x1="4" y1="12" x2="20" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                  </div>
                }
                open={openIndex === i}
                onOpenChange={(open) => setOpenIndex(open ? i : null)}
              >
                <div className="flex w-full flex-col items-start gap-2 py-4">
                  <span className="w-full font-['Barlow'] text-[18px] font-[400] leading-[26px] text-[#a3a3a3]">
                    {faq.answer}
                  </span>
                </div>
              </Accordion>
              {i < faqs.length - 1 && (
                <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-700" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex items-center gap-2 pt-8"
        >
          <span className="font-['Barlow'] text-[18px] font-[400] leading-[26px] text-[#ffffff99]">
            Still have more questions?
          </span>
          <a
            href="#contact"
            className="font-['Barlow'] text-[18px] font-[600] leading-[26px] text-[#fccd21] underline"
          >
            Send a message here
          </a>
        </motion.div>
      </div>
    </section>
  );
}
