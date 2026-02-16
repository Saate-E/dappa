export type ServiceTier = "Wedding" | "Portrait" | "Commercial" | "Event" | "Lifestyle";

export interface ServiceOption {
  id: string;
  name: string;
  category: ServiceTier;
  price: number;
  description: string;
}

export interface BookingRecord {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  eventDate: string;
  notes: string;
  totalAmount: number;
  paidAmount: number;
  status: "pending-balance" | "confirmed";
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
}
