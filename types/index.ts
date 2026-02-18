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
  depositAmount?: number;
  paidAmount: number;
  status: "payment-pending" | "pending-balance" | "confirmed";
  paymentProvider?: "paystack";
  paymentReference?: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
}

export interface StoreItem {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  price: number;
}
