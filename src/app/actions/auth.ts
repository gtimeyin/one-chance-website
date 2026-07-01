"use server";

import { createSession, deleteSession } from "@/lib/session";
import {
  verifyWordPressCredentials,
  getCustomerByEmail,
  createCustomer,
} from "@/lib/woocommerce";
import {
  LoginFormSchema,
  RegisterFormSchema,
  type FormState,
} from "@/lib/auth-definitions";
import { redirect } from "next/navigation";
import {
  getReferralCodeByCode,
  createReferral,
  generateReferralCode,
} from "@/lib/referral";
import { getRandomAvatarId, setUserAvatar } from "@/lib/avatars";
import { rateLimit } from "@/lib/rate-limit";
import { cookies, headers } from "next/headers";

export async function login(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  // Rate limit two ways: per-email (targeted guessing) and per-IP (spray across
  // many accounts). On Vercel the first x-forwarded-for hop is the
  // platform-set client IP, so it's safe to key on. Both are checked before we
  // touch the backend.
  const rl = rateLimit(`login:${email.toLowerCase()}`, 5, 15 * 60 * 1000);
  if (!rl.allowed) {
    const minutes = Math.ceil(rl.retryAfterMs / 60000);
    return { message: `Too many login attempts. Try again in ${minutes} minute${minutes > 1 ? "s" : ""}.` };
  }
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipRl = rateLimit(`login-ip:${ip}`, 30, 15 * 60 * 1000);
  if (!ipRl.allowed) {
    const minutes = Math.ceil(ipRl.retryAfterMs / 60000);
    return { message: `Too many login attempts. Try again in ${minutes} minute${minutes > 1 ? "s" : ""}.` };
  }

  // Verify the password first; verifyWordPressCredentials returns the
  // *authenticated* account's canonical email. Look the customer up by that
  // (not the raw submitted string) and confirm they are the same account, so a
  // username/email collision can't bind the session to a different customer.
  const wpUser = await verifyWordPressCredentials(email, password);
  if (!wpUser) {
    // Generic message to prevent email enumeration
    return { message: "Invalid email or password" };
  }
  const customer = await getCustomerByEmail(wpUser.email);
  if (!customer || customer.email.trim().toLowerCase() !== wpUser.email) {
    return { message: "Invalid email or password" };
  }

  await createSession(customer.id, customer.email, customer.first_name);

  // Honour a same-origin relative redirect (e.g. ?redirect=/checkout). Reject
  // anything that isn't a simple in-app path to avoid open-redirect abuse.
  const rawRedirect = formData.get("redirectTo");
  const redirectTo =
    typeof rawRedirect === "string" && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : "/account";
  redirect(redirectTo);
}

export async function register(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = RegisterFormSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    referralCode: (formData.get("referralCode") as string)?.trim() || undefined,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { firstName, lastName, email, password, referralCode } = parsed.data;

  // Rate limit: 3 registration attempts per IP per 15 minutes
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`register:${ip}`, 3, 15 * 60 * 1000);
  if (!rl.allowed) {
    const minutes = Math.ceil(rl.retryAfterMs / 60000);
    return { message: `Too many attempts. Try again in ${minutes} minute${minutes > 1 ? "s" : ""}.` };
  }

  // Check if customer already exists
  const existing = await getCustomerByEmail(email);
  if (existing) {
    return { message: "An account with this email already exists" };
  }

  let referralApplied = false;
  try {
    const customer = await createCustomer({
      email,
      first_name: firstName,
      last_name: lastName,
      password,
    });

    // Process referral code if provided
    if (referralCode) {
      const code = await getReferralCodeByCode(referralCode);
      if (code && code.woo_customer_id !== customer.id) {
        await createReferral(code.woo_customer_id, customer.id, code.id);
        referralApplied = true;
      }
    }

    // Auto-generate a referral code for the new user
    await generateReferralCode(customer.id);

    // Assign a random character avatar
    await setUserAvatar(customer.id, getRandomAvatarId());

    // Clear referral cookie
    const cookieStore = await cookies();
    cookieStore.delete("oc_referral_code");

    await createSession(customer.id, customer.email, customer.first_name);
  } catch {
    return { message: "Failed to create account. Please try again." };
  }

  redirect(`/account?welcome=1${referralApplied ? "&ref=1" : ""}`);
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
