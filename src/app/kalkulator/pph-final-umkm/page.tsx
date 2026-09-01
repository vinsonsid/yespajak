import type { Metadata } from "next";
import DasarHukum from "@/components/DasarHukum";
import FAQ from "@/components/FAQ";
import KalkulatorUMKM from "./KalkulatorUMKM";

export const metadata: Metadata = {
  title: "Kalkulator PPh Final UMKM 0,5%",
  description:
    "Hitung PPh final UMKM 0,5% (PP 55/2022 jo. PP 20/2026) untuk orang pribadi, PT Perorangan, dan badan — termasuk pembebasan omzet Rp500 juta pertama bagi orang pribadi.",
  alternates: { canonical: "/kalkulator/pph-final-umkm" },
};

export default function Page() {
  return (
    <>
      <KalkulatorUMKM />
      <FAQ
        items={[
          {
            q: "Sampai kapan tarif PPh final UMKM 0,5% berlaku?",
            a: "Sejak PP 20/2026, wajib pajak orang pribadi dan PT Perorangan dapat memakai tarif final 0,5% tanpa batas waktu, selama omzet tidak melebihi Rp4,8 miliar setahun. Koperasi dibatasi maksimal 4 tahun sejak terdaftar.",
          },
          {
            q: "Benarkah omzet di bawah Rp500 juta bebas pajak?",
            a: "Benar, tetapi hanya untuk wajib pajak orang pribadi: bagian omzet sampai Rp500 juta dalam satu tahun pajak tidak dikenai PPh. PT Perorangan dan badan lain tidak mendapat pembebasan ini karena berstatus wajib pajak badan (SE-20/PJ/2022).",
          },
          {
            q: "Bagaimana cara menyetor PPh final 0,5%?",
            a: "Setiap bulan: hitung 0,5% dari omzet bulan berjalan, buat kode billing di Coretax, lalu setor paling lambat tanggal 15 bulan berikutnya. Setoran yang sudah divalidasi NTPN dianggap sudah lapor.",
          },
        ]}
      />
      <DasarHukum
        peraturan={[
          "PP 55/2022 jo. PP 20/2026",
          "SE-20/PJ/2022",
          "UU HPP Pasal 7 ayat (2a)",
        ]}
        diverifikasi="1 September 2026"
      />
    </>
  );
}
