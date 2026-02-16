import { ContactSection } from "@/components/contact-section";
import { HeroSlider } from "@/components/hero-slider";
import { VideoSection } from "@/components/video-section";

const aboutSlides = [
  {
    title: "A Studio Built Around Story, Light, and Craft",
    body: "LumenStudio started as a two-person team and has grown into a creative production unit trusted for emotional and brand-driven photography.",
    imageUrl:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Client Collaboration Drives Our Direction",
    body: "We treat each shoot as a custom production with concept planning, mood references, precise composition, and polished post-production.",
    imageUrl:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Consistent Delivery For Personal and Commercial Work",
    body: "Whether your project is intimate or large scale, our process is designed for quality, timeline clarity, and visual consistency.",
    imageUrl:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function AboutUsPage() {
  return (
    <>
      <HeroSlider slides={aboutSlides} />
      <section className="section-wrap mt-14">
        <div className="card-surface p-7 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">About Us</p>
          <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Who We Are</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] md:text-base">
            We are a photography studio focused on intentional storytelling. Our team handles planning,
            lighting design, direction, and retouching in-house so every project keeps a coherent visual
            identity from first frame to final delivery.
          </p>
        </div>
      </section>
      <VideoSection title="Behind The Scenes: Our Team In Action" />
      <ContactSection />
    </>
  );
}
