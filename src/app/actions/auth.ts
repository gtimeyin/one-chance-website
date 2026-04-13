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

  // Rate limit: 5 login attempts per email per 15 minutes
  const rl = rateLimit(`login:${email.toLowerCase()}`, 5, 15 * 60 * 1000);
  if (!rl.allowed) {
    const minutes = Math.ceil(rl.retryAfterMs / 60000);
    return { message: `Too many login attempts. Try again in ${minutes} minute${minutes > 1 ? "s" : ""}.` };
  }

  // Verify credentials against WordPress
  const wpUser = await verifyWordPressCredentials(email, password);
  if (!wpUser) {
    return { message: "Invalid email or password" };
  }

  // Look up the WooCommerce customer by email
  const customer = await getCustomerByEmail(email);
  if (!customer) {
    // Generic message to prevent email enumeration
    return { message: "Invalid email or password" };
  }

  await createSession(customer.id, customer.email, customer.first_name);
  redirect("/account");
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

  redirect("/account");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
