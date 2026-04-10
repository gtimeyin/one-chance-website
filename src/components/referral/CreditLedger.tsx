"use client";

import type { CreditLedgerEntry } from "@/lib/referral-definitions";

interface Props {
  entries: CreditLedgerEntry[];
}

function typeLabel(type: CreditLedgerEntry["type"]) {
  switch (type) {
    case "referral_commission":
      return "Commission";
    case "withdrawal":
      return "Withdrawal";
    case "donation":
      return "Donation";
    case "adjustment":
      return "Adjustment";
  }
}

function typeBadgeClasses(type: CreditLedgerEntry["type"]) {
  switch (type) {
    case "referral_commission":
      return "bg-green-100 text-green-700";
    case "withdrawal":
      return "bg-orange-100 text-orange-700";
    case "donation":
      return "bg-blue-100 text-blue-700";
    case "adjustment":
      return "bg-neutral-100 text-neutral-600";
  }
}

export default function CreditLedger({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col gap-3 p-6 border border-neutral-200">
        <span className="font-['Barlow_Condensed'] text-[20px] font-[700] text-neutral-800 uppercase">
          Recent Activity
        </span>
        <p className="font-['Barlow'] text-[14px] text-neutral-500">
          No transactions yet. Start sharing your referral code!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-6 border border-neutral-200">
      <span className="font-['Barlow_Condensed'] text-[20px] font-[700] text-neutral-800 uppercase">
        Recent Activity
      </span>

      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center px-4 py-2 bg-neutral-50 border-b border-neutral-200">
          <span className="flex-1 font-['Barlow'] text-[12px] font-[600] text-neutral-500 uppercase">
            Date
          </span>
          <span className="w-28 font-['Barlow'] text-[12px] font-[600] text-neutral-500 uppercase">
            Type
          </span>
          <span className="flex-1 font-['Barlow'] text-[12px] font-[600] text-neutral-500 uppercase">
            Description
          </span>
          <span className="w-24 text-right font-['Barlow'] text-[12px] font-[600] text-neutral-500 uppercase">
            Amount
          </span>
          <span className="w-24 text-right font-['Barlow'] text-[12px] font-[600] text-neutral-500 uppercase">
            Balance
          </span>
        </div>

        {/* Rows */}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center px-4 py-3 border-b border-neutral-100 last:border-b-0"
          >
            <span className="flex-1 font-['Barlow'] text-[13px] text-neutral-600">
              {new Date(entry.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </span>
            <span className="w-28">
              <span
                className={`inline-block px-2 py-0.5 font-['Barlow'] text-[11px] font-[600] uppercase ${typeBadgeClasses(entry.type)}`}
              >
                {typeLabel(entry.type)}
              </span>
            </span>
            <span className="flex-1 font-['Barlow'] text-[13px] text-neutral-600 truncate">
              {entry.description || "-"}
            </span>
            <span
              className={`w-24 text-right font-['Barlow'] text-[14px] font-[600] ${
                entry.amount > 0 ? "text-green-600" : "text-orange-600"
              }`}
            >
              {entry.amount > 0 ? "+" : ""}${entry.amount.toFixed(2)}
            </span>
            <span className="w-24 text-right font-['Barlow'] text-[13px] text-neutral-500">
              ${entry.balance_after.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
