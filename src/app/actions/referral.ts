"use server";

import { verifySession } from "@/lib/dal";
import {
  generateReferralCode,
  getReferralCodeByCustomer,
  getCustomerCreditSummary,
  getCreditLedger,
  getReferralNetwork,
  getWithdrawalRequests,
  createWithdrawalRequest,
  atomicWithdraw,
  getReferralsByReferrer,
} from "@/lib/referral";
import {
  WithdrawalRequestSchema,
  type ReferralFormState,
  type ReferralDashboardData,
} from "@/lib/referral-definitions";
import { revalidatePath } from "next/cache";

export async function generateMyReferralCode(): Promise<ReferralFormState> {
  const session = await verifySession();

  const code = await generateReferralCode(session.customerId);
  if (!code) {
    return { message: "Failed to generate referral code. Please try again." };
  }

  revalidatePath("/account/referrals");
  return { success: true, message: "Referral code generated!" };
}

export async function getReferralDashboardData(): Promise<ReferralDashboardData> {
  const session = await verifySession();
  const customerId = session.customerId;

  const [code, summary, network, recentLedger, withdrawals, referrals] =
    await Promise.all([
      getReferralCodeByCustomer(customerId),
      getCustomerCreditSummary(customerId),
      getReferralNetwork(customerId),
      getCreditLedger(customerId, 1, 10),
      getWithdrawalRequests(customerId),
      getReferralsByReferrer(customerId),
    ]);

  return {
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
}

export async function requestWithdrawal(
  _state: ReferralFormState,
  formData: FormData
): Promise<ReferralFormState> {
  const session = await verifySession();

  const parsed = WithdrawalRequestSchema.safeParse({
    amount: formData.get("amount"),
    method: formData.get("method"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { amount, method, notes } = parsed.data;

  const ledgerType = method === "donate" ? "donation" : "withdrawal";
  const description =
    method === "donate"
      ? "Donation"
      : method === "cash"
        ? "Cash withdrawal request"
        : "Store credit withdrawal";

  // Create withdrawal request first (to get reference_id)
  const request = await createWithdrawalRequest(
    session.customerId,
    amount,
    method,
    notes
  );

  if (!request) {
    return { message: "Failed to create withdrawal request. Please try again." };
  }

  // Atomic balance check + debit (prevents race conditions)
  const result = await atomicWithdraw(
    session.customerId,
    amount,
    ledgerType,
    request.id,
    description
  );

  if (!result.success) {
    return { message: result.error || "Insufficient balance for this withdrawal." };
  }

  revalidatePath("/account/referrals");
  return { success: true, message: "Withdrawal request submitted!" };
}
