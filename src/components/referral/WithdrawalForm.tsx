"use client";

import { useActionState } from "react";
import { requestWithdrawal } from "@/app/actions/referral";
import { Button } from "@/ui/components/Button";
import { TextField } from "@/ui/components/TextField";
import type { ReferralFormState } from "@/lib/referral-definitions";

const initialState: ReferralFormState = {};

interface Props {
  currentBalance: number;
}

export default function WithdrawalForm({ currentBalance }: Props) {
  const [state, formAction, pending] = useActionState(
    requestWithdrawal,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.message && (
        <div
          className={`px-4 py-3 text-[14px] font-['Barlow'] border ${
            state.success
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {state.message}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <span className="font-['Barlow'] text-[14px] text-neutral-500">
          Available balance: <strong>${currentBalance.toFixed(2)}</strong>
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <TextField label="Amount" error={!!state.errors?.amount}>
          <TextField.Input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            max={currentBalance}
            placeholder="0.00"
          />
        </TextField>
        {state.errors?.amount && (
          <span className="text-red-600 text-[13px] font-['Barlow']">
            {state.errors.amount[0]}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-['Barlow'] text-[14px] font-[500] text-neutral-700">
          Withdrawal Method
        </label>
        <div className="flex flex-col gap-2">
          {[
            {
              value: "store_credit",
              label: "Store Credit",
              desc: "Apply as a discount on your next purchase",
            },
            {
              value: "cash",
              label: "Cash Withdrawal",
              desc: "Transfer to your bank or payment account",
            },
            {
              value: "donate",
              label: "Donate",
              desc: "Donate your credits to a cause",
            },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-start gap-3 p-3 border border-neutral-200 hover:border-neutral-400 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="method"
                value={option.value}
                defaultChecked={option.value === "store_credit"}
                className="mt-1"
              />
              <div className="flex flex-col">
                <span className="font-['Barlow'] text-[14px] font-[600] text-neutral-800">
                  {option.label}
                </span>
                <span className="font-['Barlow'] text-[13px] text-neutral-500">
                  {option.desc}
                </span>
              </div>
            </label>
          ))}
        </div>
        {state.errors?.method && (
          <span className="text-red-600 text-[13px] font-['Barlow']">
            {state.errors.method[0]}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <TextField label="Notes (optional)">
          <TextField.Input name="notes" type="text" placeholder="Any additional details" />
        </TextField>
      </div>

      <Button variant="brand-primary" size="medium" disabled={pending} onClick={() => {}}>
        {pending ? "Submitting..." : "Submit Withdrawal Request"}
      </Button>
    </form>
  );
}
