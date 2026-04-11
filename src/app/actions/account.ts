"use server";

import { verifySession } from "@/lib/dal";
import { updateCustomer } from "@/lib/woocommerce";
import {
  ProfileUpdateSchema,
  AddressSchema,
  type FormState,
} from "@/lib/auth-definitions";
import { revalidatePath } from "next/cache";
import { setUserAvatar, CHARACTER_AVATARS } from "@/lib/avatars";
import type { AvatarId } from "@/lib/avatar-options";

export async function updateProfile(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await verifySession();

  const parsed = ProfileUpdateSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await updateCustomer(session.customerId, {
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      email: parsed.data.email,
    });
    revalidatePath("/account");
    return { success: true, message: "Profile updated successfully" };
  } catch {
    return { message: "Failed to update profile. Please try again." };
  }
}

export async function updateBillingAddress(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await verifySession();

  const parsed = AddressSchema.safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    address_1: formData.get("address_1"),
    address_2: formData.get("address_2"),
    city: formData.get("city"),
    state: formData.get("state"),
    postcode: formData.get("postcode"),
    country: formData.get("country"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await updateCustomer(session.customerId, { billing: parsed.data });
    revalidatePath("/account/addresses");
    return { success: true, message: "Billing address updated" };
  } catch {
    return { message: "Failed to update billing address." };
  }
}

export async function updateShippingAddress(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await verifySession();

  const parsed = AddressSchema.safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    address_1: formData.get("address_1"),
    address_2: formData.get("address_2"),
    city: formData.get("city"),
    state: formData.get("state"),
    postcode: formData.get("postcode"),
    country: formData.get("country"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await updateCustomer(session.customerId, { shipping: parsed.data });
    revalidatePath("/account/addresses");
    return { success: true, message: "Shipping address updated" };
  } catch {
    return { message: "Failed to update shipping address." };
  }
}

export async function updateAvatar(avatarId: string): Promise<FormState> {
  const session = await verifySession();

  const valid = CHARACTER_AVATARS.some((a) => a.id === avatarId);
  if (!valid) {
    return { message: "Invalid avatar selection." };
  }

  const success = await setUserAvatar(session.customerId, avatarId as AvatarId);
  if (!success) {
    return { message: "Failed to update avatar." };
  }

  revalidatePath("/account");
  return { success: true, message: "Avatar updated!" };
}
