import React from "react";

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  background?: string;
  textColor?: string;
  children?: React.ReactNode;
}

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  align = "left",
  background = "white",
  textColor = "var(--color-dark)",
  children,
}: PageHeroProps) {
  return (
    <section
      className="flex w-full justify-center"
      style={{
        background,
        padding: "clamp(48px, 8vh, 120px) clamp(20px, 4vw, 48px) clamp(32px, 5vh, 64px)",
      }}
    >
      <div
        className="flex w-full max-w-[1280px] flex-col"
        style={{
          gap: 16,
          alignItems: align === "center" ? "center" : "flex-start",
          textAlign: align,
        }}
      >
        {eyebrow && (
          <span className="type-eyebrow" style={{ color: textColor, opacity: 0.7 }}>
            {eyebrow}
          </span>
        )}
        <h1 className="type-display" style={{ color: textColor }}>
          {title}
        </h1>
        {subtitle && (
          <div
            className="type-body-lg"
            style={{ color: textColor, maxWidth: 680, opacity: 0.8 }}
          >
            {subtitle}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
