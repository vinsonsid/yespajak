import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "YesPajak — Alat Bantu Pajak untuk UMKM & Perusahaan Indonesia",
    template: "%s | YesPajak",
  },
  description:
    "Kalkulator PPh 21 (TER), PPh Final UMKM 0,5%, PPN, PPh Badan, kalender kewajiban pajak, dan edukasi pajak karyawan — gratis untuk UMKM dan perusahaan Indonesia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
