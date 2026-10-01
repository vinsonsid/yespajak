# PPh Final UMKM 0,5%

## Intent

Wajib pajak UMKM (orang pribadi, PT Perorangan, badan) mendapat perhitungan PPh final 0,5% yang benar, dalam rupiah penuh, baik untuk setahun maupun per masa pajak (bulan) dengan pembebasan omzet Rp500 juta pertama yang diterapkan secara kumulatif untuk orang pribadi. Perhitungan ini adalah logika bisnis pertama yang masuk `src/core` dan dijaga oleh gate pengujian.

Dasar hukum: PP 55/2022 Pasal 56–62 sebagaimana diubah PP 20/2026; SE-20/PJ/2022 (PT Perorangan tidak berhak pembebasan Rp500 juta).

## Layer placement

- core: `src/core/result.ts` (tipe `Result`), `src/core/pajak/umkm.ts` (`hitungUMKM`, `hitungUMKMBulanan`, konstanta). Dipindahkan dari `src/lib/pajak/umkm.ts`.
- adapters: tidak ada.
- app: `KalkulatorUMKM.tsx`, `KalkulatorBanding.tsx`, `src/lib/pajak/perbandingan.ts` mengganti import dan membuka `Result`.

## Acceptance criteria

### AC1: tarif 0,5% atas omzet kena pajak, dibulatkan ke bawah ke rupiah penuh
Given WP badan dengan omzet setahun Rp1.234.567
When `hitungUMKM("badan", 1_234_567)`
Then `pphFinal` = 6.172 (bukan 6.172,835), `omzetKenaPajak` = 1.234.567, `omzetBebas` = 0

### AC2: orang pribadi bebas pajak atas Rp500 juta pertama
Given WP orang pribadi dengan omzet setahun Rp800.000.000
When `hitungUMKM("orang-pribadi", 800_000_000)`
Then `omzetBebas` = 500.000.000, `omzetKenaPajak` = 300.000.000, `pphFinal` = 1.500.000

### AC3: batas pembebasan tepat di Rp500 juta
Given omzet orang pribadi tepat Rp500.000.000, Rp500.000.001, dan Rp499.999.999
When dihitung
Then pphFinal berturut-turut 0, 0 (0,005 dibulatkan ke bawah), 0; omzetBebas berturut-turut 500.000.000, 500.000.000, 499.999.999

### AC4: PT Perorangan dan badan tidak mendapat pembebasan
Given omzet Rp800.000.000
When `hitungUMKM("pt-perorangan", …)` dan `hitungUMKM("badan", …)`
Then `omzetBebas` = 0 dan `pphFinal` = 4.000.000 untuk keduanya

### AC5: omzet melebihi Rp4,8 miliar ditandai, pajak tetap dihitung
Given omzet Rp4.800.000.001
When dihitung untuk jenis apa pun
Then `melebihiBatas` = true dan `pphFinal` tetap dihitung (PP 55 Pasal 59: tahun berjalan masih memakai tarif final; tahun berikutnya tarif umum). Pada omzet tepat Rp4.800.000.000, `melebihiBatas` = false.

### AC6: tarif efektif dihitung atas seluruh omzet
Given orang pribadi omzet Rp1.000.000.000
When dihitung
Then `pphFinal` = 2.500.000 dan `tarifEfektifPersen` = 0,25. Pada omzet 0, `tarifEfektifPersen` = 0 (tanpa pembagian nol).

### AC7: input tidak valid ditolak dengan `Result` error
Given omzet negatif, `NaN`, atau `Infinity`
When dihitung
Then hasil `{ ok: false, error: "OMZET_NEGATIF" }` untuk negatif, `{ ok: false, error: "OMZET_TIDAK_VALID" }` untuk non-finite. Omzet 0 valid dan menghasilkan pajak 0.

### AC8: perhitungan per masa pajak (bulan) dengan pembebasan kumulatif
Given orang pribadi dengan omzet kumulatif Januari–Mei Rp450.000.000 dan omzet Juni Rp100.000.000
When `hitungUMKMBulanan("orang-pribadi", { omzetKumulatifSebelumnya: 450_000_000, omzetBulanIni: 100_000_000 })`
Then `omzetBebasBulanIni` = 50.000.000, `omzetKenaPajak` = 50.000.000, `pphFinal` = 250.000, `omzetKumulatifSetelah` = 550.000.000

### AC9: bulan setelah pembebasan habis dikenai penuh
Given orang pribadi dengan kumulatif sebelumnya Rp500.000.000 (atau lebih) dan omzet bulan ini Rp10.000.000
When dihitung
Then `omzetBebasBulanIni` = 0 dan `pphFinal` = 50.000

### AC10: bulan sepenuhnya di bawah pembebasan tidak kena pajak
Given orang pribadi kumulatif sebelumnya Rp100.000.000, bulan ini Rp50.000.000
When dihitung
Then `omzetBebasBulanIni` = 50.000.000, `pphFinal` = 0

### AC11: bulanan untuk PT Perorangan/badan tidak pernah bebas
Given `pt-perorangan` kumulatif sebelumnya 0, bulan ini Rp10.000.000
When dihitung
Then `omzetBebasBulanIni` = 0, `pphFinal` = 50.000

### AC12: bulanan menandai saat kumulatif melewati Rp4,8 miliar
Given kumulatif sebelumnya Rp4.750.000.000 dan bulan ini Rp100.000.000
When dihitung
Then `melebihiBatas` = true, pajak bulan ini tetap dihitung (Rp500.000 untuk badan)

### AC13: bulanan menolak input tidak valid
Given salah satu dari `omzetKumulatifSebelumnya` atau `omzetBulanIni` negatif atau non-finite
When dihitung
Then error yang sama dengan AC7

## Edge cases and failure modes

- Rp500.000.001 untuk OP: omzet kena pajak Rp1, pajak 0 setelah pembulatan ke bawah.
- Omzet bukan bilangan bulat (mis. 1.000,5): diterima, pajak tetap dibulatkan ke bawah ke rupiah.
- Tepat di batas Rp4,8 miliar: belum melebihi.
- `-0` diperlakukan sebagai 0, bukan negatif.
- Bulanan: pembebasan yang tersisa lebih besar dari omzet bulan ini (AC10) dan lebih kecil (AC8).
- Pembagian nol pada tarif efektif (AC6).

## Out of scope

- Batas waktu 4 tahun untuk koperasi (jenis `badan` tidak membedakan koperasi).
- Pilihan WP untuk memakai tarif umum meski memenuhi syarat.
- Pengecualian omzet tertentu (penghasilan dari jasa profesi, luar negeri, yang sudah final).
- Pembulatan DPP ke ribuan (hanya berlaku untuk SPT Tahunan tarif umum, bukan PPh final).

## Assumptions

- Pajak dibulatkan ke bawah ke rupiah penuh (praktik pembulatan PPh terutang). Jika Vinson menghendaki pembulatan lain, ubah AC1 dan AC3.
- `melebihiBatas` bersifat informatif (AC5), tidak mengosongkan pajak, karena tahun berjalan masih dikenai tarif final.
- Pembebasan Rp500 juta berlaku per tahun pajak dan dihitung kumulatif dari Januari; pemanggil bertanggung jawab memberi `omzetKumulatifSebelumnya` yang benar.
