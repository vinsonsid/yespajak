import { describe, expect, it } from "vitest";
import { TARIF_PPN_PERSEN, hitungPPN } from "../../../src/core/pajak/ppn";

describe("hitungPPN", () => {
  it("AC1: non-mewah, harga belum termasuk PPN: DPP 11/12, efektif 11%", () => {
    const r = hitungPPN(1_000_000, { termasukPPN: false, barangMewah: false });
    expect(r.hargaBarang).toBe(1_000_000);
    expect(r.dpp).toBeCloseTo(916_666.67, 2);
    expect(r.ppn).toBeCloseTo(110_000, 6);
    expect(r.totalDenganPPN).toBeCloseTo(1_110_000, 6);
    expect(r.tarifEfektifPersen).toBe(11);
    expect(TARIF_PPN_PERSEN).toBe(12);
  });

  it("AC2: mewah, harga belum termasuk PPN: DPP penuh, 12%", () => {
    expect(hitungPPN(1_000_000, { termasukPPN: false, barangMewah: true })).toStrictEqual({
      hargaBarang: 1_000_000,
      dpp: 1_000_000,
      tarifEfektifPersen: 12,
      ppn: 120_000,
      totalDenganPPN: 1_120_000,
    });
  });

  it("AC3: non-mewah, harga sudah termasuk PPN dipisah dengan 11%", () => {
    const r = hitungPPN(1_110_000, { termasukPPN: true, barangMewah: false });
    expect(r.hargaBarang).toBeCloseTo(1_000_000, 6);
    expect(r.ppn).toBeCloseTo(110_000, 6);
    expect(r.totalDenganPPN).toBeCloseTo(1_110_000, 6);
    expect(r.tarifEfektifPersen).toBe(11);
  });

  it("AC4: mewah, harga sudah termasuk PPN dipisah dengan 12%", () => {
    const r = hitungPPN(1_120_000, { termasukPPN: true, barangMewah: true });
    expect(r.hargaBarang).toBeCloseTo(1_000_000, 6);
    expect(r.dpp).toBeCloseTo(1_000_000, 6);
    expect(r.ppn).toBeCloseTo(120_000, 6);
    expect(r.totalDenganPPN).toBeCloseTo(1_120_000, 6);
  });

  it.each([
    [false, false, 11],
    [true, false, 11],
    [false, true, 12],
    [true, true, 12],
  ])("AC5: nilai nol (termasuk=%s, mewah=%s) menghasilkan nol dengan tarif %i", (termasukPPN, barangMewah, tarif) => {
    expect(hitungPPN(0, { termasukPPN, barangMewah })).toStrictEqual({
      hargaBarang: 0,
      dpp: 0,
      tarifEfektifPersen: tarif,
      ppn: 0,
      totalDenganPPN: 0,
    });
  });

  it("edge: PPN hasil pemisahan sama dengan total × 11/111", () => {
    const r = hitungPPN(2_220_000, { termasukPPN: true, barangMewah: false });
    expect(r.ppn).toBeCloseTo((2_220_000 * 11) / 111, 6);
    expect(r.hargaBarang + r.ppn).toBeCloseTo(2_220_000, 6);
  });
});
