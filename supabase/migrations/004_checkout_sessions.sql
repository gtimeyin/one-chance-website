-- Checkout sessions
-- Tracks the lifecycle of a customer's checkout attempt so we can:
--  - Reconcile Stripe/Paystack payment intents to Woo orders
--  - Detect abandoned carts (rows with status='started' or 'payment_started' older than N hours)
--  - Audit the funnel (started -> payment_started -> completed)
--
-- Status transitions:
--   started         created when the user lands on /checkout and submits email/address
--   payment_started updated when the user submits the payment form
--   completed       set on payment success + Woo order creation
--   failed          set if payment or order creation fails terminally
--   abandoned       set by a periodic job for rows older than the abandon window

CREATE TABLE checkout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- The Woo customer id, if the buyer is logged in. NULL for guest checkout.
  customer_id INTEGER NULL,
  email TEXT NOT NULL,
  -- Cart + shipping snapshot at the time of checkout. Stored as JSONB so we
  -- can change the shape without a migration. Keep it self-contained: the
  -- Woo product price might change later and we still want the historical
  -- amount that was charged.
  cart JSONB NOT NULL,
  shipping_address JSONB NULL,
  shipping_method JSONB NULL,
  -- ISO 4217 (NGN, USD, EUR, GBP, KES…)
  currency VARCHAR(3) NOT NULL,
  -- Total in the major unit of `currency`. Stored as numeric for precision.
  -- (Stripe/Paystack take amounts in minor units; convert at the boundary.)
  amount NUMERIC(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'started'
    CHECK (status IN ('started', 'payment_started', 'completed', 'failed', 'abandoned')),
  -- Payment-provider identifiers. Provider is 'stripe' or 'paystack'.
  payment_provider TEXT NULL CHECK (payment_provider IN ('stripe', 'paystack')),
  payment_intent_id TEXT NULL,
  -- Set when the order is created in Woo (status -> completed).
  woo_order_id INTEGER NULL,
  woo_order_key TEXT NULL,
  -- Optional free-text reason when status='failed' or 'abandoned'.
  failure_reason TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_checkout_sessions_status_created ON checkout_sessions (status, created_at);
CREATE INDEX idx_checkout_sessions_customer ON checkout_sessions (customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX idx_checkout_sessions_email ON checkout_sessions (email);
CREATE INDEX idx_checkout_sessions_payment_intent ON checkout_sessions (payment_intent_id) WHERE payment_intent_id IS NOT NULL;
CREATE INDEX idx_checkout_sessions_woo_order ON checkout_sessions (woo_order_id) WHERE woo_order_id IS NOT NULL;

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_checkout_sessions_updated_at
  BEFORE UPDATE ON checkout_sessions
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
