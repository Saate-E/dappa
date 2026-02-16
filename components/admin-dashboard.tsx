"use client";

import { BookingRecord, GalleryItem } from "@/types";
import { useEffect, useState } from "react";

type GalleryForm = {
  id?: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
};

const blankGallery: GalleryForm = {
  name: "",
  category: "",
  description: "",
  imageUrl: "",
};

export function AdminDashboard() {
  const [adminKey, setAdminKey] = useState("");
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [galleryForm, setGalleryForm] = useState<GalleryForm>(blankGallery);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadData() {
    if (!adminKey) {
      setStatus("Enter admin key first.");
      return;
    }
    setLoading(true);
    setStatus("");

    const [bookingRes, galleryRes] = await Promise.all([
      fetch("/api/bookings", { headers: { "x-admin-key": adminKey } }),
      fetch("/api/gallery"),
    ]);

    if (!bookingRes.ok) {
      setStatus("Unauthorized admin key.");
      setLoading(false);
      return;
    }

    const bookingPayload = (await bookingRes.json()) as BookingRecord[];
    const galleryPayload = (await galleryRes.json()) as GalleryItem[];
    setBookings(bookingPayload);
    setGallery(galleryPayload);
    setLoading(false);
  }

  useEffect(() => {
    void fetch("/api/gallery")
      .then((res) => res.json())
      .then((data: GalleryItem[]) => setGallery(data))
      .catch(() => null);
  }, []);

  async function submitGallery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!adminKey) {
      setStatus("Admin key required.");
      return;
    }

    const isUpdate = Boolean(galleryForm.id);
    const url = isUpdate ? `/api/gallery/${galleryForm.id}` : "/api/gallery";
    const method = isUpdate ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({
        name: galleryForm.name,
        category: galleryForm.category,
        description: galleryForm.description,
        imageUrl: galleryForm.imageUrl,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { message?: string };
      setStatus(payload.message ?? "Gallery action failed.");
      return;
    }

    setGalleryForm(blankGallery);
    setStatus(isUpdate ? "Gallery item updated." : "Gallery item added.");
    await loadData();
  }

  async function deleteGallery(id: string) {
    if (!adminKey) {
      setStatus("Admin key required.");
      return;
    }
    const response = await fetch(`/api/gallery/${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });
    if (!response.ok) {
      setStatus("Delete failed.");
      return;
    }
    await loadData();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[#21384c] bg-[#122739] p-6">
        <h1 className="text-2xl font-semibold text-white">
          Studio Admin Console
        </h1>
        <p className="mt-2 text-sm text-[#9fb6cb]">
          Manage bookings and gallery records from one place.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="password"
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            className="w-full rounded-md border border-[#355169] bg-[#0e1f2d] px-4 py-3 text-sm text-white outline-none ring-[#7cc0ff] focus:ring-2"
            placeholder="Enter admin key"
          />
          <button
            onClick={loadData}
            className="rounded-md bg-[#4ca4f5] px-4 py-3 text-sm font-semibold text-[#05213a] transition hover:bg-[#74b9fb]"
          >
            Load Data
          </button>
        </div>
        {status ? (
          <p className="mt-3 text-sm text-[#f7d6a1]">{status}</p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-[#21384c] bg-[#122739] p-6">
        <h2 className="text-xl font-semibold text-white">Bookings</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-[#d3e2ef]">
            <thead>
              <tr className="border-b border-[#2d465d] text-[#94b0c7]">
                <th className="py-2 pr-4">Client</th>
                <th className="py-2 pr-4">Service</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Paid</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-[#1d3448]">
                  <td className="py-2 pr-4">{booking.clientName}</td>
                  <td className="py-2 pr-4">{booking.serviceName}</td>
                  <td className="py-2 pr-4">{booking.eventDate}</td>
                  <td className="py-2 pr-4">
                    ${booking.paidAmount} / ${booking.totalAmount}
                  </td>
                  <td className="py-2 pr-4">{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && bookings.length === 0 ? (
            <p className="mt-3 text-sm text-[#9fb6cb]">
              No bookings loaded yet.
            </p>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-[#21384c] bg-[#122739] p-6">
        <h2 className="text-xl font-semibold text-white">Update Gallery</h2>
        <form
          className="mt-4 grid gap-3 md:grid-cols-2"
          onSubmit={submitGallery}
        >
          <input
            required
            value={galleryForm.name}
            onChange={(event) =>
              setGalleryForm({ ...galleryForm, name: event.target.value })
            }
            className="rounded-md border border-[#355169] bg-[#0e1f2d] px-4 py-3 text-sm text-white outline-none ring-[#7cc0ff] focus:ring-2"
            placeholder="Image name"
          />
          <input
            required
            value={galleryForm.category}
            onChange={(event) =>
              setGalleryForm({ ...galleryForm, category: event.target.value })
            }
            className="rounded-md border border-[#355169] bg-[#0e1f2d] px-4 py-3 text-sm text-white outline-none ring-[#7cc0ff] focus:ring-2"
            placeholder="Category"
          />
          <input
            required
            value={galleryForm.imageUrl}
            onChange={(event) =>
              setGalleryForm({ ...galleryForm, imageUrl: event.target.value })
            }
            className="md:col-span-2 rounded-md border border-[#355169] bg-[#0e1f2d] px-4 py-3 text-sm text-white outline-none ring-[#7cc0ff] focus:ring-2"
            placeholder="Image URL"
          />
          <textarea
            required
            value={galleryForm.description}
            onChange={(event) =>
              setGalleryForm({
                ...galleryForm,
                description: event.target.value,
              })
            }
            className="md:col-span-2 h-24 rounded-md border border-[#355169] bg-[#0e1f2d] px-4 py-3 text-sm text-white outline-none ring-[#7cc0ff] focus:ring-2"
            placeholder="Description"
          />
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              className="rounded-md bg-[#4ca4f5] px-4 py-2 text-sm font-semibold text-[#05213a] transition hover:bg-[#74b9fb]"
            >
              {galleryForm.id ? "Save Update" : "Add To Gallery"}
            </button>
            {galleryForm.id ? (
              <button
                type="button"
                onClick={() => setGalleryForm(blankGallery)}
                className="rounded-md border border-[#355169] px-4 py-2 text-sm text-[#bdd2e5]"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {gallery.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-[#2a4358] bg-[#102333] p-4"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-40 w-full rounded-md object-cover"
              />
              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[#8ab4d8]">
                {item.category}
              </p>
              <h3 className="mt-1 font-semibold text-white">{item.name}</h3>
              <p className="mt-1 text-sm text-[#b4cadf]">{item.description}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setGalleryForm(item)}
                  className="rounded-md border border-[#355169] px-3 py-1 text-xs text-[#d6e6f5]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteGallery(item.id)}
                  className="rounded-md border border-[#6c2f2f] px-3 py-1 text-xs text-[#ffb8b8]"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
