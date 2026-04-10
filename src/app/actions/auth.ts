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

  // Verify credentials against WordPress
  const wpUser = await verifyWordPressCredentials(email, password);
  if (!wpUser) {
    return { message: "Invalid email or password" };
  }

  // Look up the WooCommerce customer by email
  const customer = await getCustomerByEmail(email);
  if (!customer) {
    return { message: "No account found for this email" };
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
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { firstName, lastName, email, password } = parsed.data;

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
