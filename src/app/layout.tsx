import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BASE_URL, NAMA_DOMAIN } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "YesPajak — Alat Bantu Pajak untuk UMKM & Perusahaan Indonesia",
    template: "%s | YesPajak",
  },
  description:
    "Kalkulator PPh 21 (TER), PPh Final UMKM 0,5%, PPN, PPh Badan, kalender kewajiban pajak, dan edukasi pajak karyawan — gratis untuk UMKM dan perusahaan Indonesia.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "YesPajak",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <div className="hidden border-b border-slate-300 px-4 py-3 text-xs text-slate-500 print:block">
          <b>YesPajak</b> — {NAMA_DOMAIN} · Hasil estimasi untuk edukasi,
          bukan nasihat pajak profesional.
        </div>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
