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
    // PKP dibulatkan per 1.000: pajak sama pada margin 10,4%–10,4001%; impas = ujung atasnya.
    expect(bandingkan("orang-pribadi", 1_000_000_000, 20).marginImpasPersen).toBeCloseTo(10.4001, 6);
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
  it("AC5: OP TK/0 omzet 1 M → 10,4001% (batas atas terbuka: laba 104.001.000 sudah ber-PKP 50.001.000)", () => {
    expect(cariMarginImpas("orang-pribadi", 1_000_000_000, "TK/0")).toBeCloseTo(10.4001, 6);
  });

  it("AC5: status PTKP default TK/0 bila tidak diberikan", () => {
    expect(cariMarginImpas("orang-pribadi", 1_000_000_000)).toBeCloseTo(10.4001, 6);
    expect(bandingkan("orang-pribadi", 1_000_000_000, 20).pajakUmum).toBe(15_900_000);
  });

  it("AC5: badan omzet 1 M → 50/11 %", () => {
    expect(cariMarginImpas("badan", 1_000_000_000)).toBeCloseTo(50 / 11, 6);
  });

  // Pajak UMKM OP nol sampai omzet 500 jt, jadi impas = margin saat pajak umum
  // mulai > 0: laba ≥ PTKP + 1.000 (PKP dibulatkan ke bawah per 1.000).
  it.each([
    [100_000_000, "TK/0", 54.001],
    [400_000_000, "TK/0", 13.50025],
    [100_000_000, "K/3", 72.001],
  ] as const)("AC5: OP omzet %i %s (pajak UMKM nol) → impas %s%%", (omzet, status, impas) => {
    expect(cariMarginImpas("orang-pribadi", omzet, status)).toBeCloseTo(impas, 6);
  });

  it("AC5 batas: OP TK/0 omzet 54.000.999 (laba maks di bawah PTKP + 1.000) → null", () => {
    expect(cariMarginImpas("orang-pribadi", 54_000_999, "TK/0")).toBeNull();
  });

  it.each([
    [54_001_000, 100],
    [54_001_001, (54_001_000 / 54_001_001) * 100],
    [500_000_000, 10.8002],
    [500_001_000, 10.800178399643201],
  ] as const)("AC5 batas: OP TK/0 omzet %i → impas %s%%", (omzet, impas) => {
    expect(cariMarginImpas("orang-pribadi", omzet, "TK/0")).toBeCloseTo(impas, 6);
  });

  // Definisi AC5: pada margin impas pajak umum belum melebihi UMKM; sedikit di atasnya sudah.
  it.each([
    ["orang-pribadi", 1_000_000_000],
    ["orang-pribadi", 100_000_000],
    ["orang-pribadi", 54_001_000],
    ["orang-pribadi", 500_000_000],
    ["orang-pribadi", 500_001_000],
    ["badan", 1_000_000_000],
    ["badan", 5_000_000_000],
    ["badan", 60_000_000_000],
  ] as const)("AC5 definisi: %s omzet %i — umum ≤ UMKM pada impas, > UMKM pada impas + 0,0001", (jenis, omzet) => {
    const m = cariMarginImpas(jenis, omzet, "TK/0");
    expect(m).not.toBeNull();
    const pada = bandingkan(jenis, omzet, m!, "TK/0");
    const atas = bandingkan(jenis, omzet, (m!) + 0.0001, "TK/0");
    expect(pada.pajakUmum).toBeLessThanOrEqual(pada.pajakUMKM);
    expect(atas.pajakUmum).toBeGreaterThan(atas.pajakUMKM);
  });

  it.each([
    ["badan", 5_000_000_000, 4.37062937062937], // 31E parsial
    ["badan", 60_000_000_000, 2.2727272727272734], // di atas 50 M: 22% penuh
    ["pt-perorangan", 1_000_000_000, 50 / 11],
  ] as const)("AC5: %s omzet %i → impas %s%%", (jenis, omzet, impas) => {
    expect(cariMarginImpas(jenis, omzet)).toBeCloseTo(impas, 6);
  });

  it("AC5: OP omzet di bawah PTKP → null (pajak umum nol di margin berapa pun)", () => {
    expect(cariMarginImpas("orang-pribadi", 30_000_000, "TK/0")).toBeNull();
    expect(bandingkan("orang-pribadi", 30_000_000, 100, "TK/0").marginImpasPersen).toBeNull();
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
