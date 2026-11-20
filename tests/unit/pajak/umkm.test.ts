import { describe, expect, it } from "vitest";
import { hitungUMKM, hitungUMKMBulanan } from "../../../src/core/pajak/umkm";

describe("hitungUMKM (setahun)", () => {
  it("AC1: 0,5% atas omzet kena pajak, dibulatkan ke bawah ke rupiah penuh", () => {
    const r = hitungUMKM("badan", 1_234_567);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const { tarifEfektifPersen, ...sisanya } = r.value;
    expect(sisanya).toStrictEqual({
      omzetSetahun: 1_234_567,
      melebihiBatas: false,
      omzetBebas: 0,
      omzetKenaPajak: 1_234_567,
      pphFinal: 6_172,
    });
    expect(tarifEfektifPersen).toBeCloseTo(0.49993, 5); // sedikit di bawah 0,5% karena pembulatan ke bawah
  });

  it("AC2: orang pribadi bebas pajak atas Rp500 juta pertama", () => {
    const r = hitungUMKM("orang-pribadi", 800_000_000);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.omzetBebas).toBe(500_000_000);
    expect(r.value.omzetKenaPajak).toBe(300_000_000);
    expect(r.value.pphFinal).toBe(1_500_000);
  });

  it.each([
    [500_000_000, 500_000_000, 0, 0],
    [500_000_001, 500_000_000, 1, 0],
    [499_999_999, 499_999_999, 0, 0],
    [500_200_000, 500_000_000, 200_000, 1_000],
  ])("AC3: batas pembebasan OP pada omzet %i", (omzet, bebas, kena, pph) => {
    const r = hitungUMKM("orang-pribadi", omzet);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.omzetBebas).toBe(bebas);
    expect(r.value.omzetKenaPajak).toBe(kena);
    expect(r.value.pphFinal).toBe(pph);
  });

  it.each(["pt-perorangan", "badan"] as const)("AC4: %s tidak mendapat pembebasan", (jenis) => {
    const r = hitungUMKM(jenis, 800_000_000);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.omzetBebas).toBe(0);
    expect(r.value.omzetKenaPajak).toBe(800_000_000);
    expect(r.value.pphFinal).toBe(4_000_000);
  });

  it("AC5: melebihi Rp4,8 miliar ditandai, pajak tetap dihitung (badan)", () => {
    const lewat = hitungUMKM("badan", 4_800_000_001);
    expect(lewat.ok).toBe(true);
    if (!lewat.ok) return;
    expect(lewat.value.melebihiBatas).toBe(true);
    expect(lewat.value.pphFinal).toBe(24_000_000);

    const tepat = hitungUMKM("badan", 4_800_000_000);
    expect(tepat.ok).toBe(true);
    if (!tepat.ok) return;
    expect(tepat.value.melebihiBatas).toBe(false);
    expect(tepat.value.pphFinal).toBe(24_000_000);
  });

  it("AC5: orang pribadi di atas Rp4,8 miliar tetap ditandai dan dihitung dengan pembebasan", () => {
    const r = hitungUMKM("orang-pribadi", 4_800_000_001);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const { tarifEfektifPersen, ...sisanya } = r.value;
    expect(sisanya).toStrictEqual({
      omzetSetahun: 4_800_000_001,
      melebihiBatas: true,
      omzetBebas: 500_000_000,
      omzetKenaPajak: 4_300_000_001,
      pphFinal: 21_500_000,
    });
    expect(tarifEfektifPersen).toBeCloseTo(0.44792, 5);
  });

  it("AC6: tarif efektif atas seluruh omzet, nol tanpa pembagian nol", () => {
    const r = hitungUMKM("orang-pribadi", 1_000_000_000);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.pphFinal).toBe(2_500_000);
    expect(r.value.tarifEfektifPersen).toBe(0.25);

    const nol = hitungUMKM("orang-pribadi", 0);
    expect(nol).toStrictEqual({
      ok: true,
      value: { omzetSetahun: 0, melebihiBatas: false, omzetBebas: 0, omzetKenaPajak: 0, pphFinal: 0, tarifEfektifPersen: 0 },
    });
  });

  it("AC7: menolak omzet negatif dan non-finite", () => {
    expect(hitungUMKM("badan", -1)).toStrictEqual({ ok: false, error: "OMZET_NEGATIF" });
    expect(hitungUMKM("orang-pribadi", -1)).toStrictEqual({ ok: false, error: "OMZET_NEGATIF" });
    expect(hitungUMKM("badan", Number.NaN)).toStrictEqual({ ok: false, error: "OMZET_TIDAK_VALID" });
    expect(hitungUMKM("badan", Number.POSITIVE_INFINITY)).toStrictEqual({ ok: false, error: "OMZET_TIDAK_VALID" });
    expect(hitungUMKM("badan", Number.NEGATIVE_INFINITY)).toStrictEqual({ ok: false, error: "OMZET_TIDAK_VALID" });
  });

  it("edge: -0 diperlakukan sebagai 0 di semua bidang hasil", () => {
    const r = hitungUMKM("badan", -0);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(Object.is(r.value.omzetSetahun, 0)).toBe(true);
    expect(Object.is(r.value.omzetKenaPajak, 0)).toBe(true);
    expect(Object.is(r.value.pphFinal, 0)).toBe(true);
  });

  it("edge: omzet pecahan diterima, pajak tetap rupiah penuh", () => {
    const r = hitungUMKM("badan", 1_000.5);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.pphFinal).toBe(5);
    expect(Number.isInteger(r.value.pphFinal)).toBe(true);
  });
});

