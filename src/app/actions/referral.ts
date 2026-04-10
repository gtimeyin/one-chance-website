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
  addCreditLedgerEntry,
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

  // Validate balance
  const summary = await getCustomerCreditSummary(session.customerId);
  const balance = summary?.current_balance ?? 0;

  if (amount > balance) {
    return { message: "Insufficient balance for this withdrawal." };
  }

  // Create withdrawal request
  const request = await createWithdrawalRequest(
    session.customerId,
    amount,
    method,
    notes
  );

  if (!request) {
    return { message: "Failed to create withdrawal request. Please try again." };
  }

  // Debit the ledger
  await addCreditLedgerEntry(
    session.customerId,
    -amount,
    method === "donate" ? "donation" : "withdrawal",
    request.id,
    method === "donate"
      ? "Donation"
      : method === "cash"
        ? "Cash withdrawal request"
        : "Store credit withdrawal"
  );

  revalidatePath("/account/referrals");
  return { success: true, message: "Withdrawal request submitted!" };
}
