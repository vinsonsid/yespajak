import type { Metadata } from "next";
import KalkulatorPPN from "./KalkulatorPPN";

export const metadata: Metadata = {
  title: "Kalkulator PPN 11% / 12%",
  description:
    "Hitung PPN sesuai PMK 131/2024: efektif 11% untuk barang/jasa umum (12% × DPP 11/12) dan 12% penuh untuk barang mewah. Mendukung harga termasuk atau belum termasuk PPN.",
};

export default function Page() {
  return <KalkulatorPPN />;
}
