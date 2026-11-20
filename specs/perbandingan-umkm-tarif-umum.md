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
Margin impas = margin tertinggi di mana pajak umum belum melebihi pajak UMKM. Di atasnya skema UMKM lebih hemat. `null` bila pajak umum tidak pernah lebih mahal pada margin 0–100%.
- OP TK/0 omzet 1 M → 10,4001% (PKP dibulatkan per 1.000, jadi pajak sama 2,5 jt pada margin 10,4%–10,4001%; impas = ujung atasnya; UI menampilkan ≈ 10,4%)
- Badan omzet 1 M → 50/11 ≈ 4,545% (11% × laba = 5 jt → laba 45,45 jt)
- OP omzet ≤ 500 jt (pajak UMKM 0) → margin saat laba mencapai PTKP + 1.000: TK/0 omzet 100 jt → 54,001%; 400 jt → 13,50025%; 500 jt → 10,8002%; K/3 omzet 100 jt → 72,001%
- OP omzet 500.001.000 (pajak UMKM 5) → ≈ 10,80018%
- Badan omzet 5 M (31E parsial) → ≈ 4,37063%; omzet 60 M (22% penuh) → ≈ 2,27273%; PT perorangan omzet 1 M → 50/11 %
- Semua nilai di atas adalah batas atas yang didekati dari bawah: pada margin yang dikembalikan pajak umum ≤ pajak UMKM, dan pada margin + 0,0001 pajak umum > pajak UMKM
- OP omzet < PTKP + 1.000 (pajak umum 0 di margin berapa pun) → `null`
- Omzet ≤ 0 → `null`

#### Tabel batas (OP TK/0, PTKP 54 jt)
| Input | Di bawah | Tepat | Di atas | Pembulatan |
|---|---|---|---|---|
| omzet vs PTKP + 1.000 | 54.000.999 → `null` | 54.001.000 → ≈ 100% (tepat di bawah 100) | 54.001.001 → 54.001.000 / 54.001.001 × 100% | PKP floor per 1.000 |
| omzet vs 500 jt (pajak UMKM mulai > 0) | 500.000.000 → 10,8002% | | 500.001.000 → ≈ 10,80018% | pajak UMKM floor ke rupiah |

### AC6: input omzet tidak valid (negatif) tidak melempar
Given OP omzet −5 jt
Then pajak UMKM 0, pajak umum finite, `marginImpasPersen` null

### AC7: omzet di atas Rp4,8 miliar
Given OP omzet 5 M, margin 20%
Then `bandingkan` tetap menghitung pajak UMKM 22,5 jt (0,5% × 4,5 M) dan pajak umum. Penandaan "skema final tidak tersedia" adalah tanggung jawab UI (`KalkulatorBanding` membandingkan omzet dengan `BATAS_OMZET_UMKM`). Keputusan untuk memindahkan penandaan ini ke core (mis. `pajakUMKM: null`) ada di tangan Vinson.

## Edge cases and failure modes
- Titik impas unik karena pajak umum naik monoton terhadap margin dan pajak UMKM tetap.
- Pajak umum pada margin 0 selalu 0, jadi tidak pernah melebihi target: penjaga `return 0` di `cariMarginImpas` tidak tercapai, dibiarkan sebagai pertahanan (keputusan menghapusnya ada di tangan Vinson).
- Penjaga `return null` **tercapai**: OP dengan omzet < PTKP + 1.000 membayar pajak umum 0 di margin berapa pun. Versi sebelumnya spec ini menyebut penjaga ini tak tercapai dan AC5 meminta impas 0 untuk OP omzet ≤ 500 jt; keduanya keliru (UI menampilkan "≈ 0,0%" padahal kedua skema sama nol sampai margin PTKP/omzet). Ditemukan 2026-11-20 lewat mutant `<` → `<=` yang selamat di baris ini.

## Out of scope
- Status PTKP untuk PT Perorangan/badan (diabaikan).
- Pembulatan PKP ke ribuan untuk badan.

## Assumptions
- `marginPersen` dalam persen 0–100; pemanggil (UI) membatasinya.
