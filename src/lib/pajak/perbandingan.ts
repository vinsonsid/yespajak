import { hitungPasal17 } from "./pph21";
import { hitungPPhBadan } from "./pphBadan";
import { hitungUMKM, JenisWPUMKM } from "./umkm";
import { PTKP, StatusPTKP } from "./ter";

/**
 * Perbandingan PPh Final UMKM 0,5% vs tarif umum.
 *
 * - Orang pribadi (pembukuan): tarif umum = Pasal 17 progresif atas
 *   (laba bersih − PTKP), dibulatkan ribuan ke bawah.
 * - Badan/PT Perorangan: tarif umum = 22% dengan fasilitas Pasal 31E.
 */

export interface HasilBanding {
  omzet: number;
  labaBersih: number;
  marginPersen: number;
  pajakUMKM: number;
  pajakUmum: number;
  hemat: number; // positif = UMKM lebih hemat
  rekomendasi: "umkm" | "umum" | "seimbang";
  /** Margin laba (%) di mana kedua skema menghasilkan pajak sama. */
  marginImpasPersen: number | null;
}

function pajakUmumOP(labaBersih: number, status: StatusPTKP): number {
  const pkp = Math.floor(Math.max(labaBersih - PTKP[status], 0) / 1000) * 1000;
  return hitungPasal17(pkp).total;
}

function pajakUmumBadan(omzet: number, labaBersih: number): number {
  return hitungPPhBadan(omzet, Math.max(labaBersih, 0)).totalPajak;
}

export function bandingkan(
  jenis: JenisWPUMKM,
  omzet: number,
  marginPersen: number,
  status: StatusPTKP = "TK/0"
): HasilBanding {
  const labaBersih = (omzet * marginPersen) / 100;
  const pajakUMKM = hitungUMKM(jenis, omzet).pphFinal;
  const pajakUmum =
    jenis === "orang-pribadi"
      ? pajakUmumOP(labaBersih, status)
      : pajakUmumBadan(omzet, labaBersih);

  const hemat = pajakUmum - pajakUMKM;
  const ambang = Math.max(omzet * 0.0005, 1000); // 0,05% omzet: anggap seimbang
  const rekomendasi: HasilBanding["rekomendasi"] =
    Math.abs(hemat) <= ambang ? "seimbang" : hemat > 0 ? "umkm" : "umum";

  return {
    omzet,
    labaBersih,
    marginPersen,
    pajakUMKM,
    pajakUmum,
    hemat,
    rekomendasi,
    marginImpasPersen: cariMarginImpas(jenis, omzet, status),
  };
}

/**
 * Cari margin impas dengan bisection: pajak umum naik monoton terhadap margin,
 * pajak UMKM tetap, sehingga titik potongnya (jika ada) unik.
 */
export function cariMarginImpas(
  jenis: JenisWPUMKM,
  omzet: number,
  status: StatusPTKP = "TK/0"
): number | null {
  if (omzet <= 0) return null;
  const target = hitungUMKM(jenis, omzet).pphFinal;
  const pajakUmumPadaMargin = (m: number) =>
    jenis === "orang-pribadi"
      ? pajakUmumOP((omzet * m) / 100, status)
      : pajakUmumBadan(omzet, (omzet * m) / 100);

  let lo = 0;
  let hi = 100;
  if (pajakUmumPadaMargin(hi) < target) return null; // umum selalu lebih murah
  if (pajakUmumPadaMargin(lo) > target) return 0;

  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (pajakUmumPadaMargin(mid) < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
