"use client";

import { useReferral } from "@/store/referral";
import { TextField } from "@/ui/components/TextField";

export default function ReferralCodeInput() {
  const referralCode = useReferral((s) => s.referralCode);

  return (
    <div className="flex flex-col gap-1">
      <TextField label="Referral Code (optional)">
        <TextField.Input
          name="referralCode"
          type="text"
          placeholder="e.g. OC-A3K7X9B2"
          defaultValue={referralCode || ""}
        />
      </TextField>
      {referralCode && (
        <span className="text-green-600 text-[13px] font-['Barlow']">
          Referral code applied! You&apos;ll get a discount on your first purchase.
        </span>
      )}
    </div>
  );
}
