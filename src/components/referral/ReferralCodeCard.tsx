"use client";

import { useState } from "react";
import { Button } from "@/ui/components/Button";
import type { ReferralCode } from "@/lib/referral-definitions";

interface Props {
  code: ReferralCode;
  totalReferrals: number;
  totalEarned: number;
}

export default function ReferralCodeCard({ code, totalReferrals, totalEarned }: Props) {
  const [copied, setCopied] = useState(false);
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const referralLink = `${siteUrl}?ref=${code.code}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "One Chance - Board Game",
          text: `Use my referral code ${code.code} to get a discount on your first purchase!`,
          url: referralLink,
        });
      } catch {
        // User cancelled share
      }
    } else {
      copyToClipboard(referralLink);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-6 border border-neutral-200">
      <div className="flex flex-col gap-1">
        <span className="font-['Barlow_Condensed'] text-[20px] font-[700] text-neutral-800 uppercase">
          Your Referral Code
        </span>
        <span className="font-['Barlow'] text-[14px] text-neutral-500">
          Share this code with friends. They get a discount, you earn credits.
        </span>
      </div>

      {/* Code display */}
      <div
        className="flex items-center justify-center py-4 px-6"
        style={{ background: "var(--color-yellow, #FFD600)" }}
      >
        <span
          className="font-['Barlow_Condensed'] text-[32px] font-[800] tracking-[0.1em]"
          style={{ color: "var(--color-dark, #1A202C)" }}
        >
          {code.code}
        </span>
      </div>

      {/* Referral link */}
      <div className="flex flex-col gap-2">
        <span className="font-['Barlow'] text-[13px] font-[600] text-neutral-600 uppercase">
          Your Link
        </span>
        <div className="flex gap-2">
          <input
            readOnly
            value={referralLink}
            className="flex-1 px-3 py-2 border border-neutral-200 font-['Barlow'] text-[14px] text-neutral-700 bg-neutral-50 outline-none"
          />
          <Button
            variant="brand-primary"
            size="small"
            onClick={() => copyToClipboard(referralLink)}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="flex gap-6 pt-2 border-t border-neutral-100">
        <div className="flex flex-col">
          <span className="font-['Barlow_Condensed'] text-[24px] font-[700] text-neutral-800">
            {totalReferrals}
          </span>
          <span className="font-['Barlow'] text-[13px] text-neutral-500">
            Referrals
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-['Barlow_Condensed'] text-[24px] font-[700] text-neutral-800">
            ${totalEarned.toFixed(2)}
          </span>
          <span className="font-['Barlow'] text-[13px] text-neutral-500">
            Total Earned
          </span>
        </div>
      </div>

      {/* Share button */}
      <Button variant="neutral-primary" size="medium" onClick={handleShare}>
        Share with Friends
      </Button>
    </div>
  );
}
