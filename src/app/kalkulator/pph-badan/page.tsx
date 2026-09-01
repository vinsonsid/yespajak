import type { Metadata } from "next";
import KalkulatorPPhBadan from "./KalkulatorPPhBadan";

export const metadata: Metadata = {
  title: "Kalkulator PPh Badan 22%",
  description:
    "Hitung PPh badan tarif 22% dengan fasilitas Pasal 31E (pengurangan tarif 50% untuk bagian laba dari omzet sampai Rp4,8 miliar, bagi badan beromzet sampai Rp50 miliar).",
};

export default function Page() {
  return <KalkulatorPPhBadan />;
}
