import type { Metadata } from "next";
import KalkulatorUMKM from "./KalkulatorUMKM";

export const metadata: Metadata = {
  title: "Kalkulator PPh Final UMKM 0,5%",
  description:
    "Hitung PPh final UMKM 0,5% (PP 55/2022 jo. PP 20/2026) untuk orang pribadi, PT Perorangan, dan badan — termasuk pembebasan omzet Rp500 juta pertama bagi orang pribadi.",
};

export default function Page() {
  return <KalkulatorUMKM />;
}
