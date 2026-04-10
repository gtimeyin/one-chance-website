import "server-only";
import { cookies } from "next/headers";
import { encrypt, decrypt } from "./session-crypto";
import type { SessionPayload } from "./auth-definitions";

export { decrypt } from "./session-crypto";

const COOKIE_NAME = "session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createSession(
  customerId: number,
  email: string,
  firstName: string
): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const session = await encrypt({ customerId, email, firstName, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function updateSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
  const payload = await decrypt(sessionCookie);

  if (!payload) return;

  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const session = await encrypt({ ...payload, expiresAt });

  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
