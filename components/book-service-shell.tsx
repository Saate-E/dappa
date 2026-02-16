"use client";

import { useSearchParams } from "next/navigation";
import { BookingForm } from "@/components/booking-form";
import { ServiceOption } from "@/types";

export function BookServiceShell({ serviceList }: { serviceList: ServiceOption[] }) {
  const searchParams = useSearchParams();
  const selectedService = searchParams.get("service") ?? undefined;
  return <BookingForm serviceList={serviceList} initialServiceId={selectedService} />;
}
