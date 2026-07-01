// Verify SMTP config and optionally send a test email.
//   npm run email:test                 -> verify connection + auth only
//   npm run email:test you@example.com  -> also send a test email there
// Reads SMTP_* / EMAIL_FROM from .env.local (via --env-file in the npm script).
import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM, SMTP_SECURE } = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
  console.error("Missing SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / EMAIL_FROM");
  process.exit(1);
}

const port = parseInt(SMTP_PORT, 10);
const secure = SMTP_SECURE != null ? SMTP_SECURE === "true" : port === 465;

const tx = nodemailer.createTransport({
  host: SMTP_HOST,
  port,
  secure,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

console.log(`Verifying ${SMTP_USER} @ ${SMTP_HOST}:${port} (secure=${secure})...`);
await tx.verify();
console.log("  ✓ connection + auth OK");

const to = process.argv[2];
if (to) {
  const info = await tx.sendMail({
    from: EMAIL_FROM,
    to,
    subject: "One Chance — SMTP test",
    html: "<p>This is a test email confirming password-reset delivery works.</p>",
  });
  console.log(`  ✓ test email sent to ${to} (messageId ${info.messageId})`);
} else {
  console.log("  (pass a recipient address to also send a test email)");
}
