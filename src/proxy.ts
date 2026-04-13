import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, encrypt } from "@/lib/session-crypto";

const protectedRoutes = ["/account"];
const authRoutes = ["/login", "/register"];
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 1 day
const REFRESH_THRESHOLD_MS = 12 * 60 * 60 * 1000; // Refresh when < 12h left

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = protectedRoutes.some((r) => path.startsWith(r));
  const isAuthRoute = authRoutes.some((r) => path.startsWith(r));

  if (!isProtected && !isAuthRoute) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (isProtected && !session?.customerId) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (isAuthRoute && session?.customerId) {
    return NextResponse.redirect(new URL("/account", request.nextUrl));
  }

  const response = NextResponse.next();

  // Auto-refresh session if it's past the halfway point
  if (session?.customerId && session.expiresAt) {
    const timeLeft = new Date(session.expiresAt).getTime() - Date.now();
    if (timeLeft > 0 && timeLeft < REFRESH_THRESHOLD_MS) {
      const newExpiry = new Date(Date.now() + SESSION_DURATION_MS);
      const newToken = await encrypt({
        customerId: session.customerId,
        email: session.email,
        firstName: session.firstName,
        expiresAt: newExpiry,
      });
      response.cookies.set("session", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: newExpiry,
      });
    }
  }

  return response;
}

export const config = {
  matcher: ["/account/:path*", "/login", "/register"],
};
