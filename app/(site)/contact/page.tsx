import { ContactSection } from "@/components/contact-section";

export default function ContactPage() {
  return (
    <>
      <section className="section-wrap mt-10">
        <div className="card-surface p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Contact</p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Let&apos;s Plan Your Session</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Share your project goals, preferred date, and creative direction. We usually reply within 24 hours.
          </p>
        </div>
      </section>
      <ContactSection />
    </>
  );
}
