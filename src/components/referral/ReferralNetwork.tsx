"use client";

import type { ReferralNetworkNode } from "@/lib/referral-definitions";

interface Props {
  nodes: ReferralNetworkNode[];
}

export default function ReferralNetwork({ nodes }: Props) {
  if (nodes.length === 0) {
    return (
      <div className="flex flex-col gap-3 p-6 border border-neutral-200">
        <span className="font-['Barlow_Condensed'] text-[20px] font-[700] text-neutral-800 uppercase">
          Your Network
        </span>
        <p className="font-['Barlow'] text-[14px] text-neutral-500">
          No referrals yet. Share your code to start building your network!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-6 border border-neutral-200">
      <span className="font-['Barlow_Condensed'] text-[20px] font-[700] text-neutral-800 uppercase">
        Your Network
      </span>
      <span className="font-['Barlow'] text-[14px] text-neutral-500">
        {nodes.length} {nodes.length === 1 ? "person" : "people"} joined through your referral
      </span>

      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center px-4 py-2 bg-neutral-50 border-b border-neutral-200">
          <span className="flex-1 font-['Barlow'] text-[12px] font-[600] text-neutral-500 uppercase">
            Name
          </span>
          <span className="w-28 font-['Barlow'] text-[12px] font-[600] text-neutral-500 uppercase">
            Joined
          </span>
          <span className="w-20 text-center font-['Barlow'] text-[12px] font-[600] text-neutral-500 uppercase">
            Orders
          </span>
          <span className="w-28 text-right font-['Barlow'] text-[12px] font-[600] text-neutral-500 uppercase">
            You Earned
          </span>
        </div>

        {/* Rows */}
        {nodes.map((node) => (
          <div
            key={node.referee_customer_id}
            className="flex items-center px-4 py-3 border-b border-neutral-100 last:border-b-0"
          >
            <span className="flex-1 font-['Barlow'] text-[14px] font-[500] text-neutral-800">
              {node.referee_name}
            </span>
            <span className="w-28 font-['Barlow'] text-[13px] text-neutral-500">
              {new Date(node.joined_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="w-20 text-center font-['Barlow'] text-[14px] font-[600] text-neutral-700">
              {node.orders_count}
            </span>
            <span className="w-28 text-right font-['Barlow'] text-[14px] font-[600] text-green-600">
              ${node.credits_earned.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
