import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { readGallery, saveGallery } from "@/lib/data-store";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const payload = (await request.json()) as {
    name?: string;
    category?: string;
    description?: string;
    imageUrl?: string;
  };

  const gallery = await readGallery();
  const index = gallery.findIndex((item) => item.id === id);
  if (index < 0) {
    return NextResponse.json({ message: "Gallery item not found." }, { status: 404 });
  }

  gallery[index] = {
    ...gallery[index],
    ...payload,
  };
  await saveGallery(gallery);
  return NextResponse.json(gallery[index]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const gallery = await readGallery();
  const filtered = gallery.filter((item) => item.id !== id);
  await saveGallery(filtered);
  return NextResponse.json({ message: "Deleted" });
}
