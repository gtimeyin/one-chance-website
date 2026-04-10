import { verifySession } from "@/lib/dal";
import {
  getReferralCodeByCustomer,
  generateReferralCode,
  getCustomerCreditSummary,
  getReferralNetwork,
  getCreditLedger,
  getWithdrawalRequests,
  getReferralsByReferrer,
} from "@/lib/referral";
import ReferralDashboard from "@/components/referral/ReferralDashboard";
import type { ReferralDashboardData } from "@/lib/referral-definitions";

export default async function ReferralsPage() {
  const session = await verifySession();
  const customerId = session.customerId;

  // Ensure user has a referral code (idempotent)
  let code = await getReferralCodeByCustomer(customerId);
  if (!code) {
    code = await generateReferralCode(customerId);
  }

  const [summary, network, recentLedger, withdrawals, referrals] =
    await Promise.all([
      getCustomerCreditSummary(customerId),
      getReferralNetwork(customerId),
      getCreditLedger(customerId, 1, 10),
      getWithdrawalRequests(customerId),
      getReferralsByReferrer(customerId),
    ]);

  const dashboardData: ReferralDashboardData = {
    code,
    stats: {
      totalReferrals: referrals.length,
      totalEarned: summary?.total_earned ?? 0,
      totalWithdrawn: summary?.total_withdrawn ?? 0,
      currentBalance: summary?.current_balance ?? 0,
    },
    network,
    recentLedger,
    withdrawals,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-['Barlow_Condensed'] text-[40px] font-[800] leading-[1.1] text-neutral-800 uppercase -tracking-[0.02em]">
          REFERRAL PROGRAM
        </h1>
        <p className="font-['Barlow'] text-[16px] text-neutral-500">
          Share your code, earn credits when friends make a purchase.
        </p>
      </div>

      <ReferralDashboard data={dashboardData} />
    </div>
  );
}
