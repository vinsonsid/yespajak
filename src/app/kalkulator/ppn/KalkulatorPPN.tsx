"use client";

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
import { hitungPPN } from "@/lib/pajak/ppn";
import { bacaParams } from "@/lib/prefill";

function TombolPilihan<T extends string>({
  label,
  nilai,
  pilihan,
  onChange,
}: {
  label: string;
  nilai: T;
  pilihan: readonly [T, string][];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <span className="block text-sm font-semibold text-slate-700">{label}</span>
      <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
        {pilihan.map(([v, teks]) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            aria-pressed={nilai === v}
            className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
              nilai === v
                ? "border-sky-700 bg-sky-50 text-sky-900"
                : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
            }`}
          >
            {teks}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function KalkulatorPPN() {
  const [nilai, setNilai] = useState(0);
  const [arah, setArah] = useState<"tambah" | "pisah">("tambah");
  const [jenis, setJenis] = useState<"umum" | "mewah">("umum");

  useEffect(() => {
    bacaParams({
      nilai: (v) => setNilai(Number(v) || 0),
      arah: (v) => {
        if (v === "tambah" || v === "pisah") setArah(v);
      },
      jenis: (v) => {
        if (v === "umum" || v === "mewah") setJenis(v);
      },
    });
  }, []);

  const hasil = hitungPPN(nilai, {
    termasukPPN: arah === "pisah",
    barangMewah: jenis === "mewah",
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JudulHalaman
        eyebrow="Kalkulator"
        judul="PPN 11% / 12%"
        deskripsi="Hitung PPN sesuai PMK 131/2024: barang dan jasa umum dikenai 12% atas DPP nilai lain (11/12 × harga jual) sehingga efektif 11%, sedangkan barang mewah objek PPnBM dikenai 12% penuh."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="print:hidden">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Data Transaksi</h2>
          <div className="space-y-4">
            <TombolPilihan
              label="Jenis perhitungan"
              nilai={arah}
              onChange={setArah}
              pilihan={[
                ["tambah", "Harga belum termasuk PPN"],
                ["pisah", "Harga sudah termasuk PPN"],
              ]}
            />
            <TombolPilihan
              label="Jenis barang/jasa"
              nilai={jenis}
              onChange={setJenis}
              pilihan={[
                ["umum", "Umum (efektif 11%)"],
                ["mewah", "Barang mewah (12%)"],
              ]}
            />
            <RupiahInput
              id="nilai-transaksi"
              label={
                arah === "tambah"
                  ? "Harga jual (sebelum PPN)"
                  : "Harga total (termasuk PPN)"
              }
              value={nilai}
              onChange={setNilai}
            />
          </div>
        </Card>

        <div className="space-y-4">
          <HasilUtama
            label="PPN terutang"
            nilai={formatRupiah(hasil.ppn)}
            keterangan={`Tarif efektif ${formatPersen(hasil.tarifEfektifPersen)} dari harga jual`}
          />
          <Card>
            <BarisHasil label="Harga jual (sebelum PPN)" nilai={hasil.hargaBarang} />
            <BarisHasil
              label={
                jenis === "umum"
                  ? "DPP nilai lain (11/12 × harga jual)"
                  : "DPP (harga jual penuh)"
              }
              nilai={hasil.dpp}
            />
            <div className="flex items-baseline justify-between gap-4 py-1.5 text-slate-600">
              <span className="text-sm">Tarif PPN dikalikan DPP</span>
              <span className="font-semibold">12%</span>
            </div>
            <div className="my-2 border-t border-slate-200" />
            <BarisHasil label="PPN" nilai={hasil.ppn} tebal />
            <BarisHasil label="Total harga termasuk PPN" nilai={hasil.totalDenganPPN} tebal />
          </Card>
          <ShareBar params={{ nilai, arah, jenis }} />
          <CatatanInfo>
            Barang mewah = barang yang tergolong objek PPnBM (kendaraan
            bermotor tertentu, hunian mewah, pesawat, kapal pesiar, dll.).
            Barang kebutuhan pokok, jasa pendidikan, dan jasa kesehatan tertentu
            tetap dibebaskan dari PPN.
          </CatatanInfo>
        </div>
      </div>
    </div>
  );
}
