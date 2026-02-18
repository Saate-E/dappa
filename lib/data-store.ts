import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { BookingRecord, GalleryItem, StoreItem } from "@/types";

const dataDir = path.join(process.cwd(), "data");
const bookingsPath = path.join(dataDir, "bookings.json");
const galleryPath = path.join(dataDir, "gallery.json");
const storePath = path.join(dataDir, "store.json");

async function ensureDataDir() {
  await mkdir(dataDir, { recursive: true });
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const data = await readFile(filePath, "utf8");
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, payload: T): Promise<void> {
  await ensureDataDir();
  await writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
}

export async function readBookings(): Promise<BookingRecord[]> {
  return readJsonFile<BookingRecord[]>(bookingsPath, []);
}

export async function saveBookings(bookings: BookingRecord[]): Promise<void> {
  await writeJsonFile(bookingsPath, bookings);
}

export async function readGallery(): Promise<GalleryItem[]> {
  const fallback = await readJsonFile<GalleryItem[]>(galleryPath, []);
  return fallback;
}

export async function saveGallery(gallery: GalleryItem[]): Promise<void> {
  await writeJsonFile(galleryPath, gallery);
}

export async function readStore(): Promise<StoreItem[]> {
  return readJsonFile<StoreItem[]>(storePath, []);
}

export async function saveStore(store: StoreItem[]): Promise<void> {
  await writeJsonFile(storePath, store);
}
