"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  getStoredConsent,
  setStoredConsent,
  subscribeConsent,
} from "@/lib/analytics";

export default function CookieConsent() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getStoredConsent,
    () => "unset" as const,
  );

  if (consent !== "unset") return null;

  const choose = (value: "granted" | "denied") => {
    setStoredConsent(value);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[100] font-barlow-condensed"
      style={{
        background: "white",
        borderTop: "1px solid var(--color-border-light)",
        boxShadow: "0 -8px 24px rgba(0,0,0,0.08)",
        padding: "16px clamp(16px, 4vw, 32px)",
      }}
    >
      <div
        className="mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        style={{ maxWidth: 1200, gap: 16 }}
      >
        <p style={{ fontSize: 16, color: "var(--color-dark)", lineHeight: 1.5 }}>
          We use cookies to measure how the site is used (Google Analytics) so we can make it better. See our{" "}
          <Link href="/privacy" style={{ textDecoration: "underline" }}>
            privacy policy
          </Link>
          .
        </p>
        <div className="flex" style={{ gap: 8 }}>
          <button
            onClick={() => choose("denied")}
            className="font-barlow-condensed font-bold uppercase cursor-pointer"
            style={{
              padding: "10px 18px",
              background: "white",
              color: "var(--color-dark)",
              border: "1px solid var(--color-dark)",
              fontSize: 15,
              letterSpacing: "0.04em",
            }}
          >
            Decline
          </button>
          <button
            onClick={() => choose("granted")}
            className="font-barlow-condensed font-bold uppercase cursor-pointer border-none"
            style={{
              padding: "10px 18px",
              background: "#FFD600",
              color: "var(--color-dark)",
              fontSize: 15,
              letterSpacing: "0.04em",
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
