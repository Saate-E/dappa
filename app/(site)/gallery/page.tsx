import { GalleryGrid } from "@/components/gallery-grid";

export default function GalleryPage() {
  return (
    <>
      <section className="section-wrap mt-10">
        <div className="card-surface overflow-hidden p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Portfolio</p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">Gallery Collection</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
            Browse a wide mix of weddings, portraits, fashion, commercial products, and lifestyle stories.
            Each image includes category details and direct download access.
          </p>
        </div>
      </section>
      <GalleryGrid />
    </>
  );
}
