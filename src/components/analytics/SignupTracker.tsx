"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trackSignUp } from "@/lib/analytics";

export default function SignupTracker() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("welcome") !== "1") return;
    const hasReferral = params.get("ref") === "1";
    trackSignUp("email", hasReferral);
    router.replace("/account", { scroll: false });
  }, [params, router]);

  return null;
}
