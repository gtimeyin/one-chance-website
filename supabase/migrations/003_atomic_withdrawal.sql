-- Atomic withdrawal function to prevent race conditions
-- Checks balance and debits in a single transaction

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
  -- Lock rows for this customer to prevent concurrent modifications
  SELECT COALESCE(SUM(amount), 0) INTO v_current_balance
  FROM credit_ledger
  WHERE woo_customer_id = p_customer_id
  FOR UPDATE;

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

-- Prevent negative balances as a safety net
ALTER TABLE credit_ledger ADD CONSTRAINT balance_non_negative CHECK (balance_after >= 0);
