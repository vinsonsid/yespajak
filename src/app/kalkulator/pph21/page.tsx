import type { Metadata } from "next";
import DasarHukum from "@/components/DasarHukum";
import FAQ from "@/components/FAQ";
import KalkulatorPPh21 from "./KalkulatorPPh21";

export const metadata: Metadata = {
  title: "Kalkulator PPh 21 Karyawan (TER)",
  description:
    "Hitung potongan PPh Pasal 21 pegawai tetap dengan tarif efektif rata-rata (TER) PP 58/2023 dan perhitungan tahunan tarif progresif Pasal 17 — gratis dan akurat.",
  alternates: { canonical: "/kalkulator/pph21" },
};

export default function Page() {
  return (
    <>
      <KalkulatorPPh21 />
      <FAQ
        items={[
          {
            q: "Bagaimana cara menghitung PPh 21 dengan TER?",
            a: "Sejak Januari 2024, PPh 21 bulanan (Januari–November) dihitung dengan mengalikan tarif efektif rata-rata (TER) dengan penghasilan bruto sebulan. Tarif TER ditentukan kategori status PTKP: Kategori A (TK/0, TK/1, K/0), B (TK/2, TK/3, K/1, K/2), atau C (K/3).",
          },
          {
            q: "Mengapa potongan PPh 21 bulan Desember berbeda?",
            a: "Pada masa Desember, pemberi kerja menghitung ulang PPh 21 setahun penuh dengan tarif progresif Pasal 17 (5%–35%), lalu mengurangkan seluruh potongan Januari–November. Selisihnya dipotong atau dikembalikan bersama gaji Desember.",
          },
          {
            q: "Berapa gaji minimal yang kena PPh 21?",
            a: "Dengan TER, gaji bruto sampai Rp5,4 juta sebulan (kategori A) tidak dipotong pajak. Secara tahunan, penghasilan neto di bawah PTKP (mulai Rp54 juta setahun untuk TK/0) tidak dikenai PPh.",
          },
        ]}
      />
      <DasarHukum
        peraturan={["PP 58/2023 (TER)", "UU PPh Pasal 17 & 21", "PMK 168/2023"]}
        diverifikasi="1 September 2026"
      />
    </>
  );
}
