"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_SESSION_KEY = "admin-passkey";

export default function AdminLoginPage() {
  const router = useRouter();
  const [passkey, setPasskey] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ passkey }),
    });

    if (!response.ok) {
      setStatus("Invalid passkey.");
      setLoading(false);
      return;
    }

    window.sessionStorage.setItem(ADMIN_SESSION_KEY, passkey);
    router.replace("/admin");
  }

  return (
    <section className="section-wrap mt-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-[#21384c] bg-[#122739] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8ab4d8]">
          Admin
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Login</h1>
        <p className="mt-2 text-sm text-[#9fb6cb]">
          Enter your passkey to access the admin console.
        </p>
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <input
            type="password"
            required
            value={passkey}
            onChange={(event) => setPasskey(event.target.value)}
            className="w-full rounded-md border border-[#355169] bg-[#0e1f2d] px-4 py-3 text-sm text-white outline-none ring-[#7cc0ff] focus:ring-2"
            placeholder="Enter passkey"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#4ca4f5] px-4 py-3 text-sm font-semibold text-[#05213a] transition hover:bg-[#74b9fb] disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        {status ? <p className="mt-3 text-sm text-[#f7d6a1]">{status}</p> : null}
      </div>
    </section>
  );
}
