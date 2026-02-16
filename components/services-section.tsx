import Link from "next/link";
import { services } from "@/lib/services";

export function ServicesSection() {
  return (
    <section className="section-wrap mt-14">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Our Services</p>
        <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Photography Categories We Cover</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {services.slice(0, 3).map((service) => (
          <article key={service.id} className="card-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{service.category}</p>
            <h3 className="mt-2 text-xl font-semibold">{service.name}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{service.description}</p>
            <p className="mt-4 text-sm font-semibold">${service.price.toLocaleString()}</p>
            <Link
              href={`/book-service?service=${service.id}`}
              className="mt-5 inline-flex rounded-md border border-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-dark)] transition hover:bg-[var(--accent)] hover:text-white"
            >
              Book Service
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
