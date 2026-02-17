import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "admin-session";

function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL ?? "admin@studio.local").trim().toLowerCase();
}

function getAdminSecret(): string {
  return process.env.ADMIN_SECRET ?? "studio-admin-123";
}

function buildSessionToken(email: string): string {
  return createHmac("sha256", getAdminSecret()).update(`admin:${email}`).digest("hex");
}

export function createAdminSession(email: string): string {
  return buildSessionToken(email.trim().toLowerCase());
}

export function setAdminSessionCookie(response: NextResponse, email: string) {
  const token = createAdminSession(email);
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function isAdminRequest(request: NextRequest): boolean {
  const providedToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!providedToken) return false;

  const expectedToken = buildSessionToken(getAdminEmail());
  const providedBuffer = Buffer.from(providedToken);
  const expectedBuffer = Buffer.from(expectedToken);
  if (providedBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(providedBuffer, expectedBuffer);
}
