import { z } from "zod";

// ─── Database Row Types ──────────────────────────────────────────

export interface ReferralCode {
  id: string;
  woo_customer_id: number;
  code: string;
  is_active: boolean;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_customer_id: number;
  referee_customer_id: number;
  referral_code_id: string;
  created_at: string;
}

export interface ReferralTransaction {
  id: string;
  referral_id: string;
  woo_order_id: number;
  order_total: number;
  buyer_discount: number;
  referrer_credit: number;
  status: "pending" | "completed" | "reversed";
  created_at: string;
  completed_at: string | null;
}

export interface CreditLedgerEntry {
  id: string;
  woo_customer_id: number;
  amount: number;
  type: "referral_commission" | "withdrawal" | "adjustment" | "donation";
  reference_id: string | null;
  description: string | null;
  balance_after: number;
  created_at: string;
}

export interface WithdrawalRequest {
  id: string;
  woo_customer_id: number;
  amount: number;
  method: "store_credit" | "cash" | "donate";
  status: "pending" | "approved" | "completed" | "rejected";
  notes: string | null;
  created_at: string;
  processed_at: string | null;
}

export interface CustomerCreditSummary {
  woo_customer_id: number;
  total_earned: number;
  total_withdrawn: number;
  current_balance: number;
  total_commissions: number;
}

// ─── Composite Types ─────────────────────────────────────────────

export interface ReferralNetworkNode {
  referee_customer_id: number;
  referee_name: string;
  joined_at: string;
  orders_count: number;
  credits_earned: number;
}

export interface ReferralDashboardData {
  code: ReferralCode | null;
  stats: {
    totalReferrals: number;
    totalEarned: number;
    totalWithdrawn: number;
    currentBalance: number;
  };
  network: ReferralNetworkNode[];
  recentLedger: CreditLedgerEntry[];
  withdrawals: WithdrawalRequest[];
}

// ─── Zod Schemas ─────────────────────────────────────────────────

export const WithdrawalRequestSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .transform((v) => parseFloat(v))
    .refine((v) => !isNaN(v) && v > 0, "Amount must be greater than 0"),
  method: z.enum(["store_credit", "cash", "donate"], {
    error: "Please select a withdrawal method",
  }),
  notes: z.string().optional(),
});

export const ApplyReferralCodeSchema = z.object({
  referralCode: z
    .string()
    .min(1, "Referral code is required")
    .max(12, "Invalid referral code"),
});

export type ReferralFormState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};
