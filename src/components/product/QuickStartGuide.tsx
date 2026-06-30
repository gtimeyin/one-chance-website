"use client";

import { useState } from "react";
import Image from "next/image";

export interface QuickStartStep {
  title: string;
  description: string;
}

interface QuickStartGuideProps {
  steps: QuickStartStep[];
  boardImage?: string;
}

export default function QuickStartGuide({ steps, boardImage }: QuickStartGuideProps) {
  const [activeStep, setActiveStep] = useState(0);

  if (steps.length === 0) return null;

  const numbered = steps.map((s, i) => ({
    ...s,
    number: String(i + 1).padStart(2, "0"),
  }));
  const active = numbered[activeStep] ?? numbered[0];

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
                {active.number}
              </span>
              <div style={{ paddingTop: 6 }}>
                <h3
                  className="font-barlow-condensed font-bold uppercase"
                  style={{
                    fontSize: 17,
                    color: "var(--color-dark)",
                    marginBottom: 14,
                    letterSpacing: "0.02em",
                  }}
                >
                  {active.title}
                </h3>
                <p
                  className="font-barlow-condensed"
                  style={{
                    fontSize: 16,
                    color: "rgba(0,0,0,0.6)",
                    lineHeight: 1.6,
                  }}
                >
                  {active.description}
                </p>
              </div>
            </div>

            {/* Blue divider */}
            <div style={{ height: 2, background: "#68C5F2", marginBottom: 32 }} />

            {/* Other step titles */}
            <div className="flex flex-col" style={{ gap: 24 }}>
              {numbered
                .map((step, idx) => ({ step, idx }))
                .filter(({ idx }) => idx !== activeStep)
                .map(({ step, idx }) => {
                  return (
                    <button
                      key={step.number}
                      onClick={() => setActiveStep(idx)}
                      className="bg-transparent border-none text-left cursor-pointer p-0"
                      style={{ transition: "opacity 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      <span
                        className="font-barlow-condensed font-bold uppercase"
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
        {boardImage && (
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
                src={boardImage}
                alt="Game board"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
