/**
 * PPN — UU HPP jo. PMK 131/2024 (berlaku sejak 1 Januari 2025, masih berlaku 2026):
 *  - Barang mewah (objek PPnBM): PPN = 12% × harga jual/nilai impor.
 *  - Barang/jasa non-mewah: PPN = 12% × DPP nilai lain (11/12 × harga jual)
 *    sehingga tarif efektifnya 11%.
 */

export const TARIF_PPN_PERSEN = 12;

export interface HasilPPN {
  hargaBarang: number; // harga sebelum PPN
  dpp: number;
  tarifEfektifPersen: number;
  ppn: number;
  totalDenganPPN: number;
}

export function hitungPPN(
  nilai: number,
  opsi: { termasukPPN: boolean; barangMewah: boolean }
): HasilPPN {
  const tarifEfektif = opsi.barangMewah ? 12 : 11;

  const hargaBarang = opsi.termasukPPN
    ? nilai / (1 + tarifEfektif / 100)
    : nilai;

  const dpp = opsi.barangMewah ? hargaBarang : (hargaBarang * 11) / 12;
  const ppn = (dpp * TARIF_PPN_PERSEN) / 100;

  return {
    hargaBarang,
    dpp,
    tarifEfektifPersen: tarifEfektif,
    ppn,
    totalDenganPPN: hargaBarang + ppn,
  };
}
