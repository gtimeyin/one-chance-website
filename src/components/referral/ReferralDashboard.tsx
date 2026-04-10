"use client";

import { useState } from "react";
import type { ReferralDashboardData } from "@/lib/referral-definitions";
import ReferralCodeCard from "./ReferralCodeCard";
import CreditSummary from "./CreditSummary";
import CreditLedger from "./CreditLedger";
import ReferralNetwork from "./ReferralNetwork";

interface Props {
  data: ReferralDashboardData;
}

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "network", label: "Network" },
  { id: "activity", label: "Activity" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function ReferralDashboard({ data }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="flex flex-col gap-6">
      {/* Tab navigation */}
      <div className="flex gap-0 border-b border-neutral-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 font-['Barlow'] text-[14px] font-[600] uppercase border-b-2 cursor-pointer bg-transparent transition-colors ${
              activeTab === tab.id
                ? "border-[#FFD600] text-neutral-800"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
            style={{ border: "none", borderBottom: activeTab === tab.id ? "2px solid var(--color-yellow, #FFD600)" : "2px solid transparent" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-6">
          {data.code && (
            <ReferralCodeCard
              code={data.code}
              totalReferrals={data.stats.totalReferrals}
              totalEarned={data.stats.totalEarned}
            />
          )}
          <CreditSummary
            totalEarned={data.stats.totalEarned}
            totalWithdrawn={data.stats.totalWithdrawn}
            currentBalance={data.stats.currentBalance}
          />
        </div>
      )}

      {activeTab === "network" && <ReferralNetwork nodes={data.network} />}

      {activeTab === "activity" && (
        <CreditLedger entries={data.recentLedger} />
      )}
    </div>
  );
}
