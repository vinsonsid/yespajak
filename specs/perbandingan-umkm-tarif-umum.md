# Perbandingan PPh Final UMKM 0,5% vs tarif umum

## Intent
Pengguna melihat skema mana yang lebih hemat pada omzet dan margin laba tertentu, dan pada margin berapa keduanya impas. Tarif umum: Pasal 17 progresif atas (laba − PTKP) untuk orang pribadi; 22% dengan fasilitas 31E untuk PT Perorangan/badan.

## Layer placement
- core: `src/core/pajak/perbandingan.ts` (`bandingkan`, `cariMarginImpas`). Memakai `umkm`, `pph21`, `pphBadan`, `ter` dari core.
- app: `KalkulatorBanding.tsx` hanya mengganti path import.

## Acceptance criteria

### AC1: orang pribadi, UMKM lebih hemat
Given OP TK/0, omzet 1 M, margin 20%
Then laba 200 jt, pajak UMKM 2,5 jt, pajak umum 15,9 jt (PKP 146 jt), hemat 13,4 jt, rekomendasi `umkm`

### AC2: orang pribadi, tarif umum lebih hemat
Given OP TK/0, omzet 1 M, margin 5%
Then laba 50 jt < PTKP, pajak umum 0, hemat −2,5 jt, rekomendasi `umum`

### AC3: badan memakai 22% dengan fasilitas
Given badan, omzet 1 M, margin 20%
Then pajak UMKM 5 jt, pajak umum 22 jt, rekomendasi `umkm`

### AC4: seimbang bila selisih ≤ 0,05% omzet (minimal Rp1.000)
Given OP TK/0, omzet 1 M (ambang 500 rb)
- margin 10,4% → pajak umum 2,5 jt, hemat 0 → `seimbang`
- margin 11,4% → hemat 500.000 → `seimbang`; margin 11,4001% → hemat 500.150 → `umkm`
- margin 9,4% → hemat −500.000 → `seimbang`; margin 9,3999% → hemat −500.050 → `umum`
Given badan, omzet 1 jt (ambang minimal 1.000, bukan 500), margin 5,2727…% → hemat ≈ 800 → `seimbang`

### AC5: margin impas
- OP TK/0 omzet 1 M → 10,4 (PKP 50 jt × 5% = 2,5 jt)
- Badan omzet 1 M → 50/11 ≈ 4,545% (11% × laba = 5 jt → laba 45,45 jt)
- OP omzet ≤ 500 jt (pajak UMKM 0) → 0
- Omzet ≤ 0 → `null`

### AC6: input omzet tidak valid (negatif) tidak melempar
Given OP omzet −5 jt
Then pajak UMKM 0, pajak umum finite, `marginImpasPersen` null

### AC7: omzet di atas Rp4,8 miliar
Given OP omzet 5 M, margin 20%
Then `bandingkan` tetap menghitung pajak UMKM 22,5 jt (0,5% × 4,5 M) dan pajak umum. Penandaan "skema final tidak tersedia" adalah tanggung jawab UI (`KalkulatorBanding` membandingkan omzet dengan `BATAS_OMZET_UMKM`). Keputusan untuk memindahkan penandaan ini ke core (mis. `pajakUMKM: null`) ada di tangan Vinson.

## Edge cases and failure modes
- Titik impas unik karena pajak umum naik monoton terhadap margin dan pajak UMKM tetap.
- Untuk omzet > 0 titik potong selalu ada di [0, 100]: pajak umum pada margin 0 selalu 0 ≤ target, dan pada margin 100% selalu ≥ target (OP: ≥ 5% × (omzet − PTKP) > 0,5% × (omzet − 500 jt); badan: ≥ 11% × omzet > 0,5% × omzet). Dua cabang penjaga di `cariMarginImpas` (`return null` bila umum selalu lebih murah, `return 0` bila umum sudah lebih mahal pada margin 0) karena itu tidak pernah tercapai; dibiarkan sebagai pertahanan dan dikecualikan dari target mutasi.

## Out of scope
- Status PTKP untuk PT Perorangan/badan (diabaikan).
- Pembulatan PKP ke ribuan untuk badan.

## Assumptions
- `marginPersen` dalam persen 0–100; pemanggil (UI) membatasinya.
