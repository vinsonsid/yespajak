// Use case: pengguna membandingkan skema PPh Final UMKM 0,5% dengan tarif umum
// (halaman /kalkulator/umkm-vs-tarif-umum). Jalur nyata: lib/perbandingan
// memanggil core/pajak/umkm, tanpa mock.
import { describe, expect, it } from "vitest";
import { bandingkan } from "../../src/core/pajak/perbandingan";

describe("use case: bandingkan UMKM 0,5% vs tarif umum", () => {
  it("AC1: pajak UMKM pada perbandingan sama dengan hasil core (orang pribadi, omzet 1 miliar)", () => {
    const hasil = bandingkan("orang-pribadi", 1_000_000_000, 20, "TK/0");
    expect(hasil.pajakUMKM).toBe(2_500_000);
    expect(hasil.hemat).toBe(hasil.pajakUmum - 2_500_000);
  });

  it("AC2: PT Perorangan membayar 0,5% dari rupiah pertama", () => {
    const hasil = bandingkan("pt-perorangan", 1_000_000_000, 20);
    expect(hasil.pajakUMKM).toBe(5_000_000);
  });

  it("AC3: omzet nol menghasilkan pajak UMKM nol dan rekomendasi seimbang", () => {
    const hasil = bandingkan("orang-pribadi", 0, 20);
    expect(hasil.pajakUMKM).toBe(0);
    expect(hasil.rekomendasi).toBe("seimbang");
    expect(hasil.marginImpasPersen).toBeNull();
  });

  it("AC4: omzet tidak valid dari URL tidak merusak perbandingan", () => {
    const hasil = bandingkan("orang-pribadi", -5_000_000, 20);
    expect(hasil.pajakUMKM).toBe(0);
    expect(Number.isFinite(hasil.pajakUmum)).toBe(true);
  });
});
