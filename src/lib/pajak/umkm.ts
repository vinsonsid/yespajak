/**
 * PPh Final UMKM 0,5% — PP 55/2022 sebagaimana diubah PP 20/2026.
 *
 * Pokok pengaturan (per 2026):
 *  - Tarif 0,5% dari peredaran bruto, untuk WP dengan omzet ≤ Rp4,8 miliar/tahun.
 *  - WP orang pribadi & PT Perorangan: dapat memakai tarif final tanpa batas waktu
 *    (PP 20/2026). Koperasi: maksimal 4 tahun sejak terdaftar.
 *  - Bagian omzet s.d. Rp500 juta setahun tidak dikenai PPh — HANYA untuk WP
 *    orang pribadi. PT Perorangan berstatus WP badan sehingga tidak berhak
 *    (SE-20/PJ/2022).
 */

export const TARIF_UMKM_PERSEN = 0.5;
export const BATAS_OMZET_UMKM = 4_800_000_000;
export const OMZET_BEBAS_OP = 500_000_000;

export type JenisWPUMKM = "orang-pribadi" | "pt-perorangan" | "badan";

export interface HasilUMKM {
  omzetSetahun: number;
  melebihiBatas: boolean;
  omzetBebas: number;
  omzetKenaPajak: number;
  pphFinal: number;
  tarifEfektifPersen: number;
}

export function hitungUMKM(
  jenis: JenisWPUMKM,
  omzetSetahun: number
): HasilUMKM {
  const melebihiBatas = omzetSetahun > BATAS_OMZET_UMKM;
  const omzetBebas =
    jenis === "orang-pribadi" ? Math.min(omzetSetahun, OMZET_BEBAS_OP) : 0;
  const omzetKenaPajak = Math.max(omzetSetahun - omzetBebas, 0);
  const pphFinal = (omzetKenaPajak * TARIF_UMKM_PERSEN) / 100;
  return {
    omzetSetahun,
    melebihiBatas,
    omzetBebas,
    omzetKenaPajak,
    pphFinal,
    tarifEfektifPersen: omzetSetahun > 0 ? (pphFinal / omzetSetahun) * 100 : 0,
  };
}
