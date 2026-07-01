-- Fix: the original withdraw_credits() used `SELECT SUM(amount) ... FOR UPDATE`,
-- which Postgres rejects ("FOR UPDATE is not allowed with aggregate functions"),
-- so every withdrawal debit errored out. Serialise concurrent withdrawals for a
-- customer with an advisory lock instead, then aggregate the balance separately.
-- Also add an explicit positive-amount guard as defence-in-depth.

CREATE OR REPLACE FUNCTION withdraw_credits(
  p_customer_id INTEGER,
  p_amount DECIMAL(10,2),
  p_type VARCHAR(20),
  p_reference_id UUID,
  p_description TEXT
) RETURNS TABLE(success BOOLEAN, balance_after DECIMAL(10,2), error_message TEXT) AS $$
DECLARE
  v_current_balance DECIMAL(10,2);
  v_new_balance DECIMAL(10,2);
BEGIN
  -- Serialise concurrent withdrawals for this customer (held to end of txn).
  PERFORM pg_advisory_xact_lock(p_customer_id);

  IF p_amount IS NULL OR p_amount <= 0 THEN
    RETURN QUERY SELECT false, 0::DECIMAL(10,2), 'Amount must be greater than 0'::TEXT;
    RETURN;
  END IF;

  SELECT COALESCE(SUM(amount), 0) INTO v_current_balance
  FROM credit_ledger
  WHERE woo_customer_id = p_customer_id;

  IF p_amount > v_current_balance THEN
    RETURN QUERY SELECT false, v_current_balance, 'Insufficient balance'::TEXT;
    RETURN;
  END IF;

  v_new_balance := v_current_balance - p_amount;

  INSERT INTO credit_ledger (woo_customer_id, amount, type, reference_id, description, balance_after)
  VALUES (p_customer_id, -p_amount, p_type, p_reference_id, p_description, v_new_balance);

  RETURN QUERY SELECT true, v_new_balance, NULL::TEXT;
END;
$$ LANGUAGE plpgsql;
