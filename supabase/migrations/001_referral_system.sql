-- Referral System Schema
-- Stores referral codes, relationships, transactions, credits, and withdrawals

CREATE TABLE referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  woo_customer_id INTEGER NOT NULL UNIQUE,
  code VARCHAR(12) NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_referral_codes_code ON referral_codes (code);
CREATE INDEX idx_referral_codes_customer ON referral_codes (woo_customer_id);

CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_customer_id INTEGER NOT NULL,
  referee_customer_id INTEGER NOT NULL UNIQUE,
  referral_code_id UUID NOT NULL REFERENCES referral_codes(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_referrals_referrer ON referrals (referrer_customer_id);
CREATE INDEX idx_referrals_referee ON referrals (referee_customer_id);

CREATE TABLE referral_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID NOT NULL REFERENCES referrals(id),
  woo_order_id INTEGER NOT NULL UNIQUE,
  order_total DECIMAL(10,2) NOT NULL,
  buyer_discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  referrer_credit DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_ref_tx_referral ON referral_transactions (referral_id);
CREATE INDEX idx_ref_tx_order ON referral_transactions (woo_order_id);

CREATE TABLE credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  woo_customer_id INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(20) NOT NULL,
  reference_id UUID,
  description TEXT,
  balance_after DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_credit_ledger_customer ON credit_ledger (woo_customer_id);
CREATE INDEX idx_credit_ledger_created ON credit_ledger (woo_customer_id, created_at DESC);

CREATE TABLE withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  woo_customer_id INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(20) NOT NULL DEFAULT 'store_credit',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX idx_withdrawal_customer ON withdrawal_requests (woo_customer_id);

CREATE OR REPLACE VIEW customer_credit_summary AS
SELECT
  woo_customer_id,
  COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) AS total_earned,
  COALESCE(SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END), 0) AS total_withdrawn,
  COALESCE(SUM(amount), 0) AS current_balance,
  COUNT(CASE WHEN type = 'referral_commission' THEN 1 END) AS total_commissions
FROM credit_ledger
GROUP BY woo_customer_id;
