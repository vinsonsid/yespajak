/**
 * PPh Badan — tarif 22% (Pasal 17 ayat (1) huruf b UU PPh jo. UU HPP).
 *
 * Fasilitas Pasal 31E: WP badan dengan peredaran bruto s.d. Rp50 miliar
 * mendapat pengurangan tarif 50% (menjadi 11%) atas bagian Penghasilan Kena
 * Pajak dari bagian peredaran bruto s.d. Rp4,8 miliar.
 */

export const TARIF_PPH_BADAN_PERSEN = 22;
export const BATAS_FASILITAS_31E = 50_000_000_000;
export const BATAS_OMZET_FASILITAS_PENUH = 4_800_000_000;

export interface HasilPPhBadan {
  peredaranBruto: number;
  pkp: number;
  pkpFasilitas: number;
  pkpNonFasilitas: number;
  pajakFasilitas: number;
  pajakNonFasilitas: number;
  totalPajak: number;
  tarifEfektifPersen: number;
  dapatFasilitas: boolean;
}

export function hitungPPhBadan(
  peredaranBruto: number,
  pkp: number
): HasilPPhBadan {
  const tarif = TARIF_PPH_BADAN_PERSEN / 100;

  let pkpFasilitas = 0;
  let pkpNonFasilitas = pkp;
  let dapatFasilitas = false;

  if (peredaranBruto > 0 && peredaranBruto <= BATAS_FASILITAS_31E) {
    dapatFasilitas = true;
    if (peredaranBruto <= BATAS_OMZET_FASILITAS_PENUH) {
      pkpFasilitas = pkp;
      pkpNonFasilitas = 0;
    } else {
      pkpFasilitas = (BATAS_OMZET_FASILITAS_PENUH / peredaranBruto) * pkp;
      pkpNonFasilitas = pkp - pkpFasilitas;
    }
  }

  const pajakFasilitas = pkpFasilitas * tarif * 0.5;
  const pajakNonFasilitas = pkpNonFasilitas * tarif;
  const totalPajak = pajakFasilitas + pajakNonFasilitas;

  return {
    peredaranBruto,
    pkp,
    pkpFasilitas,
    pkpNonFasilitas,
    pajakFasilitas,
    pajakNonFasilitas,
    totalPajak,
    tarifEfektifPersen: pkp > 0 ? (totalPajak / pkp) * 100 : 0,
    dapatFasilitas,
  };
}
