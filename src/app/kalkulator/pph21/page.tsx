import type { Metadata } from "next";
import KalkulatorPPh21 from "./KalkulatorPPh21";

export const metadata: Metadata = {
  title: "Kalkulator PPh 21 Karyawan (TER)",
  description:
    "Hitung potongan PPh Pasal 21 pegawai tetap dengan tarif efektif rata-rata (TER) PP 58/2023 dan perhitungan tahunan tarif progresif Pasal 17 — gratis dan akurat.",
};

export default function Page() {
  return <KalkulatorPPh21 />;
}
