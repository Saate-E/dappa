"use client";

import { BookingRecord, GalleryItem, StoreItem } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type GalleryForm = {
  id?: string;
  name: string;
  category: string;
  description: string;
};

type StoreForm = {
  id?: string;
  name: string;
  category: string;
  description: string;
  price: string;
};

const blankGallery: GalleryForm = {
  name: "",
  category: "",
  description: "",
};

const blankStore: StoreForm = {
  name: "",
  category: "",
  description: "",
  price: "",
};

export function AdminDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [galleryForm, setGalleryForm] = useState<GalleryForm>(blankGallery);
  const [galleryImage, setGalleryImage] = useState<File | null>(null);
  const [store, setStore] = useState<StoreItem[]>([]);
  const [storeForm, setStoreForm] = useState<StoreForm>(blankStore);
  const [storeImage, setStoreImage] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setStatus("");

    const [bookingRes, galleryRes, storeRes] = await Promise.all([
      fetch("/api/bookings", { credentials: "include" }),
      fetch("/api/gallery"),
      fetch("/api/store"),
    ]);

    if (!bookingRes.ok) {
      if (bookingRes.status === 401) {
        setStatus("Admin session expired. Please log in again.");
        router.replace("/admin");
        return;
      }
      setStatus("Unable to load admin data.");
      setLoading(false);
      return;
    }

    const bookingPayload = (await bookingRes.json()) as BookingRecord[];
    const galleryPayload = (await galleryRes.json()) as GalleryItem[];
    const storePayload = (await storeRes.json()) as StoreItem[];
    setBookings(bookingPayload);
    setGallery(galleryPayload);
    setStore(storePayload);
    setLoading(false);
  }, [router]);

  async function logout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    router.replace("/admin");
  }

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function submitGallery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isUpdate = Boolean(galleryForm.id);
    if (!isUpdate && !galleryImage) {
      setStatus("Please choose an image file.");
      return;
    }

    const url = isUpdate ? `/api/gallery/${galleryForm.id}` : "/api/gallery";
    const method = isUpdate ? "PATCH" : "POST";
    const formData = new FormData();
    formData.append("name", galleryForm.name);
    formData.append("category", galleryForm.category);
    formData.append("description", galleryForm.description);
    if (galleryImage) {
      formData.append("image", galleryImage);
    }

    const response = await fetch(url, {
      method,
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const payload = (await response.json()) as { message?: string };
      setStatus(payload.message ?? "Gallery action failed.");
      return;
    }

    setGalleryForm(blankGallery);
    setGalleryImage(null);
    setStatus(isUpdate ? "Gallery item updated." : "Gallery item added.");
    await loadData();
  }

  async function deleteGallery(id: string) {
    const response = await fetch(`/api/gallery/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      setStatus("Delete failed.");
      return;
    }
    setStatus("Picture deleted.");
    await loadData();
  }

  async function submitStore(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isUpdate = Boolean(storeForm.id);
    if (!isUpdate && !storeImage) {
      setStatus("Please choose an image file.");
      return;
    }

    const url = isUpdate ? `/api/store/${storeForm.id}` : "/api/store";
    const method = isUpdate ? "PATCH" : "POST";
    const formData = new FormData();
    formData.append("name", storeForm.name);
    formData.append("category", storeForm.category);
    formData.append("description", storeForm.description);
    formData.append("price", storeForm.price);
    if (storeImage) {
      formData.append("image", storeImage);
    }

    const response = await fetch(url, {
      method,
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const payload = (await response.json()) as { message?: string };
      setStatus(payload.message ?? "Store action failed.");
      return;
    }

    setStoreForm(blankStore);
    setStoreImage(null);
    setStatus(isUpdate ? "Store item updated." : "Store item added.");
    await loadData();
  }

  async function deleteStore(id: string) {
    const response = await fetch(`/api/store/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      setStatus("Delete failed.");
      return;
    }
    setStatus("Store item deleted.");
    await loadData();
  }

  async function confirmBooking(id: string) {
    const response = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status: "confirmed" }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { message?: string };
      setStatus(payload.message ?? "Confirm failed.");
      return;
    }

    setStatus("Order confirmed.");
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
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={loadData}
            className="rounded-md bg-[#4ca4f5] px-4 py-3 text-sm font-semibold text-[#05213a] transition hover:bg-[#74b9fb]"
          >
            Refresh Data
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-[#355169] px-4 py-3 text-sm font-semibold text-[#bdd2e5]"
          >
            Log Out
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
                <th className="py-2 pr-4">Action</th>
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
                  <td className="py-2 pr-4">
                    {booking.status !== "confirmed" ? (
                      <button
                        type="button"
                        onClick={() => confirmBooking(booking.id)}
                        className="rounded-md border border-[#355169] px-3 py-1 text-xs text-[#d6e6f5]"
                      >
                        Confirm Order
                      </button>
                    ) : (
                      <span className="text-xs text-[#88d39b]">Confirmed</span>
                    )}
                  </td>
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
            type="file"
            accept="image/*"
            required={!galleryForm.id}
            onChange={(event) => setGalleryImage(event.target.files?.[0] ?? null)}
            className="md:col-span-2 rounded-md border border-[#355169] bg-[#0e1f2d] px-4 py-3 text-sm text-white outline-none ring-[#7cc0ff] focus:ring-2"
          />
          <p className="md:col-span-2 text-xs text-[#9fb6cb]">
            {galleryForm.id
              ? "Choose a file only if you want to replace the current image."
              : "Choose the image from your device."}
          </p>
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
                onClick={() => {
                  setGalleryForm(blankGallery);
                  setGalleryImage(null);
                }}
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
                    onClick={() => {
                      setGalleryForm({
                        id: item.id,
                        name: item.name,
                        category: item.category,
                        description: item.description,
                      });
                      setGalleryImage(null);
                    }}
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

      <section className="rounded-2xl border border-[#21384c] bg-[#122739] p-6">
        <h2 className="text-xl font-semibold text-white">Update Store</h2>
        <form
          className="mt-4 grid gap-3 md:grid-cols-2"
          onSubmit={submitStore}
        >
          <input
            required
            value={storeForm.name}
            onChange={(event) =>
              setStoreForm({ ...storeForm, name: event.target.value })
            }
            className="rounded-md border border-[#355169] bg-[#0e1f2d] px-4 py-3 text-sm text-white outline-none ring-[#7cc0ff] focus:ring-2"
            placeholder="Image name"
          />
          <input
            required
            value={storeForm.category}
            onChange={(event) =>
              setStoreForm({ ...storeForm, category: event.target.value })
            }
            className="rounded-md border border-[#355169] bg-[#0e1f2d] px-4 py-3 text-sm text-white outline-none ring-[#7cc0ff] focus:ring-2"
            placeholder="Category"
          />
          <input
            required
            type="number"
            min={0}
            step="1"
            value={storeForm.price}
            onChange={(event) =>
              setStoreForm({ ...storeForm, price: event.target.value })
            }
            className="rounded-md border border-[#355169] bg-[#0e1f2d] px-4 py-3 text-sm text-white outline-none ring-[#7cc0ff] focus:ring-2"
            placeholder="Price (NGN)"
          />
          <input
            type="file"
            accept="image/*"
            required={!storeForm.id}
            onChange={(event) => setStoreImage(event.target.files?.[0] ?? null)}
            className="md:col-span-2 rounded-md border border-[#355169] bg-[#0e1f2d] px-4 py-3 text-sm text-white outline-none ring-[#7cc0ff] focus:ring-2"
          />
          <p className="md:col-span-2 text-xs text-[#9fb6cb]">
            {storeForm.id
              ? "Choose a file only if you want to replace the current image."
              : "Choose the image from your device."}
          </p>
          <textarea
            required
            value={storeForm.description}
            onChange={(event) =>
              setStoreForm({
                ...storeForm,
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
              {storeForm.id ? "Save Update" : "Add To Store"}
            </button>
            {storeForm.id ? (
              <button
                type="button"
                onClick={() => {
                  setStoreForm(blankStore);
                  setStoreImage(null);
                }}
                className="rounded-md border border-[#355169] px-4 py-2 text-sm text-[#bdd2e5]"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {store.map((item) => (
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
              <p className="mt-2 text-xs text-[#9fb6cb]">NGN {item.price}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStoreForm({
                      id: item.id,
                      name: item.name,
                      category: item.category,
                      description: item.description,
                      price: String(item.price),
                    });
                    setStoreImage(null);
                  }}
                  className="rounded-md border border-[#355169] px-3 py-1 text-xs text-[#d6e6f5]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteStore(item.id)}
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
