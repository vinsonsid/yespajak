import type { Metadata } from "next";
import DasarHukum from "@/components/DasarHukum";
import FAQ from "@/components/FAQ";
import KalkulatorBanding from "./KalkulatorBanding";

export const metadata: Metadata = {
  title: "UMKM 0,5% vs Tarif Umum — Mana Lebih Hemat?",
  description:
    "Bandingkan PPh Final UMKM 0,5% dengan tarif umum (Pasal 17 atau PPh badan 22% + fasilitas 31E) berdasarkan omzet dan margin laba usaha Anda, lengkap dengan margin impas.",
  alternates: { canonical: "/kalkulator/umkm-vs-tarif-umum" },
};

export default function Page() {
  return (
    <>
      <KalkulatorBanding />
      <FAQ
        items={[
          {
            q: "Kapan tarif umum lebih hemat daripada PPh final 0,5%?",
            a: "Saat margin laba bersih usaha rendah. PPh final dihitung dari omzet tanpa peduli untung-rugi, sedangkan tarif umum dihitung dari laba. Usaha bermargin tipis (misalnya perdagangan grosir) atau yang sedang rugi biasanya lebih hemat memakai tarif umum.",
          },
          {
            q: "Bolehkah pindah dari skema 0,5% ke tarif umum?",
            a: "Boleh — wajib pajak dapat memilih memakai tarif umum dengan memberitahukan kepada DJP. Namun pilihan ini berlaku seterusnya: setelah memilih tarif umum, tidak dapat kembali ke skema final 0,5% pada tahun-tahun berikutnya.",
          },
          {
            q: "Apakah kerugian usaha bisa dikompensasi di skema 0,5%?",
            a: "Tidak. PPh final dihitung dari omzet, sehingga kerugian tidak mengurangi pajak dan tidak dapat dikompensasi ke tahun berikutnya. Di tarif umum, kerugian fiskal dapat dikompensasi hingga 5 tahun.",
          },
        ]}
      />
      <DasarHukum
        peraturan={[
          "PP 55/2022 jo. PP 20/2026",
          "UU PPh Pasal 17 & Pasal 31E",
          "UU HPP",
        ]}
        diverifikasi="1 September 2026"
      />
    </>
  );
}
