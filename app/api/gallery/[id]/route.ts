import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { readGallery, saveGallery } from "@/lib/data-store";
import { mkdir, rm, writeFile } from "node:fs/promises";
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

async function removeLocalImage(imageUrl: string) {
  if (!imageUrl.startsWith("/uploads/gallery/")) return;
  const relativePath = imageUrl.replace(/^\/+/, "");
  const absolutePath = path.join(process.cwd(), "public", relativePath);
  await rm(absolutePath, { force: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const formData = await request.formData();

  const gallery = await readGallery();
  const index = gallery.findIndex((item) => item.id === id);
  if (index < 0) {
    return NextResponse.json({ message: "Gallery item not found." }, { status: 404 });
  }

  const current = gallery[index];
  const nameValue = formData.get("name");
  const categoryValue = formData.get("category");
  const descriptionValue = formData.get("description");
  const image = formData.get("image");

  const name = typeof nameValue === "string" ? nameValue.trim() : current.name;
  const category = typeof categoryValue === "string" ? categoryValue.trim() : current.category;
  const description =
    typeof descriptionValue === "string" ? descriptionValue.trim() : current.description;

  let imageUrl = current.imageUrl;
  if (image instanceof File && image.size > 0) {
    imageUrl = await saveUploadedImage(image, name);
    await removeLocalImage(current.imageUrl);
  }

  gallery[index] = {
    ...current,
    name,
    category,
    description,
    imageUrl,
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
  const target = gallery.find((item) => item.id === id);
  const filtered = gallery.filter((item) => item.id !== id);
  if (target) {
    await removeLocalImage(target.imageUrl);
  }
  await saveGallery(filtered);
  return NextResponse.json({ message: "Deleted" });
}
