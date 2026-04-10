"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useReferral } from "@/store/referral";

export default function ReferralCodeCapture() {
  const searchParams = useSearchParams();
  const setReferralCode = useReferral((s) => s.setReferralCode);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref) return;

    const code = ref.toUpperCase().trim();
    if (!code) return;

    // Store in Zustand (localStorage)
    setReferralCode(code);

    // Also set a cookie (30-day) so server actions can read it
    document.cookie = `oc_referral_code=${encodeURIComponent(code)}; path=/; max-age=${30 * 24 * 60 * 60}; samesite=lax`;
  }, [searchParams, setReferralCode]);

  return null;
}
