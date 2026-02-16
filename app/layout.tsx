import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dappa Solomon Studio",
  description: "Photography studio website with booking and admin management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
