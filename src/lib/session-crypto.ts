import { SignJWT, jwtVerify } from "jose";
import type { SessionPayload } from "./auth-definitions";

// Fail closed: if SESSION_SECRET is missing or too short, refuse to run rather
// than silently signing every session JWT with the string "undefined" (a
// guessable key that would let anyone forge a session for any customerId).
const secretKey = process.env.SESSION_SECRET;
if (!secretKey || secretKey.length < 32) {
  throw new Error(
    "SESSION_SECRET is missing or too short (need >= 32 chars). Refusing to start with a weak session-signing key."
  );
}
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload, expiresAt: payload.expiresAt.toISOString() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined
): Promise<SessionPayload | null> {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return {
      customerId: payload.customerId as number,
      email: payload.email as string,
      firstName: payload.firstName as string,
      expiresAt: new Date(payload.expiresAt as string),
    };
  } catch {
    return null;
  }
}
