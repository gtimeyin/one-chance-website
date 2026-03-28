"use client";

import { useState } from "react";
import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "HOW TO PASS JAMB",
    description:
      "Lorem ipsum dolor sit amet consectetur. Porta tellus cursus diam feugiat vestibulum. Risus tincidunt condimentum sed pretium et velit cursus sagittis nibh. Ultricies commodo scelerisque mauris suspendisse feugiat nibh.",
  },
  {
    number: "02",
    title: "WHAT IS ONE CHANCE",
    description: "Learn about the core mechanics and the story behind Nigeria's first authentic board game.",
  },
  {
    number: "03",
    title: "TRAFFIC & PRISON",
    description: "Navigate the notorious Lagos traffic and avoid the pitfalls of the prison squares.",
  },
  {
    number: "04",
    title: "AJO CONTRIBUTION",
    description: "Participate in the communal savings scheme to boost your wealth or help a friend.",
  },
  {
    number: "05",
    title: "GETTING RICH",
    description: "Strategize your moves to accumulate the most Naira and become the ultimate winner.",
  },
];

export default function QuickStartGuide() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="w-full" style={{ background: "white" }}>
      {/* Title */}
      <div
        style={{
          padding: "clamp(60px, 8vw, 100px) clamp(20px, 4vw, 60px) clamp(40px, 5vw, 60px)",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <h2
            className="font-barlow-condensed font-extrabold uppercase"
            style={{
              fontSize: "clamp(48px, 8vw, 110px)",
              color: "var(--color-dark)",
              letterSpacing: "-0.02em",
              lineHeight: 0.88,
              maxWidth: 900,
            }}
          >
            A QUICK START GUIDE ON HOW TO PLAY THE GAME.
          </h2>
        </div>
      </div>

      {/* Two-column content: steps left, board right */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: 600 }}>
        {/* Left Column */}
        <div
          className="flex flex-col justify-center"
          style={{
            padding: "clamp(30px, 4vw, 60px) clamp(20px, 4vw, 60px)",
          }}
        >
          <div style={{ maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            {/* Active step expanded */}
            <div className="flex items-start" style={{ marginBottom: 40 }}>
              <span
                className="font-barlow-condensed font-extrabold"
                style={{
                  fontSize: "clamp(80px, 10vw, 120px)",
                  color: "rgba(0,0,0,0.12)",
                  lineHeight: 0.75,
                  marginRight: 20,
                  flexShrink: 0,
                }}
              >
                {steps[activeStep].number}
              </span>
              <div style={{ paddingTop: 6 }}>
                <h3
                  className="font-barlow font-bold uppercase"
                  style={{
                    fontSize: 17,
                    color: "var(--color-dark)",
                    marginBottom: 14,
                    letterSpacing: "0.02em",
                  }}
                >
                  {steps[activeStep].title}
                </h3>
                <p
                  className="font-barlow"
                  style={{
                    fontSize: 14,
                    color: "rgba(0,0,0,0.6)",
                    lineHeight: 1.6,
                  }}
                >
                  {steps[activeStep].description}
                </p>
              </div>
            </div>

            {/* Blue divider */}
            <div style={{ height: 2, background: "#68C5F2", marginBottom: 32 }} />

            {/* Other step titles */}
            <div className="flex flex-col" style={{ gap: 24 }}>
              {steps
                .filter((_, i) => i !== activeStep)
                .map((step, idx) => {
                  const realIndex = steps.indexOf(step);
                  return (
                    <button
                      key={step.number}
                      onClick={() => setActiveStep(realIndex)}
                      className="bg-transparent border-none text-left cursor-pointer p-0"
                      style={{ transition: "opacity 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      <span
                        className="font-barlow font-bold uppercase"
                        style={{
                          fontSize: 17,
                          color: "var(--color-dark)",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {step.title}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Right Column: Blue bg with board */}
        <div
          className="relative flex items-center justify-center overflow-visible"
          style={{
            background: "#68C5F2",
            minHeight: 500,
          }}
        >
          {/* Black diamond */}
          <div
            className="absolute"
            style={{
              width: "70%",
              paddingBottom: "70%",
              background: "var(--color-dark)",
              transform: "rotate(45deg) skew(-5deg, -5deg)",
              boxShadow: "30px 30px 80px rgba(0,0,0,0.35)",
              zIndex: 1,
            }}
          />

          {/* Board image */}
          <div
            className="relative"
            style={{
              width: "85%",
              height: "85%",
              position: "absolute",
              inset: 0,
              margin: "auto",
              zIndex: 2,
            }}
          >
            <Image
              src="/images/shop/game-board.png"
              alt="One Chance Board"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
