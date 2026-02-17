import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { readGallery, saveGallery } from "@/lib/data-store";
import { GalleryItem } from "@/types";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

function sanitizeFileName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extensionFromFile(file: File): string {
  const byType = file.type.toLowerCase();
  if (byType.includes("png")) return "png";
  if (byType.includes("webp")) return "webp";
  if (byType.includes("gif")) return "gif";
  if (byType.includes("avif")) return "avif";
  if (byType.includes("jpeg") || byType.includes("jpg")) return "jpg";

  const original = file.name.toLowerCase();
  const ext = original.split(".").pop();
  if (ext && ["png", "webp", "gif", "avif", "jpg", "jpeg"].includes(ext)) {
    return ext === "jpeg" ? "jpg" : ext;
  }
  return "jpg";
}

async function saveUploadedImage(file: File, name: string): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "gallery");
  await mkdir(uploadsDir, { recursive: true });

  const extension = extensionFromFile(file);
  const base = sanitizeFileName(name) || "photo";
  const fileName = `${base}-${crypto.randomUUID()}.${extension}`;
  const absolutePath = path.join(uploadsDir, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, bytes);

  return `/uploads/gallery/${fileName}`;
}

export async function GET() {
  const gallery = await readGallery();
  return NextResponse.json(gallery);
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const file = formData.get("image");

    if (!name || !category || !description || !(file instanceof File)) {
      return NextResponse.json({ message: "All gallery fields are required." }, { status: 400 });
    }

    const imageUrl = await saveUploadedImage(file, name);

    const gallery = await readGallery();
    const item: GalleryItem = {
      id: crypto.randomUUID(),
      name,
      category,
      description,
      imageUrl,
    };
    gallery.unshift(item);
    await saveGallery(gallery);
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }
}
