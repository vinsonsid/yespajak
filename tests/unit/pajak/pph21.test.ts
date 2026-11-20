import { describe, expect, it } from "vitest";
import {
  BIAYA_JABATAN_MAKS_SETAHUN,
  BIAYA_JABATAN_PERSEN,
  hitungPPh21Bulanan,
  hitungPPh21Tahunan,
  hitungPasal17,
} from "../../../src/core/pajak/pph21";

describe("hitungPasal17 (UU HPP)", () => {
  it("AC6: PKP nol: total nol, rincian kosong", () => {
    expect(hitungPasal17(0)).toStrictEqual({ total: 0, rincian: [] });
  });

  it("AC6: PKP 100 jt memakai dua lapisan dengan rincian lengkap", () => {
    expect(hitungPasal17(100_000_000)).toStrictEqual({
      total: 9_000_000,
      rincian: [
        { dariRp: 0, sampaiRp: 60_000_000, tarif: 5, dasarKena: 60_000_000, pajak: 3_000_000 },
        { dariRp: 60_000_000, sampaiRp: 250_000_000, tarif: 15, dasarKena: 40_000_000, pajak: 6_000_000 },
      ],
    });
  });

  it.each([
    [60_000_000, 3_000_000, 1],
    [60_000_001, 3_000_000.15, 2],
    [250_000_000, 31_500_000, 2],
    [500_000_000, 94_000_000, 3],
    [5_000_000_000, 1_444_000_000, 4],
    [6_000_000_000, 1_794_000_000, 5],
  ])("AC6: PKP %i → total %d dengan %i lapisan", (pkp, total, lapisan) => {
    const r = hitungPasal17(pkp);
    expect(r.total).toBeCloseTo(total, 6);
    expect(r.rincian).toHaveLength(lapisan);
  });

  it.each([
    [250_000_001, 3, 31_500_000.25],
    [500_000_001, 4, 94_000_000.3],
    [5_000_000_001, 5, 1_444_000_000.35],
  ])("AC6: satu rupiah di atas %i membuka lapisan ke-%i", (pkp, lapisan, total) => {
    const r = hitungPasal17(pkp);
    expect(r.rincian).toHaveLength(lapisan);
    expect(r.total).toBeCloseTo(total, 6);
  });

  it("AC6: lapisan terakhir 35% di atas 5 M", () => {
    const r = hitungPasal17(6_000_000_000);
    expect(r.rincian[4]).toStrictEqual({
      dariRp: 5_000_000_000,
      sampaiRp: Number.POSITIVE_INFINITY,
      tarif: 35,
      dasarKena: 1_000_000_000,
      pajak: 350_000_000,
    });
  });
});

describe("hitungPPh21Bulanan (TER)", () => {
  it.each([
    ["TK/0", 10_000_000, "A", 2, 200_000],
    ["TK/2", 10_000_000, "B", 1.5, 150_000],
    ["K/3", 10_000_000, "C", 1.5, 150_000],
    ["TK/0", 5_000_000, "A", 0, 0],
  ] as const)("AC5: %s bruto %i → kategori %s, tarif %s%, pph %i", (status, bruto, kategori, tarif, pph) => {
    expect(hitungPPh21Bulanan(status, bruto)).toStrictEqual({ kategori, tarifPersen: tarif, pph21: pph });
  });
});

describe("hitungPPh21Tahunan", () => {
  it("AC7: TK/0 bruto 120 jt tanpa iuran, tanpa potongan Jan–Nov", () => {
    expect(hitungPPh21Tahunan({ status: "TK/0", brutoSetahun: 120_000_000, iuranPensiunSetahun: 0 })).toStrictEqual({
      brutoSetahun: 120_000_000,
      biayaJabatan: 6_000_000,
      iuranPensiun: 0,
      nettoSetahun: 114_000_000,
      ptkp: 54_000_000,
      pkp: 60_000_000,
      pphSetahun: 3_000_000,
      rincian: [{ dariRp: 0, sampaiRp: 60_000_000, tarif: 5, dasarKena: 60_000_000, pajak: 3_000_000 }],
    });
  });

  it("AC7: biaya jabatan maksimal 6 jt setahun", () => {
    expect(BIAYA_JABATAN_PERSEN).toBe(5);
    expect(BIAYA_JABATAN_MAKS_SETAHUN).toBe(6_000_000);
    const r = hitungPPh21Tahunan({ status: "TK/0", brutoSetahun: 200_000_000, iuranPensiunSetahun: 0 });
    expect(r.biayaJabatan).toBe(6_000_000);
    expect(r.pkp).toBe(140_000_000);
    expect(r.pphSetahun).toBe(15_000_000);
  });

  it("AC7: iuran pensiun mengurangi netto", () => {
    const r = hitungPPh21Tahunan({ status: "TK/0", brutoSetahun: 200_000_000, iuranPensiunSetahun: 2_400_000 });
    expect(r.iuranPensiun).toBe(2_400_000);
    expect(r.nettoSetahun).toBe(191_600_000);
    expect(r.pkp).toBe(137_600_000);
    expect(r.pphSetahun).toBe(14_640_000);
  });

  it("AC7: PKP dibulatkan ribuan ke bawah", () => {
    const r = hitungPPh21Tahunan({ status: "TK/0", brutoSetahun: 100_500_500, iuranPensiunSetahun: 0 });
    expect(r.biayaJabatan).toBe(5_025_025);
    expect(r.nettoSetahun).toBe(95_475_475);
    expect(r.pkp).toBe(41_475_000);
    expect(r.pphSetahun).toBe(2_073_750);
  });

  it("AC7: PTKP mengikuti status (K/3 = 72 jt)", () => {
    const r = hitungPPh21Tahunan({ status: "K/3", brutoSetahun: 120_000_000, iuranPensiunSetahun: 0 });
    expect(r.ptkp).toBe(72_000_000);
    expect(r.pkp).toBe(42_000_000);
    expect(r.pphSetahun).toBe(2_100_000);
  });

  it("AC7: netto di bawah PTKP → PKP dan pajak nol", () => {
    const r = hitungPPh21Tahunan({ status: "TK/0", brutoSetahun: 50_000_000, iuranPensiunSetahun: 0 });
    expect(r.pkp).toBe(0);
    expect(r.pphSetahun).toBe(0);
    expect(r.rincian).toStrictEqual([]);
  });

  it("AC7: iuran melebihi bruto → netto nol, bukan negatif", () => {
    const r = hitungPPh21Tahunan({ status: "TK/0", brutoSetahun: 1_000_000, iuranPensiunSetahun: 5_000_000 });
    expect(r.nettoSetahun).toBe(0);
    expect(r.pkp).toBe(0);
  });

  it.each([
    [12_000_000, 3_000_000, 0],
    [20_000_000, 0, 5_000_000],
    [0, 15_000_000, 0],
    [15_000_000, 0, 0],
  ])("AC8: dipotong Jan–Nov %i → Desember %i, kelebihan %i", (dipotong, desember, kelebihan) => {
    const r = hitungPPh21Tahunan({
      status: "TK/0",
      brutoSetahun: 200_000_000,
      iuranPensiunSetahun: 0,
      pphSudahDipotong: dipotong,
    });
    expect(r.pphSetahun).toBe(15_000_000);
    expect(r.pphMasaDesember).toBe(desember);
    expect(r.kelebihanPotong).toBe(kelebihan);
  });
});
