# PPN 12% dengan DPP nilai lain (PMK 131/2024)

## Intent
Pengguna menghitung PPN atas harga barang/jasa, baik dari harga sebelum PPN maupun dari harga yang sudah termasuk PPN, dengan tarif efektif 11% untuk barang non-mewah dan 12% untuk barang mewah. Dasar: UU HPP Pasal 7, PMK 131/2024 (berlaku 1 Januari 2025, masih berlaku 2026).

## Layer placement
- core: `src/core/pajak/ppn.ts` (`hitungPPN`, `TARIF_PPN_PERSEN`). Dipindahkan dari `src/lib/pajak/ppn.ts` tanpa perubahan rumus.
- adapters: tidak ada.
- app: `KalkulatorPPN.tsx` hanya mengganti path import.

## Acceptance criteria

### AC1: non-mewah, harga belum termasuk PPN
Given nilai Rp1.000.000, `termasukPPN: false`, `barangMewah: false`
When dihitung
Then `hargaBarang` 1.000.000, `dpp` 916.666,67 (11/12 × harga), `ppn` 110.000, `totalDenganPPN` 1.110.000, `tarifEfektifPersen` 11

### AC2: mewah, harga belum termasuk PPN
Given nilai Rp1.000.000, `barangMewah: true`
When dihitung
Then `dpp` 1.000.000, `ppn` 120.000, `total` 1.120.000, `tarifEfektifPersen` 12

### AC3: non-mewah, harga sudah termasuk PPN
Given nilai Rp1.110.000, `termasukPPN: true`, non-mewah
When dihitung
Then `hargaBarang` 1.000.000, `ppn` 110.000, `total` 1.110.000

### AC4: mewah, harga sudah termasuk PPN
Given nilai Rp1.120.000, `termasukPPN: true`, mewah
When dihitung
Then `hargaBarang` 1.000.000, `ppn` 120.000, `total` 1.120.000

### AC5: nilai nol
Given nilai 0 dengan kombinasi opsi apa pun
When dihitung
Then semua nilai rupiah 0, `tarifEfektifPersen` tetap 11 atau 12 sesuai jenis

## Edge cases and failure modes
- Pembagian saat memisahkan PPN: `total × 11/111` harus sama dengan `ppn` (konsistensi AC3).
- Nilai pecahan diterima apa adanya; pembulatan ke rupiah terjadi di tampilan.

## Out of scope
- PPnBM (tarif barang mewah tambahan).
- Tarif khusus/besaran tertentu (mis. PMK 71/2022), PPN dibebaskan, ekspor 0%.
- Validasi input negatif/non-finite (lihat Assumptions).

## Assumptions
- Pemanggil memberikan angka finite ≥ 0 (RupiahInput menjamin). Validasi `Result` disamakan dengan modul UMKM pada iterasi berikutnya setelah Vinson mengonfirmasi kebijakan pembulatan.
