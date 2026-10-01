import { describe, expect, it } from "vitest";
import { bandingkan, cariMarginImpas } from "../../../src/core/pajak/perbandingan";

describe("bandingkan", () => {
  it("AC1: orang pribadi, UMKM lebih hemat", () => {
    const r = bandingkan("orang-pribadi", 1_000_000_000, 20, "TK/0");
    expect(r.omzet).toBe(1_000_000_000);
    expect(r.labaBersih).toBe(200_000_000);
    expect(r.marginPersen).toBe(20);
    expect(r.pajakUMKM).toBe(2_500_000);
    expect(r.pajakUmum).toBe(15_900_000);
    expect(r.hemat).toBe(13_400_000);
    expect(r.rekomendasi).toBe("umkm");
  });

  it("AC1: status PTKP memengaruhi pajak umum orang pribadi", () => {
    const r = bandingkan("orang-pribadi", 1_000_000_000, 20, "K/3");
    expect(r.pajakUmum).toBe(13_200_000); // PKP 128 jt
  });

  it("AC2: orang pribadi, laba di bawah PTKP → tarif umum lebih hemat", () => {
    const r = bandingkan("orang-pribadi", 1_000_000_000, 5);
    expect(r.pajakUmum).toBe(0);
    expect(r.hemat).toBe(-2_500_000);
    expect(r.rekomendasi).toBe("umum");
  });

  it.each(["badan", "pt-perorangan"] as const)("AC3: %s memakai 22% dengan fasilitas 31E dan tanpa pembebasan 500 jt", (jenis) => {
    const r = bandingkan(jenis, 1_000_000_000, 20);
    expect(r.pajakUMKM).toBe(5_000_000);
    expect(r.pajakUmum).toBe(22_000_000);
    expect(r.rekomendasi).toBe("umkm");
  });

  it.each([
    [10.4, 0, "seimbang"],
    [11.4, 500_000, "seimbang"],
    [11.4001, 500_150, "umkm"],
    [9.4, -500_000, "seimbang"],
    [9.3999, -500_050, "umum"],
  ] as const)("AC4: OP omzet 1 M margin %s → hemat %i, %s", (margin, hemat, rekomendasi) => {
    const r = bandingkan("orang-pribadi", 1_000_000_000, margin, "TK/0");
    expect(r.hemat).toBeCloseTo(hemat, 3);
    expect(r.rekomendasi).toBe(rekomendasi);
  });

  it("AC4: ambang minimal Rp1.000 untuk omzet kecil", () => {
    const r = bandingkan("badan", 1_000_000, 5.2727272727);
    expect(r.pajakUMKM).toBe(5_000);
    expect(r.hemat).toBeCloseTo(800, 0); // 11% × 52.727 − 5.000; di atas 0,05% omzet (500) tapi ≤ 1.000
    expect(r.rekomendasi).toBe("seimbang");
  });

  it("AC5: marginImpasPersen ikut dalam hasil", () => {
    expect(bandingkan("orang-pribadi", 1_000_000_000, 20).marginImpasPersen).toBeCloseTo(10.4, 6);
  });

  it("AC7: omzet di atas 4,8 M tetap dihitung; UI yang menandai skema final tidak tersedia", () => {
    const r = bandingkan("orang-pribadi", 5_000_000_000, 20);
    expect(r.pajakUMKM).toBe(22_500_000);
    expect(Number.isFinite(r.pajakUmum)).toBe(true);
  });

  it("AC6: omzet negatif tidak melempar", () => {
    const r = bandingkan("orang-pribadi", -5_000_000, 20);
    expect(r.pajakUMKM).toBe(0);
    expect(r.pajakUmum).toBe(0);
    expect(r.marginImpasPersen).toBeNull();
  });
});

describe("cariMarginImpas", () => {
  it("AC5: OP TK/0 omzet 1 M → 10,4%", () => {
    expect(cariMarginImpas("orang-pribadi", 1_000_000_000, "TK/0")).toBeCloseTo(10.4, 6);
  });

  it("AC5: status PTKP default TK/0 bila tidak diberikan", () => {
    expect(cariMarginImpas("orang-pribadi", 1_000_000_000)).toBeCloseTo(10.4, 6);
    expect(bandingkan("orang-pribadi", 1_000_000_000, 20).pajakUmum).toBe(15_900_000);
  });

  it("AC5: badan omzet 1 M → 50/11 %", () => {
    expect(cariMarginImpas("badan", 1_000_000_000)).toBeCloseTo(50 / 11, 6);
  });

  it("AC5: OP omzet ≤ 500 jt (pajak UMKM nol) → 0", () => {
    expect(cariMarginImpas("orang-pribadi", 400_000_000)).toBeCloseTo(0, 9);
  });

  it("AC5: omzet nol atau negatif → null", () => {
    expect(cariMarginImpas("orang-pribadi", 0)).toBeNull();
    expect(cariMarginImpas("badan", -1)).toBeNull();
  });

  it("edge: pada margin impas kedua skema menghasilkan pajak sama", () => {
    const m = cariMarginImpas("badan", 1_000_000_000);
    if (m === null) throw new Error("impas harus ada");
    const r = bandingkan("badan", 1_000_000_000, m);
    expect(r.hemat).toBeCloseTo(0, 3);
  });
});
