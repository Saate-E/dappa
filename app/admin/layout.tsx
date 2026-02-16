import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#081825] text-white">
      <header className="border-b border-[#21384c] bg-[#0b2031]">
        <div className="mx-auto flex w-[min(1120px,92vw)] items-center justify-between py-4">
          <div>
            <p className="text-lg font-semibold">LumenStudio Admin</p>
            <p className="text-xs text-[#8ca9c1]">Entity management console</p>
          </div>
          <Link href="/" className="rounded-md border border-[#355169] px-3 py-2 text-sm text-[#d0e2f2]">
            Back To Website
          </Link>
        </div>
      </header>
      <main className="mx-auto w-[min(1120px,92vw)] py-8">{children}</main>
    </div>
  );
}
