import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { decrypt } from "./session-crypto";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.customerId) {
    redirect("/login");
  }

  return {
    isAuth: true as const,
    customerId: session.customerId,
    email: session.email,
    firstName: session.firstName,
  };
});

export const getOptionalSession = cache(async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.customerId) {
    return null;
  }

  return {
    customerId: session.customerId,
    email: session.email,
    firstName: session.firstName,
  };
});
