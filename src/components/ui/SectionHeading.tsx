import React from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";
type HeadingSize = "display" | "h1" | "h2" | "h3" | "h4";

const sizeClass: Record<HeadingSize, string> = {
  display: "type-display",
  h1: "type-h1",
  h2: "type-h2",
  h3: "type-h3",
  h4: "type-h4",
};

interface SectionHeadingProps {
  children: React.ReactNode;
  as?: HeadingLevel;
  size?: HeadingSize;
  eyebrow?: string;
  align?: "left" | "center";
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function SectionHeading({
  children,
  as = "h2",
  size,
  eyebrow,
  align = "left",
  color = "var(--color-dark)",
  className = "",
  style,
}: SectionHeadingProps) {
  const resolvedSize: HeadingSize = size ?? (as === "h1" ? "h1" : as);
  const Tag = as as keyof React.JSX.IntrinsicElements;
  const headingClass = `${sizeClass[resolvedSize]} ${className}`.trim();

  if (!eyebrow) {
    return (
      <Tag className={headingClass} style={{ color, textAlign: align, ...style }}>
        {children}
      </Tag>
    );
  }

  return (
    <div
      className="flex flex-col"
      style={{
        gap: 8,
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align,
      }}
    >
      <span className="type-eyebrow" style={{ color, opacity: 0.6 }}>
        {eyebrow}
      </span>
      <Tag className={headingClass} style={{ color, ...style }}>
        {children}
      </Tag>
    </div>
  );
}
