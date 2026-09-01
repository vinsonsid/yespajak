"use client";

import { useEffect, useState } from "react";
import RupiahInput from "@/components/RupiahInput";
import ShareBar from "@/components/ShareBar";
import {
  BarisHasil,
  Card,
  CatatanInfo,
  JudulHalaman,
} from "@/components/ui";
import { formatPersen, formatRupiah } from "@/lib/format";
import { bacaParams } from "@/lib/prefill";
import { bandingkan } from "@/lib/pajak/perbandingan";
import { BATAS_OMZET_UMKM, JenisWPUMKM } from "@/lib/pajak/umkm";
import { PTKP, StatusPTKP } from "@/lib/pajak/ter";

const SEMUA_STATUS = Object.keys(PTKP) as StatusPTKP[];

export default function KalkulatorBanding() {
  const [jenis, setJenis] = useState<JenisWPUMKM>("orang-pribadi");
  const [status, setStatus] = useState<StatusPTKP>("TK/0");
  const [omzet, setOmzet] = useState(0);
  const [margin, setMargin] = useState(20);

  useEffect(() => {
    bacaParams({
      jenis: (v) => {
        if (["orang-pribadi", "pt-perorangan", "badan"].includes(v))
          setJenis(v as JenisWPUMKM);
      },
      status: (v) => {
        if ((SEMUA_STATUS as string[]).includes(v)) setStatus(v as StatusPTKP);
      },
      omzet: (v) => setOmzet(Number(v) || 0),
      margin: (v) => setMargin(Math.min(Math.max(Number(v) || 0, 0), 100)),
    });
  }, []);

  const hasil = bandingkan(jenis, omzet, margin, status);
  const melebihiBatas = omzet > BATAS_OMZET_UMKM;

  const kartuRekomendasi = melebihiBatas
    ? {
        warna: "border-red-200 bg-red-50 text-red-900",
        teks: (
          <>
            Omzet melebihi {formatRupiah(BATAS_OMZET_UMKM)}, sehingga skema
            final 0,5% <b>tidak tersedia</b> — wajib memakai tarif umum.
          </>
        ),
      }
    : hasil.rekomendasi === "umkm"
      ? {
          warna: "border-emerald-200 bg-emerald-50 text-emerald-900",
          teks: (
            <>
              Dengan margin laba {formatPersen(margin)}, skema{" "}
              <b>PPh Final UMKM 0,5% lebih hemat {formatRupiah(hasil.hemat)}</b>{" "}
              per tahun dibanding tarif umum.
            </>
          ),
        }
      : hasil.rekomendasi === "umum"
        ? {
            warna: "border-emerald-200 bg-emerald-50 text-emerald-900",
            teks: (
              <>
                Dengan margin laba {formatPersen(margin)}, skema{" "}
                <b>tarif umum lebih hemat {formatRupiah(-hasil.hemat)}</b> per
                tahun dibanding PPh final 0,5%.
              </>
            ),
          }
        : {
            warna: "border-slate-200 bg-slate-100 text-slate-700",
            teks: (
              <>
                Kedua skema menghasilkan pajak yang hampir sama pada margin{" "}
                {formatPersen(margin)} — pertimbangkan faktor kemudahan
                administrasi.
              </>
            ),
          };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JudulHalaman
        eyebrow="Perencanaan Pajak"
        judul="UMKM 0,5% vs Tarif Umum"
        deskripsi="Bandingkan PPh Final UMKM 0,5% dari omzet dengan tarif umum (Pasal 17 progresif untuk orang pribadi, atau 22% dengan fasilitas Pasal 31E untuk badan) — dan temukan pada margin laba berapa Anda sebaiknya pindah skema."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="print:hidden">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Data Usaha</h2>
          <div className="space-y-4">
            <div>
              <span className="block text-sm font-semibold text-slate-700">
                Jenis wajib pajak
              </span>
              <div className="mt-1.5 grid gap-2 sm:grid-cols-3">
                {(
                  [
                    ["orang-pribadi", "Orang Pribadi"],
                    ["pt-perorangan", "PT Perorangan"],
                    ["badan", "Badan lainnya"],
                  ] as const
                ).map(([nilai, label]) => (
                  <button
                    key={nilai}
                    type="button"
                    onClick={() => setJenis(nilai)}
                    aria-pressed={jenis === nilai}
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

            {jenis === "orang-pribadi" && (
              <div>
                <label
                  htmlFor="status-banding"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Status PTKP
                </label>
                <select
                  id="status-banding"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StatusPTKP)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base font-semibold text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                >
                  {SEMUA_STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s} — PTKP {formatRupiah(PTKP[s])}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <RupiahInput
              id="omzet-banding"
              label="Peredaran bruto (omzet) setahun"
              value={omzet}
              onChange={setOmzet}
            />

            <div>
              <label
                htmlFor="margin"
                className="block text-sm font-semibold text-slate-700"
              >
                Margin laba bersih: {formatPersen(margin)}
              </label>
              <input
                id="margin"
                type="range"
                min={0}
                max={60}
                step={1}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="mt-2 w-full accent-sky-700"
              />
              <p className="mt-1 text-xs text-slate-500">
                Laba bersih fiskal ÷ omzet. Estimasi laba bersih:{" "}
                {formatRupiah(hasil.labaBersih)} setahun.
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div
              className={`rounded-xl px-5 py-4 ${
                !melebihiBatas && hasil.pajakUMKM <= hasil.pajakUmum
                  ? "bg-sky-900 text-white"
                  : "border border-slate-200 bg-white"
              }`}
            >
              <p
                className={`text-sm font-medium ${!melebihiBatas && hasil.pajakUMKM <= hasil.pajakUmum ? "text-sky-200" : "text-slate-500"}`}
              >
                PPh Final UMKM 0,5%
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums">
                {melebihiBatas ? "—" : formatRupiah(hasil.pajakUMKM)}
              </p>
            </div>
            <div
              className={`rounded-xl px-5 py-4 ${
                melebihiBatas || hasil.pajakUmum < hasil.pajakUMKM
                  ? "bg-sky-900 text-white"
                  : "border border-slate-200 bg-white"
              }`}
            >
              <p
                className={`text-sm font-medium ${melebihiBatas || hasil.pajakUmum < hasil.pajakUMKM ? "text-sky-200" : "text-slate-500"}`}
              >
                Tarif Umum
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums">
                {formatRupiah(hasil.pajakUmum)}
              </p>
            </div>
          </div>

          <div
            className={`rounded-lg border px-4 py-3 text-sm ${kartuRekomendasi.warna}`}
          >
            {kartuRekomendasi.teks}
          </div>

          <Card>
            <BarisHasil label="Omzet setahun" nilai={hasil.omzet} />
            <BarisHasil
              label={`Laba bersih (margin ${formatPersen(margin)})`}
              nilai={hasil.labaBersih}
            />
            <div className="my-2 border-t border-slate-200" />
            <BarisHasil label="Pajak skema UMKM 0,5%" nilai={hasil.pajakUMKM} />
            <BarisHasil label="Pajak skema tarif umum" nilai={hasil.pajakUmum} />
            {hasil.marginImpasPersen !== null && !melebihiBatas && (
              <div className="flex items-baseline justify-between gap-4 py-1.5 text-slate-600">
                <span className="text-sm">Margin impas (pajak sama besar)</span>
                <span className="font-semibold">
                  ≈ {formatPersen(hasil.marginImpasPersen, 1)}
                </span>
              </div>
            )}
          </Card>

          <ShareBar params={{ jenis, status, omzet, margin }} />

          <CatatanInfo>
            Margin di bawah margin impas → tarif umum lebih hemat; di atasnya →
            skema 0,5% lebih hemat. Perhitungan tarif umum orang pribadi
            mengasumsikan pembukuan (laba bersih fiskal), belum termasuk norma
            penghitungan (NPPN), zakat, atau kredit pajak. Konsultasikan
            sebelum berpindah skema — pilihan tarif umum tidak dapat kembali ke
            skema final di tahun berikutnya.
          </CatatanInfo>
        </div>
      </div>
    </div>
  );
}
