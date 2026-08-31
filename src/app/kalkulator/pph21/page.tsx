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
  hitungPPh21Bulanan,
  hitungPPh21Tahunan,
} from "@/lib/pajak/pph21";
import { PTKP, StatusPTKP } from "@/lib/pajak/ter";

const SEMUA_STATUS: StatusPTKP[] = [
  "TK/0",
  "TK/1",
  "TK/2",
  "TK/3",
  "K/0",
  "K/1",
  "K/2",
  "K/3",
];

function PilihStatus({
  value,
  onChange,
}: {
  value: StatusPTKP;
  onChange: (s: StatusPTKP) => void;
}) {
  return (
    <div>
      <label
        htmlFor="status-ptkp"
        className="block text-sm font-semibold text-slate-700"
      >
        Status PTKP
      </label>
      <select
        id="status-ptkp"
        value={value}
        onChange={(e) => onChange(e.target.value as StatusPTKP)}
        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base font-semibold text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
      >
        {SEMUA_STATUS.map((s) => (
          <option key={s} value={s}>
            {s} — PTKP {formatRupiah(PTKP[s])}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-slate-500">
        TK = tidak kawin, K = kawin; angka = jumlah tanggungan (maks. 3).
      </p>
    </div>
  );
}

export default function KalkulatorPPh21() {
  const [mode, setMode] = useState<"bulanan" | "tahunan">("bulanan");
  const [status, setStatus] = useState<StatusPTKP>("TK/0");
  const [brutoSebulan, setBrutoSebulan] = useState(0);
  const [brutoSetahun, setBrutoSetahun] = useState(0);
  const [iuranPensiun, setIuranPensiun] = useState(0);
  const [dipotongJanNov, setDipotongJanNov] = useState(0);

  const hasilBulanan = hitungPPh21Bulanan(status, brutoSebulan);
  const hasilTahunan = hitungPPh21Tahunan({
    status,
    brutoSetahun,
    iuranPensiunSetahun: iuranPensiun,
    pphSudahDipotong: dipotongJanNov,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JudulHalaman
        eyebrow="Kalkulator"
        judul="PPh 21 Karyawan"
        deskripsi="Hitung potongan PPh Pasal 21 pegawai tetap: potongan bulanan Januari–November memakai Tarif Efektif Rata-rata (TER) sesuai PP 58/2023, dan perhitungan setahun (masa Desember) memakai tarif progresif Pasal 17 UU PPh."
      />

      <div className="mb-6 inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        {(
          [
            ["bulanan", "Bulanan (TER, Jan–Nov)"],
            ["tahunan", "Setahun / Masa Desember"],
          ] as const
        ).map(([nilai, label]) => (
          <button
            key={nilai}
            type="button"
            onClick={() => setMode(nilai)}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              mode === nilai
                ? "bg-sky-900 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "bulanan" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="mb-4 text-lg font-bold text-slate-900">Data Karyawan</h2>
            <div className="space-y-4">
              <PilihStatus value={status} onChange={setStatus} />
              <RupiahInput
                id="bruto-sebulan"
                label="Penghasilan bruto sebulan"
                value={brutoSebulan}
                onChange={setBrutoSebulan}
                hint="Gaji pokok + tunjangan + lembur + premi asuransi yang dibayar pemberi kerja, sebelum potongan apa pun."
              />
            </div>
          </Card>

          <div className="space-y-4">
            <HasilUtama
              label="PPh 21 dipotong bulan ini"
              nilai={formatRupiah(hasilBulanan.pph21)}
              keterangan={`Kategori TER ${hasilBulanan.kategori} × tarif ${formatPersen(hasilBulanan.tarifPersen)}`}
            />
            <Card>
              <BarisHasil label="Penghasilan bruto sebulan" nilai={brutoSebulan} />
              <div className="flex items-baseline justify-between gap-4 py-1.5 text-slate-600">
                <span className="text-sm">Kategori TER (status {status})</span>
                <span className="font-semibold">Kategori {hasilBulanan.kategori}</span>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-1.5 text-slate-600">
                <span className="text-sm">Tarif efektif</span>
                <span className="font-semibold">
                  {formatPersen(hasilBulanan.tarifPersen)}
                </span>
              </div>
              <div className="my-2 border-t border-slate-200" />
              <BarisHasil label="PPh 21 sebulan" nilai={hasilBulanan.pph21} tebal />
              <BarisHasil
                label="Gaji diterima (take home, sebelum potongan lain)"
                nilai={Math.max(brutoSebulan - hasilBulanan.pph21, 0)}
              />
            </Card>
            <CatatanInfo>
              TER dipakai untuk masa Januari–November. Pada masa Desember,
              pemberi kerja menghitung ulang PPh 21 setahun dengan tarif Pasal
              17 lalu mengurangkan potongan Jan–Nov — gunakan tab{" "}
              <b>Setahun / Masa Desember</b> untuk itu.
            </CatatanInfo>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              Data Setahun
            </h2>
            <div className="space-y-4">
              <PilihStatus value={status} onChange={setStatus} />
              <RupiahInput
                id="bruto-setahun"
                label="Penghasilan bruto setahun"
                value={brutoSetahun}
                onChange={setBrutoSetahun}
                hint="Total gaji, tunjangan, bonus, dan THR selama satu tahun."
              />
              <RupiahInput
                id="iuran-pensiun"
                label="Iuran pensiun/JHT dibayar karyawan setahun"
                value={iuranPensiun}
                onChange={setIuranPensiun}
                hint="Iuran yang dipotong dari gaji karyawan (bukan bagian perusahaan). Isi 0 jika tidak ada."
              />
              <RupiahInput
                id="dipotong-jan-nov"
                label="PPh 21 sudah dipotong Jan–Nov (opsional)"
                value={dipotongJanNov}
                onChange={setDipotongJanNov}
                hint="Untuk menghitung kurang potong yang harus dipotong pada masa Desember."
              />
            </div>
          </Card>

          <div className="space-y-4">
            <HasilUtama
              label="PPh 21 terutang setahun"
              nilai={formatRupiah(hasilTahunan.pphSetahun)}
              keterangan={
                dipotongJanNov > 0
                  ? `Dipotong masa Desember: ${formatRupiah(hasilTahunan.pphMasaDesember ?? 0)}`
                  : undefined
              }
            />
            <Card>
              <BarisHasil label="Penghasilan bruto setahun" nilai={hasilTahunan.brutoSetahun} />
              <BarisHasil
                label="Biaya jabatan (5%, maks. Rp6 juta)"
                nilai={hasilTahunan.biayaJabatan}
                minus
              />
              <BarisHasil label="Iuran pensiun/JHT" nilai={hasilTahunan.iuranPensiun} minus />
              <div className="my-2 border-t border-slate-200" />
              <BarisHasil label="Penghasilan neto setahun" nilai={hasilTahunan.nettoSetahun} />
              <BarisHasil label={`PTKP (${status})`} nilai={hasilTahunan.ptkp} minus />
              <BarisHasil
                label="Penghasilan Kena Pajak (dibulatkan ribuan)"
                nilai={hasilTahunan.pkp}
                tebal
              />
              <div className="my-2 border-t border-slate-200" />
              {hasilTahunan.rincian.map((r) => (
                <BarisHasil
                  key={r.tarif}
                  label={`Lapisan ${formatPersen(r.tarif, 0)} × ${formatRupiah(r.dasarKena)}`}
                  nilai={r.pajak}
                />
              ))}
              <div className="my-2 border-t border-slate-200" />
              <BarisHasil label="PPh 21 setahun" nilai={hasilTahunan.pphSetahun} tebal />
              {dipotongJanNov > 0 && (
                <>
                  <BarisHasil label="Sudah dipotong Jan–Nov" nilai={dipotongJanNov} minus />
                  <BarisHasil
                    label="Dipotong masa Desember"
                    nilai={hasilTahunan.pphMasaDesember ?? 0}
                    tebal
                  />
                </>
              )}
            </Card>
            <CatatanInfo>
              Jika potongan Jan–Nov melebihi PPh setahun, kelebihannya
              dikembalikan kepada karyawan bersama gaji Desember. Perhitungan
              ini untuk pegawai tetap dengan penghasilan teratur; kondisi khusus
              (pindah kerja, penghasilan tidak teratur, natura) dapat berbeda.
            </CatatanInfo>
          </div>
        </div>
      )}
    </div>
  );
}
