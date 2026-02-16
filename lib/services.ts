import { ServiceOption } from "@/types";

export const services: ServiceOption[] = [
  {
    id: "wedding-signature",
    name: "Signature Wedding Story",
    category: "Wedding",
    price: 1800,
    description: "Full-day wedding coverage with cinematic highlights and premium edits.",
  },
  {
    id: "portrait-editorial",
    name: "Editorial Portrait Session",
    category: "Portrait",
    price: 650,
    description: "Studio portrait shoot with styling support and color-graded retouches.",
  },
  {
    id: "brand-commercial",
    name: "Brand Commercial Pack",
    category: "Commercial",
    price: 1200,
    description: "Commercial-grade product and brand storytelling for campaigns.",
  },
  {
    id: "event-documentary",
    name: "Event Documentary Coverage",
    category: "Event",
    price: 900,
    description: "Multi-hour event storytelling with rapid delivery social snippets.",
  },
  {
    id: "lifestyle-capsule",
    name: "Lifestyle Capsule",
    category: "Lifestyle",
    price: 500,
    description: "Natural light lifestyle session tailored for personal milestones.",
  },
];

export const serviceMap = new Map(services.map((service) => [service.id, service]));
