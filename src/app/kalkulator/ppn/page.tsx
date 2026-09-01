import type { Metadata } from "next";
import DasarHukum from "@/components/DasarHukum";
import FAQ from "@/components/FAQ";
import KalkulatorPPN from "./KalkulatorPPN";

export const metadata: Metadata = {
  title: "Kalkulator PPN 11% / 12%",
  description:
    "Hitung PPN sesuai PMK 131/2024: efektif 11% untuk barang/jasa umum (12% × DPP 11/12) dan 12% penuh untuk barang mewah. Mendukung harga termasuk atau belum termasuk PPN.",
  alternates: { canonical: "/kalkulator/ppn" },
};

export default function Page() {
  return (
    <>
      <KalkulatorPPN />
      <FAQ
        items={[
          {
            q: "PPN sekarang 11% atau 12%?",
            a: "Tarif dalam undang-undang adalah 12% sejak 1 Januari 2025, tetapi untuk barang dan jasa umum PPN dihitung dari DPP nilai lain sebesar 11/12 dari harga jual, sehingga efektifnya tetap 11%. Tarif 12% penuh hanya untuk barang mewah objek PPnBM.",
          },
          {
            q: "Bagaimana cara menghitung PPN dari harga yang sudah termasuk pajak?",
            a: "Bagi harga total dengan 1,11 (barang umum) untuk mendapat harga sebelum PPN, lalu selisihnya adalah PPN. Contoh: harga Rp111.000 termasuk PPN berarti harga barang Rp100.000 dan PPN Rp11.000.",
          },
          {
            q: "Siapa yang wajib memungut PPN?",
            a: "Pengusaha yang sudah dikukuhkan sebagai PKP (Pengusaha Kena Pajak). Pengukuhan wajib jika omzet melebihi Rp4,8 miliar setahun; di bawah itu boleh memilih menjadi PKP secara sukarela.",
          },
        ]}
      />
      <DasarHukum
        peraturan={["UU PPN jo. UU HPP", "PMK 131/2024"]}
        diverifikasi="1 September 2026"
      />
    </>
  );
}
