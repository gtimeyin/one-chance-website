-- Password reset tokens. We store only a SHA-256 HASH of the token, never the
-- raw value, so a DB leak can't be used to reset anyone's password. The raw
-- token goes out only in the reset email link.

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  woo_customer_id INTEGER NOT NULL,
  email VARCHAR(254) NOT NULL,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reset_tokens_hash ON password_reset_tokens (token_hash);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_customer ON password_reset_tokens (woo_customer_id);
