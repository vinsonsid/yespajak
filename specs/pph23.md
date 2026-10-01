# PPh Pasal 23 dan PPh final sewa tanah/bangunan

## Intent
Pemotong menghitung PPh 23 atas bunga, royalti, hadiah (15%), sewa harta selain tanah/bangunan dan jasa (2%), dengan kenaikan 100% bagi penerima tanpa NPWP; serta PPh final Pasal 4 ayat (2) 10% untuk sewa tanah/bangunan yang tidak terkena kenaikan non-NPWP. Dasar: UU PPh Pasal 23 ayat (1) dan (1a), PMK 141/PMK.03/2015, PP 34/2017.

## Layer placement
- core: `src/core/pajak/pph23.ts` (`hitungPPh23`, `OBJEK_PPH23`, tipe). Dipindahkan dari `src/lib/pajak/pph23.ts` tanpa perubahan rumus.
- app: `KalkulatorPPh23.tsx` hanya mengganti path import.

## Acceptance criteria

### AC1: tabel objek
Given `OBJEK_PPH23`
Then bunga/royalti/hadiah tarif 15 non-final; sewa-harta/jasa tarif 2 non-final; sewa-tanah-bangunan tarif 10 final. Tepat enam objek.

### AC2: objek 15% dengan NPWP
Given bunga bruto Rp10.000.000, punya NPWP
When dihitung
Then `tarifDipakaiPersen` 15, `kenaikanNonNPWP` false, `pph` 1.500.000, `diterimaBersih` 8.500.000, `info` sama dengan `OBJEK_PPH23.bunga`

### AC3: objek 15% tanpa NPWP naik 100%
Given royalti bruto Rp10.000.000, tanpa NPWP
When dihitung
Then `tarifDipakaiPersen` 30, `kenaikanNonNPWP` true, `pph` 3.000.000, `diterimaBersih` 7.000.000

### AC4: objek 2% dengan dan tanpa NPWP
Given jasa bruto Rp10.000.000
When dihitung dengan NPWP / tanpa NPWP
Then `pph` 200.000 / 400.000; sama untuk sewa-harta

### AC5: sewa tanah/bangunan final 10%, tanpa kenaikan non-NPWP
Given sewa-tanah-bangunan bruto Rp10.000.000, tanpa NPWP
When dihitung
Then `tarifDipakaiPersen` 10, `kenaikanNonNPWP` false, `pph` 1.000.000, `info.final` true

### AC6: bruto nol
Given objek apa pun, bruto 0
Then `pph` 0, `diterimaBersih` 0

## Edge cases and failure modes
- Hadiah tanpa NPWP: 30% (bukan objek PPh 21).
- Bruto pecahan: pph = bruto × tarif / 100 tanpa pembulatan.

## Out of scope
- Dividen (dikecualikan/final 10% disetor sendiri).
- Jasa dengan DPP khusus (mis. jasa katering, konstruksi: PPh final 4(2)).
- Validasi input negatif/non-finite.

## Assumptions
- Pemanggil memberikan angka finite ≥ 0.
