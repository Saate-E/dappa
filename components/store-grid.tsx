import { StoreItem } from "@/types";

type StoreGridProps = {
  items: StoreItem[];
};

export function StoreGrid({ items }: StoreGridProps) {
  return (
    <section className="section-wrap mt-10">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Store</p>
        <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Watermarked Gallery Prints</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="card-surface overflow-hidden">
            <img src={item.imageUrl} alt={item.name} className="h-56 w-full object-cover" />
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">{item.category}</p>
              <h3 className="mt-1 text-lg font-semibold">{item.name}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--accent-dark)]">NGN {item.price}</span>
                <a
                  href={`/api/store/download/${item.id}`}
                  className="rounded-md bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--accent-dark)]"
                >
                  Download
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
