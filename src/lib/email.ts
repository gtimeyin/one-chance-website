import "server-only";
import { createLogger } from "@/lib/logger";

const log = createLogger("email");

// Transactional email via Resend's HTTP API (https://resend.com). Set
// RESEND_API_KEY and EMAIL_FROM (e.g. "One Chance <no-reply@onechancegame.com>")
// in the environment. If unconfigured, sending is a no-op that returns false so
// callers can degrade gracefully rather than crash.
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    log.warn("Email not configured (RESEND_API_KEY / EMAIL_FROM) — skipping send");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: opts.to, subject: opts.subject, html: opts.html }),
    });

    if (!res.ok) {
      log.error("Email send failed", { status: res.status });
      return false;
    }
    return true;
  } catch (error) {
    log.error("Email send threw", error);
    return false;
  }
}
