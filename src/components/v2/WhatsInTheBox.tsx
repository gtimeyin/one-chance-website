"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Button } from "@/ui/components/Button";

const boxContents = [
  "1 game board",
  "8 character pieces",
  "60 One Chance cards",
  "40 Property cards",
  "50 Action cards",
  "₦10,000,000 in game money",
  "2 dice",
  "1 rule book",
];

const testimonials = [
  {
    quote:
      "Hasn’t been a Friday night without it since we got it. Our group chat is officially called ‘One Chance Survivors’.",
    name: "Tunde A.",
    location: "Lagos",
    accent: "#FCD958",
  },
  {
    quote:
      "Bought it for my parents thinking they’d play once. They’ve replaced Sunday lunch with three rounds.",
    name: "Adaeze O.",
    location: "Abuja",
    accent: "#99CAF1",
  },
  {
    quote:
      "Funniest 90 minutes my flat has ever had. The Area Boy card alone is worth the price.",
    name: "Ifeoma K.",
    location: "London",
    accent: "#DF6961",
  },
];

export default function WhatsInTheBox() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="whats-in-the-box"
      ref={ref}
      className="flex w-full flex-col items-center justify-center bg-white"
      style={{ padding: "clamp(60px, 8vw, 128px) 24px", gap: 80 }}
    >
      <div className="flex w-full max-w-[1280px] flex-col items-start gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start gap-3"
        >
          <span
            className="font-['Barlow'] uppercase"
            style={{
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "16px",
              letterSpacing: "0.15em",
              color: "#3f4745",
            }}
          >
            What you get
          </span>
          <h2 className="text-display-title-bold font-display-title-bold uppercase -tracking-[3px] text-default-font mobile:text-[48px] mobile:leading-[48px]">
            Open the box.
          </h2>
        </motion.div>

        <div className="flex w-full items-stretch gap-12 mobile:flex-col mobile:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative grow shrink-0 basis-0 min-h-[400px] overflow-hidden mobile:min-h-[320px]"
            style={{ backgroundColor: "#fccd21" }}
          >
            <Image
              src="/images/gallery-box.jpg"
              alt="One Chance game box contents"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="flex grow shrink-0 basis-0 flex-col gap-8 self-stretch"
          >
            <ul className="flex flex-col gap-3">
              {boxContents.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 font-['Barlow'] text-[18px] leading-[26px] text-default-font"
                >
                  <span
                    aria-hidden
                    className="inline-block"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#121B19",
                      flexShrink: 0,
                    }}
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div
              className="flex flex-col gap-1 border-t border-solid border-neutral-200"
              style={{ paddingTop: 24 }}
            >
              <span className="font-['Barlow'] text-[14px] font-[500] uppercase tracking-[0.15em] text-neutral-500">
                One-time purchase
              </span>
              <div className="flex items-end gap-3">
                <span
                  className="font-['Barlow_Condensed'] font-[800] -tracking-[0.02em] text-default-font"
                  style={{ fontSize: 64, lineHeight: 1 }}
                >
                  ₦25,000
                </span>
                <span className="font-['Barlow'] text-[16px] text-neutral-600 pb-2">
                  / $35 / £29
                </span>
              </div>
              <span className="font-['Barlow'] text-[14px] text-neutral-600">
                Free delivery in Lagos. International shipping available.
              </span>
            </div>

            <Button
              size="medium"
              onClick={() => {
                window.location.href = "/shop";
              }}
            >
              Add to cart
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="flex w-full max-w-[1280px] flex-col items-start gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col items-start gap-3"
        >
          <span
            className="font-['Barlow'] uppercase"
            style={{
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "16px",
              letterSpacing: "0.15em",
              color: "#3f4745",
            }}
          >
            What players say
          </span>
          <h3
            className="font-['Barlow_Condensed'] uppercase -tracking-[2px] text-default-font mobile:text-[36px] mobile:leading-[36px]"
            style={{ fontSize: 56, lineHeight: "56px", fontWeight: 800 }}
          >
            Not us. Them.
          </h3>
        </motion.div>

        <div className="flex w-full items-stretch gap-6 mobile:flex-col mobile:gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45 + i * 0.08 }}
              className="flex grow shrink-0 basis-0 flex-col gap-6 self-stretch border-t-4 border-solid p-6"
              style={{ borderTopColor: t.accent, backgroundColor: "#fafafa" }}
            >
              <span className="font-['Barlow'] text-[18px] leading-[28px] text-default-font flex-1">
                “{t.quote}”
              </span>
              <div className="flex flex-col">
                <span className="font-['Barlow'] text-[15px] font-[700] text-default-font">
                  {t.name}
                </span>
                <span className="font-['Barlow'] text-[13px] text-neutral-500 uppercase tracking-[0.1em]">
                  {t.location}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
