import { NextRequest, NextResponse } from "next/server";
import { setAdminSessionCookie } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as { email?: string; password?: string };
    const email = payload.email?.trim().toLowerCase();
    const password = payload.password?.trim();
    const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@studio.local").toLowerCase();
    const adminKey = process.env.ADMIN_SECRET ?? "studio-admin-123";

    if (!email || !password || email !== adminEmail || password !== adminKey) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const response = NextResponse.json({ message: "Authenticated." });
    setAdminSessionCookie(response, email);
    return response;
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }
}
