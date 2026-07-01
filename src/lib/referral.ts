import "server-only";
import { randomBytes } from "crypto";
import { getSupabaseClient } from "./supabase";
import { createLogger } from "./logger";
import type {
  ReferralCode,
  Referral,
  ReferralTransaction,
  CreditLedgerEntry,
  WithdrawalRequest,
  CustomerCreditSummary,
  ReferralNetworkNode,
} from "./referral-definitions";
import { getCustomerById } from "./woocommerce";

const log = createLogger("referral");

const COMMISSION_PERCENT = parseFloat(
  process.env.REFERRAL_COMMISSION_PERCENT || "5"
);

const BUYER_DISCOUNT_PERCENT = parseFloat(
  process.env.REFERRAL_BUYER_DISCOUNT_PERCENT || "10"
);

export interface BuyerReferralDiscount {
  valid: boolean;
  discount: number;      // major-unit amount subtracted from subtotal
  percent: number;       // e.g. 10 for a 10% discount
  code: string;          // canonical (uppercased) code that was accepted
  referralCodeId?: string;
  message?: string;      // human-readable reason if !valid
}

/**
 * Validates a referral code at checkout and computes the buyer discount.
 *
 *  - Rejects self-referral (code owner === buyer's customer id)
 *  - Rejects codes that don't exist or aren't active
 *  - Rejects if the buyer has already received a referral discount on
 *    a prior order (first-purchase-only)
 *
 * Called from both the "apply" preview endpoint AND the create-session
 * endpoints, so the two agree on what discount is applied.
 */
export async function validateReferralCodeForCheckout(input: {
  code: string;
  buyerCustomerId: number | null;
  subtotal: number;
}): Promise<BuyerReferralDiscount> {
  const raw = input.code.trim().toUpperCase();
  const empty: BuyerReferralDiscount = {
    valid: false,
    discount: 0,
    percent: BUYER_DISCOUNT_PERCENT,
    code: raw,
  };

  if (!raw) return { ...empty, message: "Enter a referral code." };

  const supabase = getSupabaseClient();
  if (!supabase) return { ...empty, message: "Referrals are unavailable right now." };

  const refCode = await getReferralCodeByCode(raw);
  if (!refCode) return { ...empty, message: "That referral code doesn't exist." };
  if (!refCode.is_active) return { ...empty, message: "That referral code is no longer active." };

  if (input.buyerCustomerId && refCode.woo_customer_id === input.buyerCustomerId) {
    return { ...empty, message: "You can't refer yourself." };
  }

  // First-purchase-only enforcement. If we know the buyer, look for any
  // previous completed referral transaction; if we don't, we can't enforce
  // this at preview time — the order-complete pipeline will still catch
  // duplicates via referral_transactions.woo_order_id uniqueness.
  if (input.buyerCustomerId) {
    const referral = await getReferralByReferee(input.buyerCustomerId);
    if (referral) {
      const { data: prior } = await supabase
        .from("referral_transactions")
        .select("id, status")
        .eq("referral_id", referral.id)
        .not("status", "eq", "reversed")
        .limit(1);
      if (prior && prior.length > 0) {
        return {
          ...empty,
          message: "You've already used a referral code on a previous order.",
        };
      }
    }
  }

  const discount =
    Math.round(input.subtotal * (BUYER_DISCOUNT_PERCENT / 100) * 100) / 100;

  return {
    valid: true,
    discount,
    percent: BUYER_DISCOUNT_PERCENT,
    code: raw,
    referralCodeId: refCode.id,
  };
}

// ─── Referral Code Operations ────────────────────────────────────

function generateCodeString(): string {
  return "OC-" + randomBytes(4).toString("hex").toUpperCase();
}

export async function generateReferralCode(
  wooCustomerId: number
): Promise<ReferralCode | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  // Return existing code if one exists (idempotent)
  const { data: existing } = await supabase
    .from("referral_codes")
    .select("*")
    .eq("woo_customer_id", wooCustomerId)
    .single();

  if (existing) return existing as ReferralCode;

  const code = generateCodeString();
  const { data, error } = await supabase
    .from("referral_codes")
    .insert({ woo_customer_id: wooCustomerId, code })
    .select()
    .single();

  if (error) {
    log.error("Failed to generate referral code", error);
    return null;
  }

  return data as ReferralCode;
}

export async function getReferralCodeByCustomer(
  wooCustomerId: number
): Promise<ReferralCode | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("referral_codes")
    .select("*")
    .eq("woo_customer_id", wooCustomerId)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      log.error("Failed to fetch referral code by customer", error);
    }
    return null;
  }

  return data as ReferralCode;
}

