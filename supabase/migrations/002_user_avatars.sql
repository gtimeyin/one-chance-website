CREATE TABLE user_avatars (
  woo_customer_id INTEGER PRIMARY KEY,
  avatar VARCHAR(30) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
