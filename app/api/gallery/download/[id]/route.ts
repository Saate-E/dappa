import { NextResponse } from "next/server";
import { readGallery } from "@/lib/data-store";

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

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const gallery = await readGallery();
  const item = gallery.find((entry) => entry.id === id);

  if (!item) {
    return NextResponse.json({ message: "Gallery item not found." }, { status: 404 });
  }

  try {
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
