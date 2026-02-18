"use client";

import { ServiceOption } from "@/types";
import { useMemo, useState } from "react";

type BookingState = {
  clientName: string;
  email: string;
  phone: string;
  serviceId: string;
  eventDate: string;
  notes: string;
  paidAmount: string;
};

const initialState: BookingState = {
  clientName: "",
  email: "",
  phone: "",
  serviceId: "",
  eventDate: "",
  notes: "",
  paidAmount: "",
};

export function BookingForm({
  serviceList,
  initialServiceId,
}: {
  serviceList: ServiceOption[];
  initialServiceId?: string;
}) {
  const [form, setForm] = useState<BookingState>({
    ...initialState,
    serviceId: initialServiceId ?? "",
  });
  const [message, setMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const selectedService = useMemo(
    () => serviceList.find((service) => service.id === form.serviceId),
    [form.serviceId, serviceList],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: form.clientName,
        email: form.email,
        phone: form.phone,
        serviceId: form.serviceId,
        eventDate: form.eventDate,
        notes: form.notes,
        paidAmount: Number(form.paidAmount),
      }),
    });

    const payload = (await response.json()) as {
      message?: string;
      id?: string;
    };
    if (!response.ok) {
      setMessage(payload.message ?? "Booking could not be processed.");
      setSubmitting(false);
      return;
    }

    setMessage("Booking accepted. Your date is tentatively secured.");
    setForm({ ...initialState, serviceId: initialServiceId ?? "" });
    setSubmitting(false);
  }

  return (
    <section className="section-wrap mt-10">
      <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-sm">
        <div className="bg-gradient-to-r from-[#ecd1b3] via-[#f2e4d2] to-[#f9f6ef] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-dark)]">
            Book Service
          </p>
          <h1 className="mt-2 text-2xl font-semibold md:text-3xl">
            Reserve Your Photography Session
          </h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            A minimum 50% payment is required to validate your booking.
          </p>
        </div>

        <form className="space-y-4 p-6 md:p-8" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="clientName"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]"
              >
                Full Name
              </label>
              <input
                id="clientName"
                required
                value={form.clientName}
                onChange={(event) =>
                  setForm({ ...form, clientName: event.target.value })
                }
                className="w-full rounded-md border border-[var(--line)] px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
                placeholder="Full Name"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]"
              >
                Email Address
              </label>
              <input
                id="email"
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                className="w-full rounded-md border border-[var(--line)] px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
                placeholder="Email Address"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]"
              >
                Phone Number
              </label>
              <input
                id="phone"
                required
                value={form.phone}
                onChange={(event) =>
                  setForm({ ...form, phone: event.target.value })
                }
                className="w-full rounded-md border border-[var(--line)] px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
                placeholder="Phone Number"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="eventDate"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]"
              >
                Photo Session Date
              </label>
              <input
                id="eventDate"
                required
                type="date"
                value={form.eventDate}
                onChange={(event) =>
                  setForm({ ...form, eventDate: event.target.value })
                }
                className="w-full rounded-md border border-[var(--line)] px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="serviceId"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]"
              >
                Service
              </label>
              <select
                id="serviceId"
                required
                value={form.serviceId}
                onChange={(event) =>
                  setForm({ ...form, serviceId: event.target.value })
                }
                className="w-full rounded-md border border-[var(--line)] px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
              >
                <option value="">Select Service</option>
                {serviceList.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${service.price}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="paidAmount"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]"
              >
                Amount Paid
              </label>
              <input
                id="paidAmount"
                required
                type="number"
                min={0}
                step="0.01"
                value={form.paidAmount}
                onChange={(event) =>
                  setForm({ ...form, paidAmount: event.target.value })
                }
                className="w-full rounded-md border border-[var(--line)] px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
                placeholder="Amount Paid (USD)"
              />
            </div>
          </div>

          {selectedService ? (
            <p className="rounded-md bg-[#f9f0e6] px-3 py-2 text-sm text-[var(--accent-dark)]">
              Total: ${selectedService.price}. Minimum upfront payment: $
              {selectedService.price / 2}.
            </p>
          ) : null}

          <div className="space-y-2">
            <label
              htmlFor="notes"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]"
            >
              Notes
            </label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(event) =>
                setForm({ ...form, notes: event.target.value })
              }
              className="h-28 w-full rounded-md border border-[var(--line)] px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
              placeholder="Shoot notes, preferred location, style references..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-dark)] disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Validate Booking"}
          </button>
          {message ? (
            <p className="text-sm text-[var(--accent-dark)]">{message}</p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
