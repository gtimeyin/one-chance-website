"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "How to pass jamb",
    body: "Roll a 4, 5, or 6 to pass JAMB and enter the game. Once you scale through, collect your salary and begin your hustle!",
    color: "#99CAF1",
    rotation: 90,
  },
  {
    number: "02",
    title: "What is One Chance",
    body: "You don enter one chance! Pick a card and face your fate — it could be a blessing or serious wahala!",
    color: "#FCD958",
    rotation: 135,
  },
  {
    number: "03",
    title: "Traffic & Prison",
    body: "Land on Traffic and skip one turn. Land on Prison and skip two. Avoid them by all means — Lagos no dey show mercy!",
    color: "#DF6961",
    rotation: 200,
  },
];

export default function HowToPlayTeaser() {
  const [activeStep, setActiveStep] = useState("01");
  const [isIdle, setIsIdle] = useState(true);
  const active = steps.find((s) => s.number === activeStep) || steps[0];

  const handleStepClick = (stepNumber: string) => {
    setActiveStep(stepNumber);
    setIsIdle(false);
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="howtoplay"
      ref={ref}
      className="relative flex flex-col items-center justify-start w-full"
      style={{
        backgroundColor: "#fccd21",
        marginTop: 0,
        zIndex: 3,
        overflow: "visible",
        padding: 0,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 146 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 146 }}
        transition={{ type: "spring", damping: 25, stiffness: 100, duration: 1 }}
        className="flex items-center justify-start w-full howtoplay-container"
        style={{ maxWidth: 1440, overflow: "visible", paddingBottom: 80 }}
      >
        <div
          className="flex flex-col howtoplay-card"
          style={{
            backgroundColor: "rgb(255, 255, 255)",
            width: "100%",
            maxWidth: 1360,
            gap: 32,
            overflow: "visible",
            position: "relative",
            marginTop: -100,
          }}
        >
          <div className="w-full flex flex-col gap-3">
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
              How it works
            </span>
            <h1
              className="text-display-title-bold font-display-title-bold uppercase -tracking-[3px] mobile:text-[60px] mobile:leading-[54px]"
              style={{ color: "#121B19", wordWrap: "break-word", overflowWrap: "break-word" }}
            >
              The first 3 steps of surviving Lagos
            </h1>
          </div>

          <div
            className="hidden md:flex w-full"
            style={{ gap: 29, flex: 1, minHeight: 0 }}
          >
            <div className="flex flex-col" style={{ width: 330, zIndex: 3 }}>
              {steps.map((step) => {
                const isActive = activeStep === step.number;
                return (
                  <button
                    key={step.number}
                    onClick={() => handleStepClick(step.number)}
                    className="flex items-start cursor-pointer text-left"
                    style={{
                      height: isActive ? 160 : undefined,
                      padding: "24px 0",
                      gap: 24,
                      background: "none",
                      border: "none",
                      borderBottom: isActive
                        ? `3px solid ${step.color}`
                        : "none",
                      width: "100%",
                      overflow: "visible",
                      transition: "height 0.3s cubic-bezier(0.44, 0, 0.56, 1)",
                    }}
                  >
                    <span
                      className="font-barlow-condensed uppercase"
                      style={{
                        fontSize: isActive ? 96 : 24,
                        lineHeight: isActive ? "62px" : "24px",
                        letterSpacing: "0.5px",
                        fontWeight: isActive ? 800 : 600,
                        color: "rgb(207, 209, 208)",
                        whiteSpace: "pre",
                        transition: "all 0.3s cubic-bezier(0.44, 0, 0.56, 1)",
                      }}
                    >
                      {step.number}
                    </span>
                    <div
                      className="flex flex-col justify-center"
                      style={{ flex: 1, minWidth: 160, gap: 4 }}
                    >
                      <span
                        className="font-barlow uppercase"
                        style={{
                          fontSize: 20,
                          lineHeight: "100%",
                          fontWeight: isActive ? 700 : 500,
                          color: "rgb(7, 7, 7)",
                          transition: "all 0.3s cubic-bezier(0.44, 0, 0.56, 1)",
                        }}
                      >
                        {step.title}
                      </span>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="font-barlow"
                          style={{
                            fontSize: 14,
                            lineHeight: "20px",
                            color: "rgb(63, 71, 69)",
                          }}
                        >
                          {step.body}
                        </motion.p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div
              className="flex-1 relative overflow-hidden flex items-center justify-center"
              style={{
                backgroundColor: "#232323",
                perspective: "9999px",
                minHeight: 400,
              }}
            >
              <motion.img
                className="origin-center"
                style={{ rotateX: 60, maxWidth: "80%", scale: 1.5 }}
                animate={isIdle ? { rotateZ: [0, 360] } : { rotateZ: active.rotation }}
                transition={
                  isIdle
                    ? { rotateZ: { duration: 60, repeat: Infinity, ease: "linear" } }
                    : { rotateZ: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                }
                src="https://res.cloudinary.com/subframe/image/upload/v1775248795/uploads/12376/nyafpurqelrgtlokjkkq.svg"
                alt="One Chance board game"
              />
              <div
                className="absolute inset-0 flex flex-col justify-end"
                style={{ padding: "57px 49px", zIndex: 2 }}
              >
                <motion.p
                  key={activeStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="font-barlow font-bold"
                  style={{
                    fontSize: 32,
                    lineHeight: "37px",
                    color: "white",
                    maxWidth: 486,
                  }}
                >
                  {active.body}
                </motion.p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:hidden w-full" style={{ gap: 16 }}>
            {steps.map((step) => {
              const isActive = activeStep === step.number;
              return (
                <button
                  key={step.number}
                  onClick={() => handleStepClick(step.number)}
                  className="flex items-start cursor-pointer text-left"
                  style={{
                    padding: "16px 0",
                    gap: 16,
                    background: "none",
                    border: "none",
                    borderBottom: isActive
                      ? `1px solid ${step.color}`
                      : "none",
                    width: "100%",
                  }}
                >
                  <span
                    className="font-barlow-condensed uppercase"
                    style={{
                      fontSize: isActive ? 64 : 24,
                      fontWeight: isActive ? 800 : 600,
                      color: "rgb(207, 209, 208)",
                      letterSpacing: "0.5px",
                      lineHeight: isActive ? "48px" : "24px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {step.number}
                  </span>
                  <div
                    className="flex flex-col justify-center"
                    style={{ flex: 1, gap: 4 }}
                  >
                    <span
                      className="font-barlow uppercase"
                      style={{
                        fontSize: 18,
                        fontWeight: isActive ? 700 : 500,
                        color: "rgb(7, 7, 7)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {step.title}
                    </span>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-barlow"
                        style={{
                          fontSize: 14,
                          lineHeight: "20px",
                          color: "rgb(63, 71, 69)",
                        }}
                      >
                        {step.body}
                      </motion.p>
                    )}
                  </div>
                </button>
              );
            })}

            <div style={{ padding: 24, background: "#99CAF1" }}>
              <motion.p
                key={activeStep + "-mobile"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-barlow font-bold"
                style={{ fontSize: 24, lineHeight: "28px", color: "rgb(18, 27, 25)" }}
              >
                {active.body}
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="flex flex-col items-center text-center"
        style={{ gap: 16, padding: "0 24px 80px" }}
      >
        <span
          className="font-barlow"
          style={{ fontSize: 16, color: "#3f4745" }}
        >
          There are six in total.
        </span>
        <Link
          href="/rules"
          className="font-['Barlow'] text-[20px] font-[700] leading-[26px] text-[#121B19] underline underline-offset-4 hover:opacity-70 transition-opacity"
        >
          Read the full rules →
        </Link>
      </motion.div>
    </section>
  );
}
