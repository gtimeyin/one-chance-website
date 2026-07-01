import "server-only";
import { randomBytes, createHash } from "crypto";
import { getSupabaseClient } from "@/lib/supabase";
import { createLogger } from "@/lib/logger";

const log = createLogger("password-reset");

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

// Issue a reset token: returns the RAW token (for the email link) and stores
// only its hash. Returns null if storage is unavailable.
export async function createResetToken(
  wooCustomerId: number,
  email: string
): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const raw = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

  const { error } = await supabase.from("password_reset_tokens").insert({
    woo_customer_id: wooCustomerId,
    email: email.trim().toLowerCase(),
    token_hash: hashToken(raw),
    expires_at: expiresAt,
  });

  if (error) {
    log.error("Failed to create reset token", error);
    return null;
  }
  return raw;
}

// Validate and single-use-consume a raw token. Returns the customer it belongs
// to, or null if missing / expired / already used.
export async function consumeResetToken(
  raw: string
): Promise<{ wooCustomerId: number; email: string } | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("password_reset_tokens")
    .select("id, woo_customer_id, email, expires_at, used_at")
    .eq("token_hash", hashToken(raw))
    .single();

  if (error || !data) return null;
  if (data.used_at) return null;
  if (new Date(data.expires_at).getTime() < Date.now()) return null;

  // Mark used, guarding on used_at still being null so a token can't be
  // consumed twice by concurrent requests.
  const { data: updated, error: updateError } = await supabase
    .from("password_reset_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", data.id)
    .is("used_at", null)
    .select("id")
    .single();

  if (updateError || !updated) return null;

  return { wooCustomerId: data.woo_customer_id, email: data.email };
}
