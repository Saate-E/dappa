import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { readBookings, saveBookings } from "@/lib/data-store";
import { serviceMap } from "@/lib/services";
import { BookingRecord } from "@/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const bookings = await readBookings();
  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as {
      clientName?: string;
      email?: string;
      phone?: string;
      serviceId?: string;
      eventDate?: string;
      notes?: string;
      paidAmount?: number;
    };

    const service = payload.serviceId ? serviceMap.get(payload.serviceId) : undefined;
    if (!service) {
      return NextResponse.json({ message: "Please select a valid service." }, { status: 400 });
    }

    const paidAmount = Number(payload.paidAmount ?? 0);
    const minimumAmount = service.price / 2;
    if (paidAmount < minimumAmount) {
      return NextResponse.json(
        { message: `Half payment required. Minimum accepted is $${minimumAmount}.` },
        { status: 400 }
      );
    }

    if (!payload.clientName || !payload.email || !payload.phone || !payload.eventDate) {
      return NextResponse.json({ message: "Missing required booking fields." }, { status: 400 });
    }

    const bookings = await readBookings();
    const booking: BookingRecord = {
      id: crypto.randomUUID(),
      clientName: payload.clientName,
      email: payload.email,
      phone: payload.phone,
      serviceId: service.id,
      serviceName: service.name,
      eventDate: payload.eventDate,
      notes: payload.notes ?? "",
      totalAmount: service.price,
      paidAmount,
      status: paidAmount >= service.price ? "confirmed" : "pending-balance",
      createdAt: new Date().toISOString(),
    };

    bookings.unshift(booking);
    await saveBookings(bookings);

    return NextResponse.json({ message: "Booking validated.", id: booking.id }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }
}
