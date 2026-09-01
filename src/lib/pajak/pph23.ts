/**
 * PPh Pasal 23 (dan PPh final Pasal 4 ayat (2) untuk sewa tanah/bangunan).
 *
 * Tarif dari peredaran bruto:
 *  - 15%: bunga, royalti, hadiah/penghargaan (selain yang dipotong PPh 21).
 *  - 2%: sewa harta selain tanah/bangunan, imbalan jasa teknik, manajemen,
 *    konsultan, dan jasa lain (PMK 141/PMK.03/2015).
 *  - Penerima tanpa NPWP: tarif PPh 23 menjadi 100% lebih tinggi.
 *  - Sewa tanah/bangunan: PPh final Pasal 4(2) 10% — bukan objek PPh 23,
 *    tanpa kenaikan non-NPWP.
 *
 * Catatan dividen (UU Cipta Kerja/UU HPP): dividen dalam negeri yang diterima
 * WP badan DN dikecualikan dari objek PPh; yang diterima WP orang pribadi DN
 * dikecualikan jika diinvestasikan kembali (jika tidak, PPh final 10%
 * disetor sendiri) — sehingga tidak dihitung di kalkulator ini.
 */

export type ObjekPPh23 =
  | "bunga"
  | "royalti"
  | "hadiah"
  | "sewa-harta"
  | "jasa"
  | "sewa-tanah-bangunan";

export interface InfoObjek {
  label: string;
  tarifPersen: number;
  final: boolean;
  keterangan: string;
}

export const OBJEK_PPH23: Record<ObjekPPh23, InfoObjek> = {
  bunga: {
    label: "Bunga (pinjaman, selain ke bank)",
    tarifPersen: 15,
    final: false,
    keterangan: "PPh 23 — 15% dari jumlah bruto bunga.",
  },
  royalti: {
    label: "Royalti",
    tarifPersen: 15,
    final: false,
    keterangan: "PPh 23 — 15% dari jumlah bruto royalti.",
  },
  hadiah: {
    label: "Hadiah & penghargaan (selain objek PPh 21)",
    tarifPersen: 15,
    final: false,
    keterangan: "PPh 23 — 15% dari jumlah bruto hadiah.",
  },
  "sewa-harta": {
    label: "Sewa harta selain tanah/bangunan (kendaraan, mesin, dll.)",
    tarifPersen: 2,
    final: false,
    keterangan: "PPh 23 — 2% dari jumlah bruto sewa.",
  },
  jasa: {
    label: "Jasa teknik, manajemen, konsultan & jasa lain",
    tarifPersen: 2,
    final: false,
    keterangan:
      "PPh 23 — 2% dari jumlah bruto imbalan jasa (daftar jasa lain: PMK 141/2015).",
  },
  "sewa-tanah-bangunan": {
    label: "Sewa tanah dan/atau bangunan",
    tarifPersen: 10,
    final: true,
    keterangan:
      "PPh final Pasal 4 ayat (2) — 10% dari jumlah bruto nilai sewa, bersifat final.",
  },
};

export interface HasilPPh23 {
  objek: ObjekPPh23;
  info: InfoObjek;
  bruto: number;
  tarifDipakaiPersen: number;
  kenaikanNonNPWP: boolean;
  pph: number;
  diterimaBersih: number;
}

export function hitungPPh23(
  objek: ObjekPPh23,
  bruto: number,
  punyaNPWP: boolean
): HasilPPh23 {
  const info = OBJEK_PPH23[objek];
  const kenaikanNonNPWP = !punyaNPWP && !info.final;
  const tarifDipakaiPersen = kenaikanNonNPWP
    ? info.tarifPersen * 2
    : info.tarifPersen;
  const pph = (bruto * tarifDipakaiPersen) / 100;
  return {
    objek,
    info,
    bruto,
    tarifDipakaiPersen,
    kenaikanNonNPWP,
    pph,
    diterimaBersih: bruto - pph,
  };
}
