export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="section-wrap grid gap-6 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold">Dappa-SolomonStudio</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Crafted visual storytelling for weddings, portraits, brands, and
            events.
          </p>
        </div>
        <div>
          <p className="font-semibold">Address</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            28 Lens Avenue, Brooklyn, New York, USA
          </p>
        </div>
        <div>
          <p className="font-semibold">Socials</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Instagram: @dappasolomonstudio
            <br />
            Facebook: DappaSolomonStudio
            <br />
            Email: contact@dappasolomonstudio.com
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--line)] py-4 text-center text-xs text-[var(--muted)]">
        © {new Date().getFullYear()} Dappa-SolomonStudio. All rights reserved.
      </div>
    </footer>
  );
}
