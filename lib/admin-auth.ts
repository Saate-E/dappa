import { NextRequest } from "next/server";

export function isAdminRequest(request: NextRequest): boolean {
  const providedKey = request.headers.get("x-admin-key");
  const adminKey = process.env.ADMIN_SECRET ?? "studio-admin-123";
  return providedKey === adminKey;
}
