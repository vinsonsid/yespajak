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
import { bacaParams } from "@/lib/prefill";
import {
  OBJEK_PPH23,
  ObjekPPh23,
  hitungPPh23,
} from "@/lib/pajak/pph23";

const SEMUA_OBJEK = Object.keys(OBJEK_PPH23) as ObjekPPh23[];

export default function KalkulatorPPh23() {
  const [objek, setObjek] = useState<ObjekPPh23>("jasa");
  const [bruto, setBruto] = useState(0);
  const [punyaNPWP, setPunyaNPWP] = useState(true);

  useEffect(() => {
    bacaParams({
      objek: (v) => {
        if ((SEMUA_OBJEK as string[]).includes(v)) setObjek(v as ObjekPPh23);
      },
      bruto: (v) => setBruto(Number(v) || 0),
      npwp: (v) => setPunyaNPWP(v !== "0"),
    });
  }, []);

  const hasil = hitungPPh23(objek, bruto, punyaNPWP);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JudulHalaman
        eyebrow="Kalkulator"
        judul="PPh 23 & Sewa Tanah/Bangunan"
        deskripsi="Hitung pemotongan PPh Pasal 23 atas bunga, royalti, hadiah, sewa harta, dan imbalan jasa (termasuk kenaikan tarif 100% bila penerima tidak ber-NPWP), serta PPh final Pasal 4 ayat (2) atas sewa tanah/bangunan."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="print:hidden">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Data Transaksi
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="objek-pajak"
                className="block text-sm font-semibold text-slate-700"
              >
                Jenis penghasilan yang dibayarkan
              </label>
              <select
                id="objek-pajak"
                value={objek}
                onChange={(e) => setObjek(e.target.value as ObjekPPh23)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base font-semibold text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              >
                {SEMUA_OBJEK.map((o) => (
                  <option key={o} value={o}>
                    {OBJEK_PPH23[o].label} — {OBJEK_PPH23[o].tarifPersen}%
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-500">
                {hasil.info.keterangan}
              </p>
            </div>

            <RupiahInput
              id="bruto-pph23"
              label="Jumlah bruto pembayaran"
              value={bruto}
              onChange={setBruto}
              hint="Nilai sebelum PPN. Untuk jasa, tidak termasuk penggantian/reimbursement tertentu."
            />

            {!hasil.info.final && (
              <div>
                <span className="block text-sm font-semibold text-slate-700">
                  Penerima memiliki NPWP?
                </span>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {(
                    [
                      [true, "Ya, ber-NPWP"],
                      [false, "Tidak (tarif 2× lipat)"],
                    ] as const
                  ).map(([nilai, label]) => (
                    <button
                      key={String(nilai)}
                      type="button"
                      onClick={() => setPunyaNPWP(nilai)}
                      aria-pressed={punyaNPWP === nilai}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                        punyaNPWP === nilai
                          ? "border-sky-700 bg-sky-50 text-sky-900"
                          : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <HasilUtama
            label={
              hasil.info.final
                ? "PPh final Pasal 4(2) dipotong"
                : "PPh 23 dipotong"
            }
            nilai={formatRupiah(hasil.pph)}
            keterangan={`Tarif ${formatPersen(hasil.tarifDipakaiPersen)}${hasil.kenaikanNonNPWP ? " (naik 100% karena tanpa NPWP)" : ""}`}
          />
          <Card>
            <BarisHasil label="Jumlah bruto" nilai={hasil.bruto} />
            <div className="flex items-baseline justify-between gap-4 py-1.5 text-slate-600">
              <span className="text-sm">Tarif dipakai</span>
              <span className="font-semibold">
                {formatPersen(hasil.tarifDipakaiPersen)}
                {hasil.kenaikanNonNPWP && " (2 × tarif normal)"}
              </span>
            </div>
            <div className="my-2 border-t border-slate-200" />
            <BarisHasil
              label={hasil.info.final ? "PPh final dipotong" : "PPh 23 dipotong"}
              nilai={hasil.pph}
              tebal
            />
            <BarisHasil label="Diterima bersih penerima" nilai={hasil.diterimaBersih} />
          </Card>
          <ShareBar
            params={{ objek, bruto, npwp: punyaNPWP ? 1 : 0 }}
          />
          <CatatanInfo>
            Pemotong wajib membuat bukti potong unifikasi melalui Coretax,
            menyetor paling lambat tanggal 10 bulan berikutnya, dan melaporkan
            paling lambat tanggal 20. Dividen tidak dihitung di sini: dividen
            dalam negeri untuk WP badan dikecualikan dari objek PPh, dan untuk
            orang pribadi bebas pajak jika diinvestasikan kembali (jika tidak,
            final 10% disetor sendiri).
          </CatatanInfo>
        </div>
      </div>
    </div>
  );
}
