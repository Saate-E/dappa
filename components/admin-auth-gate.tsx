"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";

const ADMIN_SESSION_KEY = "admin-passkey";

export function AdminAuthGate() {
  const router = useRouter();
  const [adminKey, setAdminKey] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = window.sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!storedKey) {
      router.replace("/admin/login");
      return;
    }
    setAdminKey(storedKey);
  }, [router]);

  if (!adminKey) {
    return (
      <section className="section-wrap mt-10">
        <p className="text-sm text-[var(--muted)]">Checking admin session...</p>
      </section>
    );
  }

  return <AdminDashboard adminKey={adminKey} />;
}
