# PPh Pasal 21 pegawai tetap: TER bulanan dan perhitungan tahunan

## Intent
Pemberi kerja menghitung PPh 21 masa Januari–November dengan Tarif Efektif Rata-rata (TER) bulanan PP 58/2023 dan PMK 168/2023, lalu masa Desember dengan tarif progresif Pasal 17 atas PKP setahun (dikurangi biaya jabatan, iuran pensiun, PTKP), memperhitungkan potongan Jan–Nov. PTKP sesuai PMK 101/PMK.010/2016.

## Layer placement
- core: `src/core/pajak/ter.ts` (`PTKP`, `kategoriTER`, `TER_A/B/C`, `tarifTERBulanan`), `src/core/pajak/pph21.ts` (`hitungPasal17`, `hitungPPh21Bulanan`, `hitungPPh21Tahunan`, `LAPISAN_PASAL_17`). Dipindahkan tanpa perubahan rumus.
- app: `KalkulatorPPh21.tsx`, `PayrollPPh21.tsx`, `KalkulatorBanding.tsx` hanya mengganti path import.

## Acceptance criteria

### AC1: PTKP per status
TK/0 54 jt; TK/1 dan K/0 58,5 jt; TK/2 dan K/1 63 jt; TK/3 dan K/2 67,5 jt; K/3 72 jt.

### AC2: kategori TER dari status
TK/0, TK/1, K/0 → A; TK/2, TK/3, K/1, K/2 → B; K/3 → C.

### AC3: batas lapisan TER (tepat di batas = lapisan bawah, satu rupiah di atas = lapisan berikutnya)
- A: 5.400.000 → 0; 5.400.001 → 0,25; 5.650.000 → 0,25; 5.650.001 → 0,5; 10.000.000 → 2; 1.400.000.000 → 33; 1.400.000.001 → 34
- B: 6.200.000 → 0; 6.200.001 → 0,25; 10.000.000 → 1,5; 1.405.000.000 → 33; 1.405.000.001 → 34
- C: 6.600.000 → 0; 6.600.001 → 0,25; 10.000.000 → 1,5; 1.419.000.000 → 33; 1.419.000.001 → 34
- Bruto 0 → 0 untuk semua kategori.

### AC4: struktur tabel TER
A 44 lapisan, B 40, C 41; batas atas naik ketat; tarif tidak turun; baris terakhir batas `Infinity` tarif 34.

### AC5: PPh 21 bulanan = TER × bruto
TK/0 bruto 10 jt → kategori A, tarif 2, pph 200.000. TK/2 10 jt → B, 1,5, 150.000. K/3 10 jt → C, 1,5, 150.000. TK/0 5 jt → 0.

### AC6: tarif progresif Pasal 17
PKP 0 → total 0, rincian kosong. 60 jt → 3 jt (1 lapisan). 100 jt → 9 jt, rincian `[{0–60 jt, 5%, 60 jt, 3 jt}, {60–250 jt, 15%, 40 jt, 6 jt}]`. 250 jt → 31,5 jt. 500 jt → 94 jt. 5 M → 1,444 M. 6 M → 1,794 M (5 lapisan, lapisan terakhir 35%).

### AC7: PPh 21 tahunan
- TK/0, bruto 120 jt, iuran 0: biaya jabatan 6 jt, netto 114 jt, PTKP 54 jt, PKP 60 jt, pph 3 jt. Tanpa `pphSudahDipotong`: `pphMasaDesember` dan `kelebihanPotong` tidak ada.
- Biaya jabatan maksimal 6 jt: bruto 200 jt → biaya jabatan 6 jt (bukan 10 jt), PKP 140 jt, pph 15 jt.
- Iuran pensiun mengurangi netto: bruto 200 jt, iuran 2,4 jt → PKP 137,6 jt, pph 14,64 jt.
- PKP dibulatkan ribuan ke bawah: bruto 100.500.500 → biaya jabatan 5.025.025, netto 95.475.475, PKP 41.475.000, pph 2.073.750.
- Netto di bawah PTKP → PKP 0, pph 0. Iuran melebihi bruto → netto 0.

### AC8: masa Desember
pph setahun 15 jt; dipotong Jan–Nov 12 jt → `pphMasaDesember` 3 jt, `kelebihanPotong` 0. Dipotong 20 jt → `pphMasaDesember` 0, `kelebihanPotong` 5 jt. Dipotong 0 → Desember 15 jt.

## Edge cases and failure modes
- Bruto negatif pada TER mengembalikan lapisan pertama (0).
- PKP tepat di batas lapisan (60 jt) hanya memakai satu lapisan.

## Out of scope
- Pegawai tidak tetap, bukan pegawai, TER harian, pesangon, WP luar negeri (PPh 26).
- Natura, tunjangan PPh (gross-up).
- Validasi input negatif/non-finite.

## Assumptions
- Pemanggil memberikan angka finite ≥ 0. Nilai tabel TER disalin dari lampiran PP 58/2023; tes memverifikasi batas kunci dan struktur, bukan seluruh 125 baris.