export async function getReferralCodeByCode(
  code: string
): Promise<ReferralCode | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("referral_codes")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      log.error("Failed to fetch referral code", error);
    }
    return null;
  }

  return data as ReferralCode;
}

// ─── Referral Relationship Operations ────────────────────────────

export async function createReferral(
  referrerCustomerId: number,
  refereeCustomerId: number,
  codeId: string
): Promise<Referral | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("referrals")
    .insert({
      referrer_customer_id: referrerCustomerId,
      referee_customer_id: refereeCustomerId,
      referral_code_id: codeId,
    })
    .select()
    .single();

  if (error) {
    log.error("Failed to create referral", error);
    return null;
  }

  log.info("Referral created", {
    referrer: referrerCustomerId,
    referee: refereeCustomerId,
  });
  return data as Referral;
}

export async function getReferralByReferee(
  refereeCustomerId: number
): Promise<Referral | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("referrals")
    .select("*")
    .eq("referee_customer_id", refereeCustomerId)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      log.error("Failed to fetch referral by referee", error);
    }
    return null;
  }

  return data as Referral;
}

export async function getReferralsByReferrer(
  referrerCustomerId: number
): Promise<Referral[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("referrals")
    .select("*")
    .eq("referrer_customer_id", referrerCustomerId)
    .order("created_at", { ascending: false });

  if (error) {
    log.error("Failed to fetch referrals by referrer", error);
    return [];
  }

  return (data || []) as Referral[];
}

// ─── Transaction Operations ──────────────────────────────────────

export async function recordReferralTransaction(data: {
  referralId: string;
  wooOrderId: number;
  orderTotal: number;
  buyerDiscount: number;
  referrerCredit: number;
}): Promise<ReferralTransaction | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: tx, error } = await supabase
    .from("referral_transactions")
    .insert({
      referral_id: data.referralId,
      woo_order_id: data.wooOrderId,
      order_total: data.orderTotal,
      buyer_discount: data.buyerDiscount,
      referrer_credit: data.referrerCredit,
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    log.error("Failed to record referral transaction", error);
    return null;
  }

  return tx as ReferralTransaction;
}

export async function getTransactionsByReferral(
  referralId: string
): Promise<ReferralTransaction[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("referral_transactions")
    .select("*")
    .eq("referral_id", referralId)
    .order("created_at", { ascending: false });

  if (error) {
    log.error("Failed to fetch transactions", error);
    return [];
  }

  return (data || []) as ReferralTransaction[];
}

// ─── Credit Ledger Operations ────────────────────────────────────

export async function addCreditLedgerEntry(
  wooCustomerId: number,
  amount: number,
  type: CreditLedgerEntry["type"],
  referenceId?: string,
  description?: string
): Promise<CreditLedgerEntry | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  // Compute balance_after atomically in the DB (advisory lock) so concurrent
  // credits for the same customer can't write a stale balance_after.
  const { data, error } = await supabase.rpc("add_credits", {
    p_customer_id: wooCustomerId,
    p_amount: amount,
    p_type: type,
    p_reference_id: referenceId || null,
    p_description: description || null,
  });

  if (error) {
    log.error("Failed to add credit ledger entry", error);
    return null;
  }

  const row = Array.isArray(data) ? data[0] : data;
  return (row as CreditLedgerEntry) || null;
}

export async function getCreditLedger(
  wooCustomerId: number,
  page = 1,
  perPage = 20
): Promise<CreditLedgerEntry[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error } = await supabase
    .from("credit_ledger")
    .select("*")
    .eq("woo_customer_id", wooCustomerId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    log.error("Failed to fetch credit ledger", error);
    return [];
  }

  return (data || []) as CreditLedgerEntry[];
}

export async function getCustomerCreditSummary(
  wooCustomerId: number
): Promise<CustomerCreditSummary | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("customer_credit_summary")
    .select("*")
    .eq("woo_customer_id", wooCustomerId)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      log.error("Failed to fetch credit summary", error);
    }
    // Return zero summary for customers with no ledger entries
    return {
      woo_customer_id: wooCustomerId,
      total_earned: 0,
      total_withdrawn: 0,
      current_balance: 0,
      total_commissions: 0,
    };
  }

  return data as CustomerCreditSummary;
}

// ─── Atomic Withdrawal (race-condition safe) ─────────────────────

