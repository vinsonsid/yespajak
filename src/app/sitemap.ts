import type { MetadataRoute } from "next";
import { BASE_URL as BASE } from "@/lib/site";

export const dynamic = "force-static";

const RUTE: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/kalkulator/pph21", priority: 0.9 },
  { path: "/kalkulator/pph-final-umkm", priority: 0.9 },
  { path: "/kalkulator/ppn", priority: 0.9 },
  { path: "/kalkulator/pph-badan", priority: 0.8 },
  { path: "/kalkulator/pph23", priority: 0.8 },
  { path: "/kalkulator/umkm-vs-tarif-umum", priority: 0.8 },
  { path: "/payroll-pph21", priority: 0.8 },
  { path: "/kalender-pajak", priority: 0.7 },
  { path: "/edukasi", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return RUTE.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
