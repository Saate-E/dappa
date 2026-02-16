import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { readBookings, saveBookings } from "@/lib/data-store";
import { BookingRecord } from "@/types";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const payload = (await request.json()) as { status?: BookingRecord["status"] };
    if (!payload.status || !["pending-balance", "confirmed"].includes(payload.status)) {
      return NextResponse.json({ message: "Invalid booking status." }, { status: 400 });
    }

    const bookings = await readBookings();
    const index = bookings.findIndex((booking) => booking.id === id);
    if (index < 0) {
      return NextResponse.json({ message: "Booking not found." }, { status: 404 });
    }

    bookings[index] = {
      ...bookings[index],
      status: payload.status,
    };

    await saveBookings(bookings);
    return NextResponse.json(bookings[index]);
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }
}