export async function atomicWithdraw(
  wooCustomerId: number,
  amount: number,
  type: string,
  referenceId: string,
  description: string
): Promise<{ success: boolean; balanceAfter?: number; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: "Service unavailable" };

  const { data, error } = await supabase.rpc("withdraw_credits", {
    p_customer_id: wooCustomerId,
    p_amount: amount,
    p_type: type,
    p_reference_id: referenceId,
    p_description: description,
  });

  if (error) {
    log.error("Atomic withdrawal failed", error);
    return { success: false, error: "Withdrawal failed" };
  }

  const row = data?.[0];
  if (!row?.success) {
    return { success: false, error: row?.error_message || "Insufficient balance" };
  }

  return { success: true, balanceAfter: row.balance_after };
}

// ─── Withdrawal Operations ───────────────────────────────────────

export async function createWithdrawalRequest(
  wooCustomerId: number,
  amount: number,
  method: WithdrawalRequest["method"],
  notes?: string
): Promise<WithdrawalRequest | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("withdrawal_requests")
    .insert({
      woo_customer_id: wooCustomerId,
      amount,
      method,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    log.error("Failed to create withdrawal request", error);
    return null;
  }

  return data as WithdrawalRequest;
}

// Compensating rollback: remove a withdrawal request whose debit failed, so a
// pending request is never left behind without a matching ledger debit.
export async function deleteWithdrawalRequest(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const { error } = await supabase
    .from("withdrawal_requests")
    .delete()
    .eq("id", id);

  if (error) {
    log.error("Failed to roll back withdrawal request", error);
  }
}

export async function getWithdrawalRequests(
  wooCustomerId: number
): Promise<WithdrawalRequest[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("withdrawal_requests")
    .select("*")
    .eq("woo_customer_id", wooCustomerId)
    .order("created_at", { ascending: false });

  if (error) {
    log.error("Failed to fetch withdrawal requests", error);
    return [];
  }

  return (data || []) as WithdrawalRequest[];
}

// ─── Referral Network ────────────────────────────────────────────

export async function getReferralNetwork(
  wooCustomerId: number
): Promise<ReferralNetworkNode[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const referrals = await getReferralsByReferrer(wooCustomerId);
  if (referrals.length === 0) return [];

  const nodes: ReferralNetworkNode[] = [];

  for (const ref of referrals) {
    const customer = await getCustomerById(ref.referee_customer_id);

    // Count transactions for this referral
    const txs = await getTransactionsByReferral(ref.id);
    const creditsEarned = txs.reduce((sum, tx) => sum + tx.referrer_credit, 0);

    nodes.push({
      referee_customer_id: ref.referee_customer_id,
      referee_name: customer
        ? `${customer.first_name} ${customer.last_name}`.trim() || customer.email
        : `User #${ref.referee_customer_id}`,
      joined_at: ref.created_at,
      orders_count: txs.length,
      credits_earned: creditsEarned,
    });
  }

  return nodes;
}

// ─── Order Processing (called from webhook) ──────────────────────

export async function processReferralForOrder(
  buyerCustomerId: number,
  orderId: number,
  orderTotal: number
): Promise<boolean> {
  const referral = await getReferralByReferee(buyerCustomerId);
  if (!referral) return false;

  // Check if this order has already been processed
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const { data: existingTx } = await supabase
    .from("referral_transactions")
    .select("id")
    .eq("woo_order_id", orderId)
    .single();

  if (existingTx) {
    log.warn("Order already processed for referral", { orderId });
    return false;
  }

  // Check if this is the buyer's first referral transaction (first-purchase-only discount)
  const { data: existingBuyerTxs } = await supabase
    .from("referral_transactions")
    .select("id")
    .eq("referral_id", referral.id)
    .limit(1);

  const isFirstPurchase = !existingBuyerTxs || existingBuyerTxs.length === 0;

  const referrerCredit = Math.round(orderTotal * (COMMISSION_PERCENT / 100) * 100) / 100;
  const buyerDiscount = 0; // Discount is applied at checkout, not here

  // Record the transaction
  const tx = await recordReferralTransaction({
    referralId: referral.id,
    wooOrderId: orderId,
    orderTotal,
    buyerDiscount,
    referrerCredit: isFirstPurchase ? referrerCredit : referrerCredit,
  });

  if (!tx) return false;

  // Credit the referrer
  await addCreditLedgerEntry(
    referral.referrer_customer_id,
    referrerCredit,
    "referral_commission",
    tx.id,
    `Commission from order #${orderId}`
  );

  log.info("Referral commission credited", {
    orderId,
    referrer: referral.referrer_customer_id,
    amount: referrerCredit,
  });

  return true;
}
