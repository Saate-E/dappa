export function VideoSection({ title }: { title: string }) {
  return (
    <section className="section-wrap mt-14">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Featured Film</p>
        <h2 className="mt-2 text-2xl font-semibold md:text-3xl">{title}</h2>
      </div>
      <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-black shadow-sm">
        <video
          controls
          className="h-[260px] w-full object-cover md:h-[520px]"
          poster="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80"
        >
          <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
}
