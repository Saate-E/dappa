import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { readStore, saveStore } from "@/lib/data-store";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { applyTextWatermark } from "@/lib/watermark";

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
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "store");
  await mkdir(uploadsDir, { recursive: true });

  const extension = extensionFromFile(file);
  const base = sanitizeFileName(name) || "photo";
  const fileName = `${base}-${crypto.randomUUID()}.${extension}`;
  const absolutePath = path.join(uploadsDir, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());
  const watermarked = await applyTextWatermark(bytes, { text: "DappaSolomon Studio" });
  await writeFile(absolutePath, watermarked);

  return `/uploads/store/${fileName}`;
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const price = Number(formData.get("price") ?? 0);
    const file = formData.get("image");

    if (!name || !category || !description || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ message: "All store fields are required." }, { status: 400 });
    }

    const store = await readStore();
    const index = store.findIndex((item) => item.id === id);
    if (index === -1) {
      return NextResponse.json({ message: "Store item not found." }, { status: 404 });
    }

    const updatedImageUrl = file instanceof File ? await saveUploadedImage(file, name) : store[index].imageUrl;

    store[index] = {
      ...store[index],
      name,
      category,
      description,
      price,
      imageUrl: updatedImageUrl,
    };

    await saveStore(store);
    return NextResponse.json(store[index]);
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const store = await readStore();
  const exists = store.some((item) => item.id === id);
  if (!exists) {
    return NextResponse.json({ message: "Store item not found." }, { status: 404 });
  }

  const filtered = store.filter((item) => item.id !== id);
  await saveStore(filtered);
  return NextResponse.json({ message: "Store item deleted." });
}
