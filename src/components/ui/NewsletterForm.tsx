"use client";

import { useState } from "react";

interface NewsletterFormProps {
  variant?: "light" | "dark";
}

export default function NewsletterForm({ variant = "dark" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");

  const isDark = variant === "dark";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setEmail("");
      }}
      className="flex w-full"
      style={{ maxWidth: 400, gap: 0 }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="flex-1 font-barlow"
        style={{
          background: isDark ? "rgba(255,255,255,0.1)" : "white",
          border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid var(--color-border-light)",
          borderRight: "none",
          padding: "14px 16px",
          fontSize: 14,
          color: isDark ? "white" : "var(--color-dark)",
          outline: "none",
        }}
        required
      />
      <button
        type="submit"
        className="font-barlow cursor-pointer flex items-center justify-center"
        style={{
          background: isDark ? "white" : "var(--color-yellow)",
          color: "var(--color-dark)",
          padding: "14px 16px",
          fontSize: 14,
          fontWeight: 600,
          border: "none",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </form>
  );
}
