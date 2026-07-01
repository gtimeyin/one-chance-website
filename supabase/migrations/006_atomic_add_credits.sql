-- Atomic credit insert. Previously addCreditLedgerEntry() read the balance in
-- JS, added the amount, and inserted balance_after — so two concurrent credits
-- for the same customer could each read the same starting balance and write a
-- stale balance_after. Compute it inside the DB under an advisory lock instead.
-- (True balance is SUM(amount) and was always correct; this fixes the
-- denormalized balance_after column used for display/history.)

CREATE OR REPLACE FUNCTION add_credits(
  p_customer_id INTEGER,
  p_amount DECIMAL(10,2),
  p_type VARCHAR(20),
  p_reference_id UUID,
  p_description TEXT
) RETURNS SETOF credit_ledger AS $$
DECLARE
  v_balance DECIMAL(10,2);
BEGIN
  PERFORM pg_advisory_xact_lock(p_customer_id);

  SELECT COALESCE(SUM(amount), 0) + p_amount INTO v_balance
  FROM credit_ledger
  WHERE woo_customer_id = p_customer_id;

  RETURN QUERY
  INSERT INTO credit_ledger (woo_customer_id, amount, type, reference_id, description, balance_after)
  VALUES (p_customer_id, p_amount, p_type, p_reference_id, p_description, v_balance)
  RETURNING *;
END;
$$ LANGUAGE plpgsql;
