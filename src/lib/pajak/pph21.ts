import { PTKP, StatusPTKP, kategoriTER, tarifTERBulanan } from "./ter";

/**
 * Lapisan tarif progresif Pasal 17 ayat (1) huruf a UU PPh
 * sebagaimana diubah UU HPP (berlaku sejak Tahun Pajak 2022).
 */
export const LAPISAN_PASAL_17: { batasAtas: number; tarif: number }[] = [
  { batasAtas: 60_000_000, tarif: 5 },
  { batasAtas: 250_000_000, tarif: 15 },
  { batasAtas: 500_000_000, tarif: 25 },
  { batasAtas: 5_000_000_000, tarif: 30 },
  { batasAtas: Infinity, tarif: 35 },
];

export const BIAYA_JABATAN_PERSEN = 5;
export const BIAYA_JABATAN_MAKS_SETAHUN = 6_000_000;

export interface RincianPasal17 {
  dariRp: number;
  sampaiRp: number;
  tarif: number;
  dasarKena: number;
  pajak: number;
}

export function hitungPasal17(pkp: number): {
  total: number;
  rincian: RincianPasal17[];
} {
  const rincian: RincianPasal17[] = [];
  let sisa = pkp;
  let batasBawah = 0;
  let total = 0;

  for (const { batasAtas, tarif } of LAPISAN_PASAL_17) {
    if (sisa <= 0) break;
    const lebar = batasAtas - batasBawah;
    const dasarKena = Math.min(sisa, lebar);
    const pajak = (dasarKena * tarif) / 100;
    rincian.push({ dariRp: batasBawah, sampaiRp: batasAtas, tarif, dasarKena, pajak });
    total += pajak;
    sisa -= dasarKena;
    batasBawah = batasAtas;
  }

  return { total, rincian };
}

export interface HasilPPh21Bulanan {
  kategori: "A" | "B" | "C";
  tarifPersen: number;
  pph21: number;
}

/** PPh 21 masa Januari–November untuk pegawai tetap: TER bulanan × bruto. */
export function hitungPPh21Bulanan(
  status: StatusPTKP,
  brutoSebulan: number
): HasilPPh21Bulanan {
  const kategori = kategoriTER(status);
  const tarifPersen = tarifTERBulanan(kategori, brutoSebulan);
  return { kategori, tarifPersen, pph21: (brutoSebulan * tarifPersen) / 100 };
}

export interface InputPPh21Tahunan {
  status: StatusPTKP;
  brutoSetahun: number; // gaji + tunjangan + bonus + THR + natura kena pajak
  iuranPensiunSetahun: number; // iuran pensiun/JHT yang dibayar pegawai sendiri
  pphSudahDipotong?: number; // total potongan TER Jan–Nov (untuk hitung masa Desember)
}

export interface HasilPPh21Tahunan {
  brutoSetahun: number;
  biayaJabatan: number;
  iuranPensiun: number;
  nettoSetahun: number;
  ptkp: number;
  pkp: number;
  pphSetahun: number;
  rincian: RincianPasal17[];
  pphMasaDesember?: number;
  /** Kelebihan potong Jan–Nov yang dikembalikan ke karyawan di bulan Desember. */
  kelebihanPotong?: number;
}

/**
 * PPh 21 setahun untuk pegawai tetap (perhitungan masa pajak terakhir/Desember):
 * bruto − biaya jabatan − iuran pensiun = netto; netto − PTKP = PKP
 * (dibulatkan ke bawah ribuan penuh); tarif progresif Pasal 17.
 */
export function hitungPPh21Tahunan(input: InputPPh21Tahunan): HasilPPh21Tahunan {
  const biayaJabatan = Math.min(
    (input.brutoSetahun * BIAYA_JABATAN_PERSEN) / 100,
    BIAYA_JABATAN_MAKS_SETAHUN
  );
  const nettoSetahun = Math.max(
    input.brutoSetahun - biayaJabatan - input.iuranPensiunSetahun,
    0
  );
  const ptkp = PTKP[input.status];
  const pkp = Math.floor(Math.max(nettoSetahun - ptkp, 0) / 1000) * 1000;
  const { total, rincian } = hitungPasal17(pkp);

  const hasil: HasilPPh21Tahunan = {
    brutoSetahun: input.brutoSetahun,
    biayaJabatan,
    iuranPensiun: input.iuranPensiunSetahun,
    nettoSetahun,
    ptkp,
    pkp,
    pphSetahun: total,
    rincian,
  };

  if (input.pphSudahDipotong !== undefined) {
    const selisih = total - input.pphSudahDipotong;
    hasil.pphMasaDesember = Math.max(selisih, 0);
    hasil.kelebihanPotong = Math.max(-selisih, 0);
  }

  return hasil;
}
