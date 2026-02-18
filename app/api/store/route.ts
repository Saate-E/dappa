import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { readStore, saveStore } from "@/lib/data-store";
import { StoreItem } from "@/types";
import { applyTextWatermark } from "@/lib/watermark";
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

export async function GET() {
  const store = await readStore();
  return NextResponse.json(store);
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
    const price = Number(formData.get("price") ?? 0);
    const file = formData.get("image");

    if (!name || !category || !description || !(file instanceof File) || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ message: "All store fields are required." }, { status: 400 });
    }

    const imageUrl = await saveUploadedImage(file, name);

    const store = await readStore();
    const item: StoreItem = {
      id: crypto.randomUUID(),
      name,
      category,
      description,
      imageUrl,
      price,
    };
    store.unshift(item);
    await saveStore(store);
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }
}
