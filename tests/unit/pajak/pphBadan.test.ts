import { describe, expect, it } from "vitest";
import { hitungPPhBadan } from "../../../src/core/pajak/pphBadan";

describe("hitungPPhBadan", () => {
  it("AC1: omzet ≤ 4,8 M: seluruh PKP dapat fasilitas 11%", () => {
    expect(hitungPPhBadan(1_000_000_000, 100_000_000)).toStrictEqual({
      peredaranBruto: 1_000_000_000,
      pkp: 100_000_000,
      pkpFasilitas: 100_000_000,
      pkpNonFasilitas: 0,
      pajakFasilitas: 11_000_000,
      pajakNonFasilitas: 0,
      totalPajak: 11_000_000,
      tarifEfektifPersen: 11,
      dapatFasilitas: true,
    });
  });

  it("AC2: tepat 4,8 M masih fasilitas penuh", () => {
    const r = hitungPPhBadan(4_800_000_000, 1_000_000_000);
    expect(r.pkpNonFasilitas).toBe(0);
    expect(r.totalPajak).toBe(110_000_000);
    expect(r.dapatFasilitas).toBe(true);
  });

  it("AC3: omzet 10 M: fasilitas proporsional 4,8/10", () => {
    const r = hitungPPhBadan(10_000_000_000, 1_000_000_000);
    expect(r.dapatFasilitas).toBe(true);
    expect(r.pkpFasilitas).toBeCloseTo(480_000_000, 3);
    expect(r.pkpNonFasilitas).toBeCloseTo(520_000_000, 3);
    expect(r.pajakFasilitas).toBeCloseTo(52_800_000, 3);
    expect(r.pajakNonFasilitas).toBeCloseTo(114_400_000, 3);
    expect(r.totalPajak).toBeCloseTo(167_200_000, 3);
    expect(r.tarifEfektifPersen).toBeCloseTo(16.72, 6);
  });

  it("AC4: tepat 50 M masih dapat fasilitas", () => {
    const r = hitungPPhBadan(50_000_000_000, 1_000_000_000);
    expect(r.dapatFasilitas).toBe(true);
    expect(r.pkpFasilitas).toBeCloseTo(96_000_000, 3);
    expect(r.totalPajak).toBeCloseTo(209_440_000, 3);
  });

  it("AC5: di atas 50 M tanpa fasilitas, 22% penuh", () => {
    expect(hitungPPhBadan(50_000_000_001, 1_000_000_000)).toStrictEqual({
      peredaranBruto: 50_000_000_001,
      pkp: 1_000_000_000,
      pkpFasilitas: 0,
      pkpNonFasilitas: 1_000_000_000,
      pajakFasilitas: 0,
      pajakNonFasilitas: 220_000_000,
      totalPajak: 220_000_000,
      tarifEfektifPersen: 22,
      dapatFasilitas: false,
    });
  });

  it("AC6: omzet nol tidak dapat fasilitas", () => {
    const r = hitungPPhBadan(0, 100_000_000);
    expect(r.dapatFasilitas).toBe(false);
    expect(r.pkpFasilitas).toBe(0);
    expect(r.totalPajak).toBe(22_000_000);
  });

  it("AC7: PKP nol: pajak nol tanpa pembagian nol", () => {
    const r = hitungPPhBadan(1_000_000_000, 0);
    expect(r.totalPajak).toBe(0);
    expect(r.tarifEfektifPersen).toBe(0);
  });

  it("edge: satu rupiah di atas 4,8 M sudah proporsional", () => {
    const r = hitungPPhBadan(4_800_000_001, 1_000_000_000);
    expect(r.dapatFasilitas).toBe(true);
    expect(r.pkpFasilitas).toBeCloseTo(999_999_999.79, 1); // 4,8 M / 4.800.000.001 × 1 M
    expect(r.pkpNonFasilitas).toBeCloseTo(0.21, 1);
    expect(r.totalPajak).toBeCloseTo(110_000_000.023, 2);
  });
});
