import type { Metadata } from "next";
import DasarHukum from "@/components/DasarHukum";
import FAQ from "@/components/FAQ";
import KalkulatorPPh23 from "./KalkulatorPPh23";

export const metadata: Metadata = {
  title: "Kalkulator PPh 23 & Sewa Tanah/Bangunan",
  description:
    "Hitung pemotongan PPh Pasal 23 (bunga, royalti, hadiah 15%; sewa harta & jasa 2%) dan PPh final Pasal 4(2) sewa tanah/bangunan 10% — termasuk tarif 2× lipat untuk penerima tanpa NPWP.",
  alternates: { canonical: "/kalkulator/pph23" },
};

export default function Page() {
  return (
    <>
      <KalkulatorPPh23 />
      <FAQ
        items={[
          {
            q: "Kapan perusahaan wajib memotong PPh 23?",
            a: "Setiap kali membayar bunga, royalti, hadiah, sewa harta (selain tanah/bangunan), atau imbalan jasa teknik/manajemen/konsultan/jasa lain kepada wajib pajak dalam negeri. Pemotongan dilakukan saat pembayaran atau saat biaya diakui, mana yang lebih dulu.",
          },
          {
            q: "Berapa tarif PPh 23 untuk jasa?",
            a: "2% dari jumlah bruto imbalan jasa, tidak termasuk PPN. Jika penerima tidak memiliki NPWP, tarifnya menjadi 4% (100% lebih tinggi). Daftar jenis jasa lain diatur dalam PMK 141/PMK.03/2015.",
          },
          {
            q: "Mengapa sewa kantor tidak kena PPh 23?",
            a: "Sewa tanah dan/atau bangunan dikenai PPh final Pasal 4 ayat (2) sebesar 10% dari nilai bruto sewa, bukan PPh 23. Tarif ini bersifat final dan tidak naik untuk penerima tanpa NPWP.",
          },
        ]}
      />
      <DasarHukum
        peraturan={[
          "UU PPh Pasal 23 & Pasal 4 ayat (2)",
          "PMK 141/PMK.03/2015",
          "PP 34/2017 (sewa tanah/bangunan)",
        ]}
        diverifikasi="1 September 2026"
      />
    </>
  );
}
