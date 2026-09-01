import type { Metadata } from "next";
import DasarHukum from "@/components/DasarHukum";
import FAQ from "@/components/FAQ";
import PayrollPPh21 from "./PayrollPPh21";

export const metadata: Metadata = {
  title: "Payroll PPh 21 Massal — Hitung Semua Karyawan Sekaligus",
  description:
    "Tempel data karyawan dari Excel dan hitung potongan PPh 21 bulanan (TER PP 58/2023) seluruh tim sekaligus, lengkap dengan total dan ekspor CSV. Gratis, data tidak meninggalkan browser Anda.",
  alternates: { canonical: "/payroll-pph21" },
};

export default function Page() {
  return (
    <>
      <PayrollPPh21 />
      <FAQ
        items={[
          {
            q: "Apakah data karyawan saya aman?",
            a: "Ya. Seluruh perhitungan dilakukan di browser Anda (client-side). Data yang Anda tempel tidak pernah dikirim ke server YesPajak maupun pihak lain.",
          },
          {
            q: "Format data seperti apa yang didukung?",
            a: "Satu karyawan per baris dengan tiga kolom: nama, status PTKP (TK/0 sampai K/3), dan gaji bruto sebulan. Salin langsung dari Excel/Google Sheets (terpisah tab), atau ketik manual dengan pemisah titik koma atau koma.",
          },
          {
            q: "Mengapa hasil bulan Desember berbeda?",
            a: "TER hanya dipakai untuk masa Januari–November. Pada masa Desember perusahaan wajib menghitung ulang PPh 21 setahun penuh dengan tarif Pasal 17, dikurangi seluruh potongan Januari–November, sehingga potongan Desember hampir selalu berbeda.",
          },
        ]}
      />
      <DasarHukum
        peraturan={["PP 58/2023 (TER)", "UU PPh Pasal 21", "PMK 168/2023"]}
        diverifikasi="1 September 2026"
      />
    </>
  );
}
