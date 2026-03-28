"use client";

import { useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "HOW TO PASS JAMB",
    description:
      "Players take turns rolling the dice and moving around the board, encountering various Lagos scenarios. Think quick, act fast, and try to navigate through the chaos of Lagos life.",
    details: [
      "WHAT IS ONE CHANCE",
      "THAT'S A PRISON",
      "A LA CORRUPTION",
      "GETTING RICH",
    ],
  },
  {
    number: "02",
    title: "MOVING AROUND THE BOARD",
    description:
      "Move your token based on dice rolls. Land on different spaces to trigger events, collect cards, and interact with other players.",
  },
  {
    number: "03",
    title: "COLLECTING CARDS",
    description:
      "Draw One Chance cards and Market cards that can help or hinder your progress. Some cards give you Naira, others may set you back.",
  },
  {
    number: "04",
    title: "MAKING MONEY",
    description:
      "Navigate market opportunities, avoid scams, and accumulate Naira. The player with the most wealth at the end wins!",
  },
  {
    number: "05",
    title: "WINNING THE GAME",
    description:
      "The game ends when all rounds are complete. Count your Naira - the richest Lagosian takes the crown!",
  },
];

export default function QuickStartGuide() {
  const [activeStep, setActiveStep] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="w-full"
      style={{
        padding: "clamp(60px, 6vw, 96px) clamp(20px, 4vw, 60px)",
        background: "white",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 1280 }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-barlow-condensed font-extrabold uppercase"
          style={{
            fontSize: "clamp(32px, 5vw, 64px)",
            color: "black",
            letterSpacing: "-0.02em",
            lineHeight: "100%",
            marginBottom: 48,
            maxWidth: 700,
          }}
        >
          A QUICK START GUIDE ON HOW TO PLAY THE GAME.
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 40 }}>
          {/* Steps list */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            {steps.map((step, i) => (
              <div key={step.number}>
                <button
                  onClick={() => setActiveStep(i)}
                  className="w-full flex items-start gap-4 cursor-pointer bg-transparent border-none text-left"
                  style={{
                    padding: "16px 0",
                    borderBottom: "1px solid var(--color-border-light)",
                  }}
                >
                  <span
                    className="font-barlow-condensed font-extrabold"
                    style={{
                      fontSize: 36,
                      color: activeStep === i ? "var(--color-yellow)" : "var(--color-border-light)",
                      lineHeight: 1,
                      transition: "color 0.3s",
                    }}
                  >
                    {step.number}
                  </span>
                  <div className="flex-1">
                    <p
                      className="font-barlow font-bold uppercase"
                      style={{
                        fontSize: 14,
                        color: activeStep === i ? "var(--color-dark)" : "var(--color-text-muted)",
                        letterSpacing: "0.02em",
                        transition: "color 0.3s",
                      }}
                    >
                      {step.title}
                    </p>
                    <AnimatePresence>
                      {activeStep === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: "hidden" }}
                        >
                          <p
                            className="font-barlow"
                            style={{
                              fontSize: 13,
                              color: "var(--color-text-muted)",
                              lineHeight: 1.6,
                              marginTop: 8,
                            }}
                          >
                            {step.description}
                          </p>
                          {step.details && (
                            <div className="flex flex-col gap-2" style={{ marginTop: 12 }}>
                              {step.details.map((detail) => (
                                <span
                                  key={detail}
                                  className="font-barlow font-semibold uppercase"
                                  style={{
                                    fontSize: 12,
                                    color: "var(--color-dark)",
                                    padding: "6px 12px",
                                    background: "var(--color-light-bg)",
                                    alignSelf: "flex-start",
                                  }}
                                >
                                  {detail}
                                </span>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              </div>
            ))}
          </motion.div>

          {/* Game board image area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center"
            style={{
              background: "var(--color-light-bg)",
              aspectRatio: "1/1",
              borderRadius: 8,
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: "70%",
                aspectRatio: "1/1",
                borderRadius: "50%",
                background: "var(--color-yellow)",
                opacity: 0.3,
              }}
            >
              <span
                className="font-barlow-condensed font-extrabold uppercase"
                style={{ fontSize: 32, color: "var(--color-dark)" }}
              >
                GAME BOARD
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
