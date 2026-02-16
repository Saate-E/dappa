import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { readGallery, saveGallery } from "@/lib/data-store";
import { GalleryItem } from "@/types";

export const runtime = "nodejs";

export async function GET() {
  const gallery = await readGallery();
  return NextResponse.json(gallery);
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as Partial<GalleryItem>;
    if (!payload.name || !payload.category || !payload.description || !payload.imageUrl) {
      return NextResponse.json({ message: "All gallery fields are required." }, { status: 400 });
    }

    const gallery = await readGallery();
    const item: GalleryItem = {
      id: crypto.randomUUID(),
      name: payload.name,
      category: payload.category,
      description: payload.description,
      imageUrl: payload.imageUrl,
    };
    gallery.unshift(item);
    await saveGallery(gallery);
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }
}
