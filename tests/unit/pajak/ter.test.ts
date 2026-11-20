import { describe, expect, it } from "vitest";
import { PTKP, TER_A, TER_B, TER_C, kategoriTER, tarifTERBulanan } from "../../../src/core/pajak/ter";

describe("PTKP (PMK 101/2016)", () => {
  it("AC1: nilai per status", () => {
    expect(PTKP).toStrictEqual({
      "TK/0": 54_000_000,
      "TK/1": 58_500_000,
      "TK/2": 63_000_000,
      "TK/3": 67_500_000,
      "K/0": 58_500_000,
      "K/1": 63_000_000,
      "K/2": 67_500_000,
      "K/3": 72_000_000,
    });
  });
});

describe("kategoriTER", () => {
  it.each([
    ["TK/0", "A"],
    ["TK/1", "A"],
    ["K/0", "A"],
    ["TK/2", "B"],
    ["TK/3", "B"],
    ["K/1", "B"],
    ["K/2", "B"],
    ["K/3", "C"],
  ] as const)("AC2: %s → kategori %s", (status, kategori) => {
    expect(kategoriTER(status)).toBe(kategori);
  });
});

describe("tarifTERBulanan", () => {
  it.each([
    ["A", 0, 0],
    ["A", 5_400_000, 0],
    ["A", 5_400_001, 0.25],
    ["A", 5_650_000, 0.25],
    ["A", 5_650_001, 0.5],
    ["A", 10_000_000, 2],
    ["A", 1_400_000_000, 33],
    ["A", 1_400_000_001, 34],
    ["B", 0, 0],
    ["B", 6_200_000, 0],
    ["B", 6_200_001, 0.25],
    ["B", 10_000_000, 1.5],
    ["B", 1_405_000_000, 33],
    ["B", 1_405_000_001, 34],
    ["C", 0, 0],
    ["C", 6_600_000, 0],
    ["C", 6_600_001, 0.25],
    ["C", 10_000_000, 1.5],
    ["C", 1_419_000_000, 33],
    ["C", 1_419_000_001, 34],
  ] as const)("AC3: kategori %s bruto %i → %s%", (kategori, bruto, tarif) => {
    expect(tarifTERBulanan(kategori, bruto)).toBe(tarif);
  });

  it.each([
    ["A", 20_000_000, 9],
    ["A", 50_000_000, 18],
    ["A", 100_000_000, 24],
    ["B", 20_000_000, 8],
    ["B", 50_000_000, 18],
    ["B", 100_000_000, 24],
    ["C", 20_000_000, 8],
    ["C", 50_000_000, 17],
    ["C", 100_000_000, 24],
    ["A", 7_000_000, 1.25],
    ["B", 7_000_000, 0.75],
    ["C", 7_000_000, 0.5],
  ] as const)("AC3: titik tengah tabel PP 58/2023, kategori %s bruto %i → %s%", (kategori, bruto, tarif) => {
    expect(tarifTERBulanan(kategori, bruto)).toBe(tarif);
  });

  it("edge: bruto negatif memakai lapisan pertama", () => {
    expect(tarifTERBulanan("A", -1)).toBe(0);
  });

  it("edge: bruto sangat besar memakai lapisan terakhir", () => {
    expect(tarifTERBulanan("C", 1e15)).toBe(34);
  });
});

describe("struktur tabel TER (PP 58/2023)", () => {
  it.each([
    ["A", TER_A, 44],
    ["B", TER_B, 40],
    ["C", TER_C, 41],
  ] as const)("AC4: tabel %s punya %i lapisan, naik ketat, tarif tidak turun, berakhir Infinity/34", (_nama, tabel, jumlah) => {
    expect(tabel).toHaveLength(jumlah);
    for (let i = 1; i < tabel.length; i++) {
      const sebelum = tabel[i - 1];
      const kini = tabel[i];
      if (sebelum === undefined || kini === undefined) throw new Error("baris hilang");
      expect(kini[0]).toBeGreaterThan(sebelum[0]);
      expect(kini[1]).toBeGreaterThanOrEqual(sebelum[1]);
    }
    expect(tabel[0]?.[1]).toBe(0);
    expect(tabel[tabel.length - 1]).toStrictEqual([Number.POSITIVE_INFINITY, 34]);
  });
});
