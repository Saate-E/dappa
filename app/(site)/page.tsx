import { ContactSection } from "@/components/contact-section";
import { HeroSlider } from "@/components/hero-slider";
import { ServicesSection } from "@/components/services-section";
import { VideoSection } from "@/components/video-section";

const homeSlides = [
  {
    title: "Photography That Captures Real Emotion",
    body: "From wedding vows to bold studio portraits, we craft timeless images with intentional lighting, detail-rich editing, and cinematic mood.",
    imageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Built For Editorial, Family, and Brand Stories",
    body: "Every session is guided by a tailored concept, advanced color work, and direction that keeps your photos authentic and premium.",
    imageUrl:
      "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Studio + On-Location Coverage Across Categories",
    body: "Our team documents ceremonies, campaigns, and events with gear that performs in every light condition and delivery format.",
    imageUrl:
      "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSlider slides={homeSlides} cta={{ href: "/book-service", label: "Reserve Your Date" }} />
      <ServicesSection />
      <VideoSection title="A Short Look At Our Work Process" />
      <ContactSection />
    </>
  );
}
