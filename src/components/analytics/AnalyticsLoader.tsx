"use client";

import { useSyncExternalStore } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getStoredConsent, subscribeConsent } from "@/lib/analytics";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function AnalyticsLoader() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getStoredConsent,
    () => "unset" as const,
  );

  if (!gaId || consent !== "granted") return null;
  return <GoogleAnalytics gaId={gaId} />;
}
