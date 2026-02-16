import { BookServiceShell } from "@/components/book-service-shell";
import { services } from "@/lib/services";
import { Suspense } from "react";

export default function BookServicePage() {
  return (
    <>
      <section className="section-wrap mt-10">
        <div className="card-surface p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Booking</p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Book Photography Service</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)] md:text-base">
            Select your preferred service and lock in your date with a validated half payment.
            Our team confirms every request after reviewing event details and availability.
          </p>
        </div>
      </section>
      <Suspense fallback={<section className="section-wrap mt-10 text-sm text-[var(--muted)]">Loading booking form...</section>}>
        <BookServiceShell serviceList={services} />
      </Suspense>
    </>
  );
}
