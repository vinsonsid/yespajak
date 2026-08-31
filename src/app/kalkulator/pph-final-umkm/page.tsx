"use client";

import { useState } from "react";
import RupiahInput from "@/components/RupiahInput";
import {
  BarisHasil,
  Card,
  CatatanInfo,
  HasilUtama,
  JudulHalaman,
} from "@/components/ui";
import { formatPersen, formatRupiah } from "@/lib/format";
import {
  BATAS_OMZET_UMKM,
  JenisWPUMKM,
  hitungUMKM,
} from "@/lib/pajak/umkm";

export default function KalkulatorUMKM() {
  const [jenis, setJenis] = useState<JenisWPUMKM>("orang-pribadi");
  const [omzet, setOmzet] = useState(0);

  const hasil = hitungUMKM(jenis, omzet);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JudulHalaman
        eyebrow="Kalkulator"
        judul="PPh Final UMKM 0,5%"
        deskripsi="Estimasi PPh final berdasarkan PP 55/2022 jo. PP 20/2026 untuk wajib pajak dengan peredaran bruto sampai Rp4,8 miliar setahun. Orang pribadi mendapat pembebasan pajak atas omzet Rp500 juta pertama."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-bold text-slate-900">Data Usaha</h2>
          <div className="space-y-4">
            <div>
              <span className="block text-sm font-semibold text-slate-700">
                Jenis wajib pajak
              </span>
              <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
                {(
                  [
                    ["orang-pribadi", "Orang Pribadi / PT Perorangan"],
                    ["badan", "Badan (CV, firma, koperasi, PT)"],
                  ] as const
                ).map(([nilai, label]) => (
                  <button
                    key={nilai}
                    type="button"
                    onClick={() => setJenis(nilai)}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                      jenis === nilai
                        ? "border-sky-700 bg-sky-50 text-sky-900"
                        : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <RupiahInput
              id="omzet"
              label="Peredaran bruto (omzet) setahun"
              value={omzet}
              onChange={setOmzet}
              hint="Seluruh penjualan/pendapatan usaha sebelum dikurangi biaya apa pun."
            />
          </div>
        </Card>

        <div className="space-y-4">
          <HasilUtama
            label="PPh final terutang setahun"
            nilai={formatRupiah(hasil.pphFinal)}
            keterangan={`Tarif efektif atas seluruh omzet: ${formatPersen(hasil.tarifEfektifPersen)}`}
          />
          <Card>
            <BarisHasil label="Omzet setahun" nilai={hasil.omzetSetahun} />
            {jenis === "orang-pribadi" && (
              <BarisHasil
                label="Omzet dibebaskan (Rp500 juta pertama)"
                nilai={hasil.omzetBebas}
                minus
              />
            )}
            <BarisHasil label="Omzet kena pajak" nilai={hasil.omzetKenaPajak} />
            <div className="my-2 border-t border-slate-200" />
            <BarisHasil label="PPh final 0,5%" nilai={hasil.pphFinal} tebal />
            <BarisHasil
              label="Rata-rata setoran per bulan (indikatif)"
              nilai={hasil.pphFinal / 12}
            />
          </Card>

          {hasil.melebihiBatas ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
              Omzet Anda melebihi {formatRupiah(BATAS_OMZET_UMKM)} setahun,
              sehingga <b>tidak lagi memenuhi syarat</b> tarif final 0,5%.
              Gunakan tarif umum: Pasal 17 (orang pribadi) atau 22% (badan) —
              lihat <a className="font-semibold underline" href="/kalkulator/pph-badan">Kalkulator PPh Badan</a>.
            </div>
          ) : (
            <CatatanInfo>
              Setoran dilakukan per masa pajak: 0,5% × omzet bulan berjalan,
              paling lambat tanggal 15 bulan berikutnya. Sejak PP 20/2026,
              orang pribadi dan PT Perorangan dapat memakai tarif final ini{" "}
              <b>tanpa batas waktu</b>; koperasi maksimal 4 tahun sejak
              terdaftar.
            </CatatanInfo>
          )}
        </div>
      </div>
    </div>
  );
}