describe("hitungUMKMBulanan (per masa pajak)", () => {
  it("AC8: pembebasan kumulatif terpakai sebagian dalam bulan berjalan", () => {
    expect(
      hitungUMKMBulanan("orang-pribadi", { omzetKumulatifSebelumnya: 450_000_000, omzetBulanIni: 100_000_000 }),
    ).toStrictEqual({
      ok: true,
      value: {
        omzetBulanIni: 100_000_000,
        omzetKumulatifSetelah: 550_000_000,
        omzetBebasBulanIni: 50_000_000,
        omzetKenaPajak: 50_000_000,
        pphFinal: 250_000,
        melebihiBatas: false,
      },
    });
  });

  it.each([500_000_000, 750_000_000])("AC9: setelah pembebasan habis (kumulatif %i) dikenai penuh", (sebelum) => {
    const r = hitungUMKMBulanan("orang-pribadi", { omzetKumulatifSebelumnya: sebelum, omzetBulanIni: 10_000_000 });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.omzetBebasBulanIni).toBe(0);
    expect(r.value.omzetKenaPajak).toBe(10_000_000);
    expect(r.value.pphFinal).toBe(50_000);
  });

  it("AC10: bulan sepenuhnya di bawah pembebasan tidak kena pajak", () => {
    const r = hitungUMKMBulanan("orang-pribadi", { omzetKumulatifSebelumnya: 100_000_000, omzetBulanIni: 50_000_000 });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.omzetBebasBulanIni).toBe(50_000_000);
    expect(r.value.omzetKenaPajak).toBe(0);
    expect(r.value.pphFinal).toBe(0);
    expect(r.value.omzetKumulatifSetelah).toBe(150_000_000);
  });

  it.each(["pt-perorangan", "badan"] as const)("AC11: %s tidak pernah bebas pada bulanan", (jenis) => {
    const r = hitungUMKMBulanan(jenis, { omzetKumulatifSebelumnya: 0, omzetBulanIni: 10_000_000 });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.omzetBebasBulanIni).toBe(0);
    expect(r.value.pphFinal).toBe(50_000);
  });

  it("AC12: menandai saat kumulatif melewati Rp4,8 miliar, pajak tetap dihitung", () => {
    const r = hitungUMKMBulanan("badan", { omzetKumulatifSebelumnya: 4_750_000_000, omzetBulanIni: 100_000_000 });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.melebihiBatas).toBe(true);
    expect(r.value.omzetKumulatifSetelah).toBe(4_850_000_000);
    expect(r.value.pphFinal).toBe(500_000);

    const tepat = hitungUMKMBulanan("badan", { omzetKumulatifSebelumnya: 4_700_000_000, omzetBulanIni: 100_000_000 });
    expect(tepat.ok).toBe(true);
    if (!tepat.ok) return;
    expect(tepat.value.melebihiBatas).toBe(false);
  });

  it("AC13: menolak input tidak valid pada salah satu bidang", () => {
    expect(hitungUMKMBulanan("badan", { omzetKumulatifSebelumnya: -1, omzetBulanIni: 0 })).toStrictEqual({ ok: false, error: "OMZET_NEGATIF" });
    expect(hitungUMKMBulanan("badan", { omzetKumulatifSebelumnya: 0, omzetBulanIni: -1 })).toStrictEqual({ ok: false, error: "OMZET_NEGATIF" });
    expect(hitungUMKMBulanan("badan", { omzetKumulatifSebelumnya: Number.NaN, omzetBulanIni: 0 })).toStrictEqual({ ok: false, error: "OMZET_TIDAK_VALID" });
    expect(hitungUMKMBulanan("badan", { omzetKumulatifSebelumnya: 0, omzetBulanIni: Number.POSITIVE_INFINITY })).toStrictEqual({ ok: false, error: "OMZET_TIDAK_VALID" });
  });

  it("AC13: validasi kumulatif didahulukan ketika kedua bidang tidak valid", () => {
    expect(hitungUMKMBulanan("badan", { omzetKumulatifSebelumnya: -1, omzetBulanIni: Number.NaN })).toStrictEqual({ ok: false, error: "OMZET_NEGATIF" });
  });

  it("edge: sisa pembebasan Rp1 (kumulatif 499.999.999, bulan ini Rp2)", () => {
    const r = hitungUMKMBulanan("orang-pribadi", { omzetKumulatifSebelumnya: 499_999_999, omzetBulanIni: 2 });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.omzetBebasBulanIni).toBe(1);
    expect(r.value.omzetKenaPajak).toBe(1);
    expect(r.value.pphFinal).toBe(0);
    expect(r.value.omzetKumulatifSetelah).toBe(500_000_001);
  });

  it("edge: -0 pada omzet bulan ini menghasilkan +0, bukan -0", () => {
    const r = hitungUMKMBulanan("badan", { omzetKumulatifSebelumnya: -0, omzetBulanIni: -0 });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(Object.is(r.value.omzetBulanIni, 0)).toBe(true);
    expect(Object.is(r.value.omzetKumulatifSetelah, 0)).toBe(true);
    expect(Object.is(r.value.pphFinal, 0)).toBe(true);
  });

  it("edge: pajak bulanan dibulatkan ke bawah ke rupiah penuh", () => {
    const r = hitungUMKMBulanan("badan", { omzetKumulatifSebelumnya: 0, omzetBulanIni: 1_234_567 });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value.pphFinal).toBe(6_172);
  });
});
