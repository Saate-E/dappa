import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as { passkey?: string };
    const passkey = payload.passkey?.trim();
    const adminKey = process.env.ADMIN_SECRET ?? "studio-admin-123";

    if (!passkey || passkey !== adminKey) {
      return NextResponse.json({ message: "Invalid passkey." }, { status: 401 });
    }

    return NextResponse.json({ message: "Authenticated." });
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }
}
