import { verifySession } from "@/lib/dal";
import { getCustomerCreditSummary, getWithdrawalRequests } from "@/lib/referral";
import WithdrawalForm from "@/components/referral/WithdrawalForm";
import Link from "next/link";

export default async function WithdrawPage() {
  const session = await verifySession();

  const [summary, withdrawals] = await Promise.all([
    getCustomerCreditSummary(session.customerId),
    getWithdrawalRequests(session.customerId),
  ]);

  const balance = summary?.current_balance ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Link
            href="/account/referrals"
            className="font-['Barlow'] text-[14px] text-neutral-500 hover:text-neutral-700 no-underline"
            style={{ textDecoration: "none" }}
          >
            &larr; Back to Referrals
          </Link>
        </div>
        <h1 className="font-['Barlow_Condensed'] text-[40px] font-[800] leading-[1.1] text-neutral-800 uppercase -tracking-[0.02em]">
          WITHDRAW CREDITS
        </h1>
        <p className="font-['Barlow'] text-[16px] text-neutral-500">
          Choose how you&apos;d like to use your earned credits.
        </p>
      </div>

      {balance <= 0 ? (
        <div className="p-6 border border-neutral-200">
          <p className="font-['Barlow'] text-[15px] text-neutral-500">
            You don&apos;t have any credits to withdraw yet. Keep sharing your referral code!
          </p>
        </div>
      ) : (
        <WithdrawalForm currentBalance={balance} />
      )}

      {/* Withdrawal history */}
      {withdrawals.length > 0 && (
        <div className="flex flex-col gap-3 p-6 border border-neutral-200">
          <span className="font-['Barlow_Condensed'] text-[20px] font-[700] text-neutral-800 uppercase">
            Withdrawal History
          </span>

          <div className="flex flex-col">
            <div className="flex items-center px-4 py-2 bg-neutral-50 border-b border-neutral-200">
              <span className="flex-1 font-['Barlow'] text-[12px] font-[600] text-neutral-500 uppercase">
                Date
              </span>
              <span className="w-24 font-['Barlow'] text-[12px] font-[600] text-neutral-500 uppercase">
                Amount
              </span>
              <span className="w-28 font-['Barlow'] text-[12px] font-[600] text-neutral-500 uppercase">
                Method
              </span>
              <span className="w-24 text-right font-['Barlow'] text-[12px] font-[600] text-neutral-500 uppercase">
                Status
              </span>
            </div>

            {withdrawals.map((w) => (
              <div
                key={w.id}
                className="flex items-center px-4 py-3 border-b border-neutral-100 last:border-b-0"
              >
                <span className="flex-1 font-['Barlow'] text-[13px] text-neutral-600">
                  {new Date(w.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="w-24 font-['Barlow'] text-[14px] font-[600] text-neutral-800">
                  ${w.amount.toFixed(2)}
                </span>
                <span className="w-28 font-['Barlow'] text-[13px] text-neutral-600 capitalize">
                  {w.method.replace("_", " ")}
                </span>
                <span className="w-24 text-right">
                  <span
                    className={`inline-block px-2 py-0.5 font-['Barlow'] text-[11px] font-[600] uppercase ${
                      w.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : w.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {w.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
