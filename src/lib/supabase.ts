import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "./logger";

const log = createLogger("supabase");

const hasSupabaseCredentials = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && key && url !== "" && key !== "");
};

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!hasSupabaseCredentials()) {
    log.warn("Supabase credentials not configured");
    return null;
  }

  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false },
      }
    );
  }

  return client;
}

export function isSupabaseConfigured(): boolean {
  return hasSupabaseCredentials();
}
