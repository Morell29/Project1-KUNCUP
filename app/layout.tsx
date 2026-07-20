import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import XPBar from "@/components/XPBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KUNCUP — Kesiapan Sekolah Anak",
  description:
    "Platform pendamping kesiapan sekolah anak usia 2–5 tahun melalui aktivitas interaktif berbasis teknologi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* XP Bar — tersedia di semua halaman */}
        <XPBar />
      </body>
    </html>
  );
}
