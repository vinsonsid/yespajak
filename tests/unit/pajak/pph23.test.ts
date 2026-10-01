import { describe, expect, it } from "vitest";
import { OBJEK_PPH23, hitungPPh23 } from "../../../src/core/pajak/pph23";

describe("OBJEK_PPH23", () => {
  it("AC1: enam objek dengan tarif dan sifat final sesuai UU PPh Pasal 23 / PP 34/2017", () => {
    const ringkas = Object.fromEntries(
      Object.entries(OBJEK_PPH23).map(([k, v]) => [k, [v.tarifPersen, v.final]]),
    );
    expect(ringkas).toStrictEqual({
      bunga: [15, false],
      royalti: [15, false],
      hadiah: [15, false],
      "sewa-harta": [2, false],
      jasa: [2, false],
      "sewa-tanah-bangunan": [10, true],
    });
  });
});

describe("hitungPPh23", () => {
  it("AC2: bunga dengan NPWP 15%", () => {
    expect(hitungPPh23("bunga", 10_000_000, true)).toStrictEqual({
      objek: "bunga",
      info: OBJEK_PPH23.bunga,
      bruto: 10_000_000,
      tarifDipakaiPersen: 15,
      kenaikanNonNPWP: false,
      pph: 1_500_000,
      diterimaBersih: 8_500_000,
    });
  });

  it.each(["bunga", "royalti", "hadiah"] as const)("AC3: %s tanpa NPWP naik 100% menjadi 30%", (objek) => {
    const r = hitungPPh23(objek, 10_000_000, false);
    expect(r.tarifDipakaiPersen).toBe(30);
    expect(r.kenaikanNonNPWP).toBe(true);
    expect(r.pph).toBe(3_000_000);
    expect(r.diterimaBersih).toBe(7_000_000);
  });

  it.each([
    ["jasa", true, 2, 200_000],
    ["jasa", false, 4, 400_000],
    ["sewa-harta", true, 2, 200_000],
    ["sewa-harta", false, 4, 400_000],
  ] as const)("AC4: %s NPWP=%s → tarif %i, pph %i", (objek, npwp, tarif, pph) => {
    const r = hitungPPh23(objek, 10_000_000, npwp);
    expect(r.tarifDipakaiPersen).toBe(tarif);
    expect(r.pph).toBe(pph);
    expect(r.diterimaBersih).toBe(10_000_000 - pph);
  });

  it("AC5: sewa tanah/bangunan final 10% tanpa kenaikan non-NPWP", () => {
    const r = hitungPPh23("sewa-tanah-bangunan", 10_000_000, false);
    expect(r.tarifDipakaiPersen).toBe(10);
    expect(r.kenaikanNonNPWP).toBe(false);
    expect(r.pph).toBe(1_000_000);
    expect(r.info.final).toBe(true);
  });

  it("AC5: sewa tanah/bangunan dengan NPWP tetap 10%", () => {
    const r = hitungPPh23("sewa-tanah-bangunan", 10_000_000, true);
    expect(r.tarifDipakaiPersen).toBe(10);
    expect(r.pph).toBe(1_000_000);
  });

  it("AC6: bruto nol", () => {
    const r = hitungPPh23("royalti", 0, false);
    expect(r.pph).toBe(0);
    expect(r.diterimaBersih).toBe(0);
  });

  it("edge: bruto pecahan tanpa pembulatan", () => {
    const r = hitungPPh23("jasa", 12_345, true);
    expect(r.pph).toBeCloseTo(246.9, 6);
    expect(r.diterimaBersih).toBeCloseTo(12_098.1, 6);
  });
});
