"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Accordion } from "@/ui/components/Accordion";

const faqs = [
  {
    question: "What is One Chance?",
    answer:
      "A Lagos-themed board game built around the chaos, hustle, and unpredictability of the city. Roll the dice, pick a card, and see if you can survive long enough to get rich.",
  },
  {
    question: "Who is it for?",
    answer:
      "Ages 12 and up — anyone who has lived in Lagos, visited Lagos, or argued with someone from Lagos. Plays best with 2 to 6 people who don’t mind a little loud.",
  },
  {
    question: "How long does one game take?",
    answer:
      "Most games run 45 minutes to 90 minutes. Quicker if everyone’s ruthless, longer if someone keeps landing on Bonus.",
  },
  {
    question: "What comes in the box?",
    answer:
      "Game board, 8 character pieces, 60 One Chance cards, 40 Property cards, 50 Action cards, ₦10,000,000 in game money, 2 dice, and the rule book.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes — we ship worldwide. Free delivery within Lagos; international shipping is calculated at checkout based on destination.",
  },
  {
    question: "Is it returnable?",
    answer:
      "If the box arrives damaged or anything is missing, send us an email within 14 days and we’ll replace it. Otherwise, all sales are final.",
  },
  {
    question: "Can I buy it as a gift?",
    answer:
      "Yes. Gift wrapping and a personalised note are free at checkout — just tick the box.",
  },
];

export default function FAQs() {
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
            Before you press buy
          </span>
          <span className="text-display-title-bold font-display-title-bold text-white uppercase -tracking-[2px]">
            Everything worth asking
          </span>
        </motion.div>

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

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex items-center gap-2 pt-8"
        >
          <span className="font-['Barlow'] text-[18px] font-[400] leading-[26px] text-[#ffffff99]">
            Still didn’t get your answer?
          </span>
          <Link
            href="/contact"
            className="font-['Barlow'] text-[18px] font-[600] leading-[26px] text-[#fccd21] underline"
          >
            Send us a message
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
