import { NextResponse } from "next/server";
import type { NextRequest, NextResponse as NextResponseType } from "next/server";
import { decrypt, encrypt } from "@/lib/session-crypto";
import { COUNTRY_COOKIE, DEFAULT_COUNTRY } from "@/lib/currency";

const protectedRoutes = ["/account"];
const authRoutes = ["/login", "/register"];
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 1 day
const REFRESH_THRESHOLD_MS = 12 * 60 * 60 * 1000; // Refresh when < 12h left
const COUNTRY_COOKIE_MAX_AGE_S = 60 * 60 * 24 * 365; // 1 year

function detectCountry(request: NextRequest): string {
  const headerSources = [
    request.headers.get("x-vercel-ip-country"),
    request.headers.get("cf-ipcountry"),
    request.headers.get("x-country"),
  ];
  for (const raw of headerSources) {
    if (raw && raw.length === 2 && raw !== "XX") return raw.toUpperCase();
  }
  return DEFAULT_COUNTRY;
}

function ensureCountryCookie(request: NextRequest, response: ReturnType<typeof NextResponse.next>) {
  if (request.cookies.get(COUNTRY_COOKIE)?.value) return;
  response.cookies.set(COUNTRY_COOKIE, detectCountry(request), {
    httpOnly: false, // readable client-side so the future switcher can compare
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COUNTRY_COOKIE_MAX_AGE_S,
  });
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = protectedRoutes.some((r) => path.startsWith(r));
  const isAuthRoute = authRoutes.some((r) => path.startsWith(r));

  // Country detection runs on every matched request so the cookie is set on
  // first visit regardless of which page the user lands on.
  if (!isProtected && !isAuthRoute) {
    const response = NextResponse.next();
    ensureCountryCookie(request, response);
    return response;
  }

  const sessionCookie = request.cookies.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (isProtected && !session?.customerId) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (isAuthRoute && session?.customerId) {
    return NextResponse.redirect(new URL("/account", request.nextUrl));
  }

  const response: NextResponseType = NextResponse.next();
  ensureCountryCookie(request, response);

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
  // Run on every page (so country detection can fire on first visit anywhere),
  // but skip static assets, API routes, and Next internals.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|webp|gif|svg|ico|css|js|woff|woff2)).*)",
  ],
};
