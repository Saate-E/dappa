import { StoreGrid } from "@/components/store-grid";
import { readStore } from "@/lib/data-store";

export default async function StorePage() {
  const storeItems = await readStore();

  return (
    <>
      <section className="section-wrap mt-10">
        <div className="card-surface overflow-hidden p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Store</p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">Studio Prints Store</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
            Browse watermarked previews, then pay to unlock a high-resolution download from the studio archive.
          </p>
        </div>
      </section>
      <StoreGrid items={storeItems} />
    </>
  );
}
