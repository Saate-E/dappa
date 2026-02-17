"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";

export function AdminAuthGate() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const response = await fetch("/api/admin/session", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        router.replace("/admin");
        return;
      }
      setReady(true);
    }

    void checkSession();
  }, [router]);

  if (!ready) {
    return (
      <section className="section-wrap mt-10">
        <p className="text-sm text-[var(--muted)]">Checking admin session...</p>
      </section>
    );
  }

  return <AdminDashboard />;
}
