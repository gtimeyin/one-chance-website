"use client";

import Link from "next/link";
import { Button } from "@/ui/components/Button";

interface Props {
  totalEarned: number;
  totalWithdrawn: number;
  currentBalance: number;
}

export default function CreditSummary({
  totalEarned,
  totalWithdrawn,
  currentBalance,
}: Props) {
  return (
    <div className="flex flex-col gap-5 p-6 border border-neutral-200">
      <span className="font-['Barlow_Condensed'] text-[20px] font-[700] text-neutral-800 uppercase">
        Credit Summary
      </span>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1 p-4 bg-green-50">
          <span className="font-['Barlow_Condensed'] text-[28px] font-[700] text-green-700">
            ${totalEarned.toFixed(2)}
          </span>
          <span className="font-['Barlow'] text-[13px] text-green-600">
            Total Earned
          </span>
        </div>
        <div className="flex flex-col gap-1 p-4 bg-orange-50">
          <span className="font-['Barlow_Condensed'] text-[28px] font-[700] text-orange-700">
            ${totalWithdrawn.toFixed(2)}
          </span>
          <span className="font-['Barlow'] text-[13px] text-orange-600">
            Withdrawn
          </span>
        </div>
        <div
          className="flex flex-col gap-1 p-4"
          style={{ background: "rgba(255, 214, 0, 0.15)" }}
        >
          <span
            className="font-['Barlow_Condensed'] text-[28px] font-[700]"
            style={{ color: "var(--color-dark, #1A202C)" }}
          >
            ${currentBalance.toFixed(2)}
          </span>
          <span className="font-['Barlow'] text-[13px] text-neutral-600">
            Balance
          </span>
        </div>
      </div>

      {currentBalance > 0 && (
        <Link href="/account/referrals/withdraw">
          <Button variant="brand-primary" size="medium">
            Withdraw Credits
          </Button>
        </Link>
      )}
    </div>
  );
}
