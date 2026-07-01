-- Gifting at checkout. Store the gift options and (when gifting to someone
-- else) a separate billing address on the checkout session. Both are JSONB and
-- nullable so existing/non-gift checkouts are unaffected.
--   gift_options:    { isGift, message?, from?, wrap?, giftReceipt? }
--   billing_address: CheckoutAddress (buyer) — set only when shipping to a
--                    different recipient; otherwise billing = shipping.

ALTER TABLE checkout_sessions ADD COLUMN IF NOT EXISTS gift_options JSONB;
ALTER TABLE checkout_sessions ADD COLUMN IF NOT EXISTS billing_address JSONB;
