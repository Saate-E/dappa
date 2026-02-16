"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(255,251,244,0.92)] backdrop-blur-md">
      <div className="section-wrap flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Dappa-Solomon<span className="text-[var(--accent)]">Studio</span>
        </Link>

        <button
          className="rounded-md border border-[var(--line)] px-3 py-2 text-sm md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          Menu
        </button>

        <nav
          className={`${
            open ? "flex" : "hidden"
          } absolute left-0 top-[72px] w-full flex-col gap-1 border-b border-[var(--line)] bg-[var(--surface)] p-4 md:static md:flex md:w-auto md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--line)] hover:text-[var(--text)]"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/book-service"
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-dark)]"
            onClick={() => setOpen(false)}
          >
            Book Service
          </Link>
        </nav>
      </div>
    </header>
  );
}
