import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { createLogger } from "@/lib/logger";

const log = createLogger("email");

// Transactional email over SMTP. Reuses any mailbox/SMTP server you already
// run — set these in the environment:
//   SMTP_HOST   e.g. smtp.zoho.com / mail.yourhost.com
//   SMTP_PORT   465 (implicit TLS) or 587 (STARTTLS)
//   SMTP_USER   the mailbox login
//   SMTP_PASS   the mailbox / app password
//   EMAIL_FROM  e.g. "One Chance <no-reply@onechancegame.com>"
//   SMTP_SECURE optional "true"/"false"; defaults to true when port is 465
// If unconfigured, sending is a no-op that returns false so callers degrade
// gracefully rather than crash.
export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.EMAIL_FROM
  );
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!isEmailConfigured()) return null;
  if (transporter) return transporter;

  const port = parseInt(process.env.SMTP_PORT as string, 10);
  const secure =
    process.env.SMTP_SECURE != null ? process.env.SMTP_SECURE === "true" : port === 465;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  const tx = getTransporter();
  if (!tx) {
    log.warn("Email not configured (SMTP_* / EMAIL_FROM) — skipping send");
    return false;
  }

  try {
    await tx.sendMail({
      from: process.env.EMAIL_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
    return true;
  } catch (error) {
    log.error("Email send failed", error);
    return false;
  }
}
