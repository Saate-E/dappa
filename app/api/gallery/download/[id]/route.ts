import { NextResponse } from "next/server";
import { readGallery } from "@/lib/data-store";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

function sanitizeFileName(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extensionFromContentType(contentType: string | null): string {
  if (!contentType) return "jpg";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";
  if (contentType.includes("avif")) return "avif";
  return "jpg";
}

function contentTypeFromExtension(extension: string): string {
  const ext = extension.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  if (ext === "avif") return "image/avif";
  return "image/jpeg";
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const gallery = await readGallery();
  const item = gallery.find((entry) => entry.id === id);

  if (!item) {
    return NextResponse.json({ message: "Gallery item not found." }, { status: 404 });
  }

  try {
    if (item.imageUrl.startsWith("/")) {
      const relativePath = item.imageUrl.replace(/^\/+/, "");
      const absolutePath = path.join(process.cwd(), "public", relativePath);
      const buffer = await readFile(absolutePath);
      const extension = item.imageUrl.split(".").pop() ?? "jpg";
      const fileBaseName = sanitizeFileName(item.name) || "photo";
      const fileName = `${fileBaseName}.${extension}`;

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentTypeFromExtension(extension),
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      });
    }

    const imageResponse = await fetch(item.imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json({ message: "Unable to fetch source image." }, { status: 502 });
    }

    const contentType = imageResponse.headers.get("content-type") ?? "image/jpeg";
    const extension = extensionFromContentType(contentType);
    const fileBaseName = sanitizeFileName(item.name) || "photo";
    const fileName = `${fileBaseName}.${extension}`;
    const buffer = await imageResponse.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch {
    return NextResponse.json({ message: "Download failed." }, { status: 500 });
  }
}
