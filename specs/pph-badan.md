# PPh Badan 22% dengan fasilitas Pasal 31E

## Intent
Pengguna menghitung PPh Badan terutang dari peredaran bruto dan Penghasilan Kena Pajak (PKP), termasuk pengurangan tarif 50% atas bagian PKP yang berasal dari peredaran bruto s.d. Rp4,8 miliar bagi WP badan beromzet s.d. Rp50 miliar. Dasar: UU PPh Pasal 17 ayat (1) huruf b jo. UU HPP (22%), Pasal 31E.

## Layer placement
- core: `src/core/pajak/pphBadan.ts` (`hitungPPhBadan`, konstanta). Dipindahkan dari `src/lib/pajak/pphBadan.ts` tanpa perubahan rumus.
- app: `KalkulatorPPhBadan.tsx` hanya mengganti path import. `perbandingan.ts` memakainya untuk skema tarif umum badan.

## Acceptance criteria

### AC1: omzet s.d. Rp4,8 miliar, seluruh PKP dapat fasilitas (11%)
Given omzet Rp1.000.000.000, PKP Rp100.000.000
When dihitung
Then `dapatFasilitas` true, `pkpFasilitas` 100 jt, `pkpNonFasilitas` 0, `pajakFasilitas` 11 jt, `pajakNonFasilitas` 0, `totalPajak` 11 jt, `tarifEfektifPersen` 11

### AC2: tepat Rp4,8 miliar masih fasilitas penuh
Given omzet Rp4.800.000.000, PKP Rp1.000.000.000
When dihitung
Then `totalPajak` 110 jt, `pkpNonFasilitas` 0

### AC3: omzet antara Rp4,8 miliar dan Rp50 miliar, fasilitas proporsional
Given omzet Rp10.000.000.000, PKP Rp1.000.000.000
When dihitung
Then `pkpFasilitas` 480 jt (4,8/10 × PKP), `pkpNonFasilitas` 520 jt, `pajakFasilitas` 52,8 jt, `pajakNonFasilitas` 114,4 jt, `totalPajak` 167,2 jt, `tarifEfektifPersen` 16,72

### AC4: tepat Rp50 miliar masih dapat fasilitas
Given omzet Rp50.000.000.000, PKP Rp1.000.000.000
When dihitung
Then `dapatFasilitas` true, `pkpFasilitas` 96 jt, `totalPajak` 209,44 jt

### AC5: di atas Rp50 miliar tanpa fasilitas
Given omzet Rp50.000.000.001, PKP Rp1.000.000.000
When dihitung
Then `dapatFasilitas` false, `pkpFasilitas` 0, `pkpNonFasilitas` 1 M, `totalPajak` 220 jt, `tarifEfektifPersen` 22

### AC6: omzet nol tidak dapat fasilitas
Given omzet 0, PKP Rp100.000.000
When dihitung
Then `dapatFasilitas` false, `totalPajak` 22 jt

### AC7: PKP nol
Given omzet Rp1.000.000.000, PKP 0
When dihitung
Then semua pajak 0, `tarifEfektifPersen` 0 (tanpa pembagian nol)

## Edge cases and failure modes
- Batas Rp4,8 miliar dan Rp50 miliar: tepat di batas = masih fasilitas; satu rupiah di atas = tidak.
- PKP lebih besar dari omzet diterima apa adanya (tidak divalidasi).

## Out of scope
- PKP dibulatkan ke ribuan (dilakukan pemanggil bila perlu).
- Tarif 19% perusahaan terbuka (Pasal 17 ayat (2b)), kredit pajak, angsuran PPh 25.
- Validasi input negatif/non-finite.

## Assumptions
- Pemanggil memberikan angka finite ≥ 0.
