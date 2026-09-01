import type { Metadata } from "next";
import DasarHukum from "@/components/DasarHukum";
import FAQ from "@/components/FAQ";
import KalkulatorPPhBadan from "./KalkulatorPPhBadan";

export const metadata: Metadata = {
  title: "Kalkulator PPh Badan 22%",
  description:
    "Hitung PPh badan tarif 22% dengan fasilitas Pasal 31E (pengurangan tarif 50% untuk bagian laba dari omzet sampai Rp4,8 miliar, bagi badan beromzet sampai Rp50 miliar).",
  alternates: { canonical: "/kalkulator/pph-badan" },
};

export default function Page() {
  return (
    <>
      <KalkulatorPPhBadan />
      <FAQ
        items={[
          {
            q: "Berapa tarif PPh badan saat ini?",
            a: "22% dari Penghasilan Kena Pajak (laba fiskal). Perusahaan terbuka dengan minimal 40% saham diperdagangkan di bursa dapat memperoleh tarif 3% lebih rendah (19%) dengan syarat tertentu.",
          },
          {
            q: "Apa itu fasilitas Pasal 31E?",
            a: "Badan dengan peredaran bruto sampai Rp50 miliar mendapat pengurangan tarif 50% (menjadi 11%) atas bagian Penghasilan Kena Pajak dari bagian omzet sampai Rp4,8 miliar. Fasilitas ini otomatis, tanpa perlu permohonan.",
          },
          {
            q: "Apa bedanya laba akuntansi dan Penghasilan Kena Pajak?",
            a: "Penghasilan Kena Pajak adalah laba akuntansi setelah koreksi fiskal: biaya yang tidak boleh dikurangkan (misalnya sanksi pajak, natura tertentu) ditambahkan kembali, penghasilan final/bukan objek dikeluarkan, lalu dikurangi kompensasi kerugian fiskal hingga 5 tahun.",
          },
        ]}
      />
      <DasarHukum
        peraturan={["UU PPh Pasal 17 & 31E jo. UU HPP", "PP 55/2022"]}
        diverifikasi="1 September 2026"
      />
    </>
  );
}
