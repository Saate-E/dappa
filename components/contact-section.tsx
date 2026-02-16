export function ContactSection() {
  return (
    <section className="section-wrap mt-14">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-surface p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Contact Us</p>
          <h2 className="mt-2 text-2xl font-semibold">Tell Us About Your Shoot</h2>
          <form className="mt-6 space-y-4">
            <input
              className="w-full rounded-md border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
              type="text"
              placeholder="Full Name"
            />
            <input
              className="w-full rounded-md border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
              type="email"
              placeholder="Email Address"
            />
            <textarea
              className="h-28 w-full rounded-md border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
              placeholder="Describe your project..."
            />
            <button
              type="button"
              className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-dark)]"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="card-surface p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Visit & Connect</p>
          <h3 className="mt-2 text-xl font-semibold">Studio Address</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            LumenStudio
            <br />
            28 Lens Avenue, Brooklyn, NY, 11201
            <br />
            United States
          </p>
          <h4 className="mt-6 font-semibold">Socials</h4>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            Instagram: @lumenstudio
            <br />
            TikTok: @lumenstudio
            <br />
            YouTube: LumenStudio Films
          </p>
        </div>
      </div>
    </section>
  );
}
