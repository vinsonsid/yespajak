"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RupiahInput from "@/components/RupiahInput";
import ShareBar from "@/components/ShareBar";
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
import { bacaParams } from "@/lib/prefill";

const JENIS_WP: [JenisWPUMKM, string, string][] = [
  [
    "orang-pribadi",
    "Orang Pribadi",
    "Dapat pembebasan omzet Rp500 juta pertama; tarif final tanpa batas waktu.",
  ],
  [
    "pt-perorangan",
    "PT Perorangan",
    "Tarif final tanpa batas waktu, namun tanpa pembebasan Rp500 juta (SE-20/PJ/2022).",
  ],
  [
    "badan",
    "Badan lainnya (CV, firma, koperasi, PT)",
    "Tanpa pembebasan Rp500 juta; jangka waktu pemakaian tarif final terbatas.",
  ],
];

export default function KalkulatorUMKM() {
  const [jenis, setJenis] = useState<JenisWPUMKM>("orang-pribadi");
  const [omzet, setOmzet] = useState(0);

  useEffect(() => {
    bacaParams({
      jenis: (v) => {
        if (["orang-pribadi", "pt-perorangan", "badan"].includes(v))
          setJenis(v as JenisWPUMKM);
      },
      omzet: (v) => setOmzet(Number(v) || 0),
    });
  }, []);

  const hasil = hitungUMKM(jenis, omzet);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JudulHalaman
        eyebrow="Kalkulator"
        judul="PPh Final UMKM 0,5%"
        deskripsi="Estimasi PPh final berdasarkan PP 55/2022 jo. PP 20/2026 untuk wajib pajak dengan peredaran bruto sampai Rp4,8 miliar setahun. Khusus wajib pajak orang pribadi, omzet Rp500 juta pertama tidak dikenai pajak."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="print:hidden">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Data Usaha</h2>
          <div className="space-y-4">
            <div>
              <span className="block text-sm font-semibold text-slate-700">
                Jenis wajib pajak
              </span>
              <div className="mt-1.5 space-y-2">
                {JENIS_WP.map(([nilai, label, keterangan]) => (
                  <button
                    key={nilai}
                    type="button"
                    onClick={() => setJenis(nilai)}
                    aria-pressed={jenis === nilai}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left transition ${
                      jenis === nilai
                        ? "border-sky-700 bg-sky-50"
                        : "border-slate-300 bg-white hover:border-slate-400"
                    }`}
                  >
                    <span
                      className={`block text-sm font-semibold ${
                        jenis === nilai ? "text-sky-900" : "text-slate-700"
                      }`}
                    >
                      {label}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {keterangan}
                    </span>
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

          <ShareBar params={{ jenis, omzet }} />

          {hasil.melebihiBatas ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
              Omzet Anda melebihi {formatRupiah(BATAS_OMZET_UMKM)} setahun,
              sehingga <b>tidak lagi memenuhi syarat</b> tarif final 0,5%.
              Gunakan tarif umum: Pasal 17 (orang pribadi) atau 22% (badan) —
              lihat{" "}
              <Link className="font-semibold underline" href="/kalkulator/pph-badan">
                Kalkulator PPh Badan
              </Link>
              .
            </div>
          ) : (
            <CatatanInfo>
              Setoran dilakukan per masa pajak: 0,5% × omzet bulan berjalan,
              paling lambat tanggal 15 bulan berikutnya. Sejak PP 20/2026,
              orang pribadi dan PT Perorangan dapat memakai tarif final ini{" "}
              <b>tanpa batas waktu</b>; koperasi maksimal 4 tahun sejak
              terdaftar. Pembebasan omzet Rp500 juta pertama hanya berlaku
              untuk wajib pajak <b>orang pribadi</b> — PT Perorangan tetap
              membayar 0,5% dari rupiah pertama.
            </CatatanInfo>
          )}
        </div>
      </div>
    </div>
  );
}
