/**
 * PPh Final UMKM 0,5% — PP 55/2022 sebagaimana diubah PP 20/2026.
 * Spesifikasi: specs/pph-final-umkm.md
 *
 * Pokok pengaturan (per 2026):
 *  - Tarif 0,5% dari peredaran bruto, untuk WP dengan omzet ≤ Rp4,8 miliar/tahun.
 *    Melewati batas di tahun berjalan: tahun itu masih tarif final, tahun
 *    berikutnya tarif umum (Pasal 59). Karena itu `melebihiBatas` informatif.
 *  - WP orang pribadi & PT Perorangan: tarif final tanpa batas waktu (PP 20/2026).
 *    Koperasi: maksimal 4 tahun sejak terdaftar (di luar cakupan modul ini).
 *  - Bagian omzet s.d. Rp500 juta setahun tidak dikenai PPh — HANYA untuk WP
 *    orang pribadi. PT Perorangan berstatus WP badan sehingga tidak berhak
 *    (SE-20/PJ/2022). Pembebasan dihitung kumulatif sejak awal tahun pajak.
 *  - Pajak terutang dibulatkan ke bawah ke rupiah penuh.
 */
import { err, ok, type Result } from "../result";

export const TARIF_UMKM_PERSEN = 0.5;
export const BATAS_OMZET_UMKM = 4_800_000_000;
export const OMZET_BEBAS_OP = 500_000_000;

export type JenisWPUMKM = "orang-pribadi" | "pt-perorangan" | "badan";

export type UmkmError = "OMZET_NEGATIF" | "OMZET_TIDAK_VALID";

export interface HasilUMKM {
  omzetSetahun: number;
  /** Omzet melewati Rp4,8 miliar: tahun depan wajib tarif umum. */
  melebihiBatas: boolean;
  omzetBebas: number;
  omzetKenaPajak: number;
  /** Rupiah penuh, dibulatkan ke bawah. */
  pphFinal: number;
  tarifEfektifPersen: number;
}

export interface InputUMKMBulanan {
  /** Jumlah omzet Januari s.d. bulan sebelum bulan ini, dalam tahun pajak yang sama. */
  omzetKumulatifSebelumnya: number;
  omzetBulanIni: number;
}

export interface HasilUMKMBulanan {
  omzetBulanIni: number;
  omzetKumulatifSetelah: number;
  omzetBebasBulanIni: number;
  omzetKenaPajak: number;
  /** Rupiah penuh, dibulatkan ke bawah. */
  pphFinal: number;
  /** Kumulatif setelah bulan ini melewati Rp4,8 miliar. */
  melebihiBatas: boolean;
}

function validasiOmzet(nilai: number): UmkmError | null {
  if (!Number.isFinite(nilai)) return "OMZET_TIDAK_VALID";
  if (nilai < 0) return "OMZET_NEGATIF";
  return null;
}

function pajakFinal(omzetKenaPajak: number): number {
  return Math.floor((omzetKenaPajak * TARIF_UMKM_PERSEN) / 100);
}

function berhakPembebasan(jenis: JenisWPUMKM): boolean {
  return jenis === "orang-pribadi";
}

export function hitungUMKM(jenis: JenisWPUMKM, omzetSetahun: number): Result<HasilUMKM, UmkmError> {
  const invalid = validasiOmzet(omzetSetahun);
  if (invalid) return err(invalid);
  const omzet = omzetSetahun + 0; // -0 -> 0

  const omzetBebas = berhakPembebasan(jenis) ? Math.min(omzet, OMZET_BEBAS_OP) : 0;
  const omzetKenaPajak = omzet - omzetBebas;
  const pphFinal = pajakFinal(omzetKenaPajak);
  return ok({
    omzetSetahun: omzet,
    melebihiBatas: omzet > BATAS_OMZET_UMKM,
    omzetBebas,
    omzetKenaPajak,
    pphFinal,
    tarifEfektifPersen: omzet > 0 ? (pphFinal / omzet) * 100 : 0,
  });
}

export function hitungUMKMBulanan(jenis: JenisWPUMKM, input: InputUMKMBulanan): Result<HasilUMKMBulanan, UmkmError> {
  const invalid = validasiOmzet(input.omzetKumulatifSebelumnya) ?? validasiOmzet(input.omzetBulanIni);
  if (invalid) return err(invalid);
  const sebelum = input.omzetKumulatifSebelumnya;
  const bulanIni = input.omzetBulanIni + 0; // -0 -> 0; menjaga kumulatif dan pajak tetap +0

  const sisaPembebasan = berhakPembebasan(jenis) ? Math.max(OMZET_BEBAS_OP - sebelum, 0) : 0;
  const omzetBebasBulanIni = Math.min(sisaPembebasan, bulanIni);
  const omzetKenaPajak = bulanIni - omzetBebasBulanIni;
  const omzetKumulatifSetelah = sebelum + bulanIni;
  return ok({
    omzetBulanIni: bulanIni,
    omzetKumulatifSetelah,
    omzetBebasBulanIni,
    omzetKenaPajak,
    pphFinal: pajakFinal(omzetKenaPajak),
    melebihiBatas: omzetKumulatifSetelah > BATAS_OMZET_UMKM,
  });
}
