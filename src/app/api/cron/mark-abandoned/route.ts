import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { createLogger } from "@/lib/logger";

const log = createLogger("cron/mark-abandoned");

// Sessions older than this with non-terminal status get marked abandoned.
const ABANDON_AFTER_HOURS = 6;

export async function GET(request: Request) {
  // Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` when the env
  // var is set on the deployment. Reject anything else so randoms can't
  // hit this endpoint.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const sb = getSupabaseClient();
  if (!sb) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const cutoff = new Date(Date.now() - ABANDON_AFTER_HOURS * 60 * 60 * 1000).toISOString();
  const { data, error } = await sb
    .from("checkout_sessions")
    .update({ status: "abandoned" })
    .in("status", ["started", "payment_started"])
    .lt("created_at", cutoff)
    .select("id, email, status");

  if (error) {
    log.error("Failed to mark sessions abandoned", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  log.info("Marked abandoned", { count: data?.length ?? 0 });
  return NextResponse.json({
    ok: true,
    count: data?.length ?? 0,
    cutoff,
  });
}
