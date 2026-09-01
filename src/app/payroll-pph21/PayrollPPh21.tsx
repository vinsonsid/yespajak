"use client";

import { useState } from "react";
import { Card, CatatanInfo, JudulHalaman } from "@/components/ui";
import { formatPersen, formatRupiah, parseRupiah } from "@/lib/format";
import { hitungPPh21Bulanan } from "@/lib/pajak/pph21";
import { StatusPTKP } from "@/lib/pajak/ter";

const STATUS_VALID: StatusPTKP[] = [
  "TK/0",
  "TK/1",
  "TK/2",
  "TK/3",
  "K/0",
  "K/1",
  "K/2",
  "K/3",
];

const CONTOH = `Andi Wijaya\tTK/0\t8500000
Budi Santoso\tK/1\t12000000
Citra Lestari\tK/2\t15500000
Dewi Anggraini\tTK/1\t6750000
Eko Prasetyo\tK/3\t25000000`;

interface BarisKaryawan {
  nomor: number;
  nama: string;
  status: StatusPTKP | null;
  bruto: number;
  error?: string;
}

function parseInput(teks: string): BarisKaryawan[] {
  return teks
    .split(/\r?\n/)
    .map((baris) => baris.trim())
    .filter((baris) => baris !== "")
    .map((baris, i) => {
      const kolom = baris.split(/\t|;|,(?!\d{3})/).map((k) => k.trim());
      if (kolom.length < 3) {
        return {
          nomor: i + 1,
          nama: kolom[0] ?? "",
          status: null,
          bruto: 0,
          error: "Butuh 3 kolom: nama, status PTKP, gaji bruto",
        };
      }
      const nama = kolom[0];
      const statusMentah = kolom[1].toUpperCase().replace(/\s/g, "");
      const status = (STATUS_VALID as string[]).includes(statusMentah)
        ? (statusMentah as StatusPTKP)
        : null;
      const bruto = parseRupiah(kolom.slice(2).join(""));
      if (!status) {
        return {
          nomor: i + 1,
          nama,
          status: null,
          bruto,
          error: `Status "${kolom[1]}" tidak dikenal (pakai TK/0–TK/3, K/0–K/3)`,
        };
      }
      return { nomor: i + 1, nama, status, bruto };
    });
}

export default function PayrollPPh21() {
  const [teks, setTeks] = useState("");

  const barisan = parseInput(teks);
  const valid = barisan.filter((b) => !b.error && b.status !== null);
  const hasil = valid.map((b) => ({
    ...b,
    hitung: hitungPPh21Bulanan(b.status as StatusPTKP, b.bruto),
  }));
  const totalBruto = hasil.reduce((a, b) => a + b.bruto, 0);
  const totalPPh = hasil.reduce((a, b) => a + b.hitung.pph21, 0);
  const adaError = barisan.some((b) => b.error);

  function unduhCSV() {
    const kepala = "Nama;Status PTKP;Kategori TER;Bruto Sebulan;Tarif (%);PPh 21;Take Home\n";
    const isi = hasil
      .map((b) =>
        [
          b.nama,
          b.status,
          b.hitung.kategori,
          Math.round(b.bruto),
          String(b.hitung.tarifPersen).replace(".", ","),
          Math.round(b.hitung.pph21),
          Math.round(b.bruto - b.hitung.pph21),
        ].join(";")
      )
      .join("\n");
    const blob = new Blob(["﻿" + kepala + isi], {
      type: "text/csv;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pph21-payroll.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JudulHalaman
        eyebrow="Alat Tim Finance"
        judul="Payroll PPh 21 Massal"
        deskripsi="Hitung potongan PPh 21 bulanan (TER) seluruh karyawan sekaligus. Salin data dari Excel/Google Sheets (kolom: nama, status PTKP, gaji bruto sebulan) lalu tempel di bawah. Semua dihitung di browser Anda — data tidak dikirim ke mana pun."
      />

      <Card className="print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Data Karyawan</h2>
          <button
            type="button"
            onClick={() => setTeks(CONTOH)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-sky-400 hover:text-sky-800"
          >
            Isi data contoh
          </button>
        </div>
        <textarea
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          rows={8}
          placeholder={"Tempel dari Excel, satu karyawan per baris:\nAndi Wijaya\tTK/0\t8500000\nBudi Santoso\tK/1\t12000000"}
          className="mt-3 w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
        <p className="mt-2 text-xs text-slate-500">
          Pemisah kolom: tab (hasil tempel Excel), titik koma, atau koma. Angka
          gaji boleh memakai titik ribuan.
        </p>
      </Card>

      {adaError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <p className="font-semibold">Baris bermasalah (dilewati):</p>
          <ul className="mt-1 list-inside list-disc">
            {barisan
              .filter((b) => b.error)
              .map((b) => (
                <li key={b.nomor}>
                  Baris {b.nomor} ({b.nama || "tanpa nama"}): {b.error}
                </li>
              ))}
          </ul>
        </div>
      )}

      {hasil.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">
              Hasil — {hasil.length} karyawan
            </h2>
            <div className="flex gap-2 print:hidden">
              <button
                type="button"
                onClick={unduhCSV}
                className="rounded-lg bg-sky-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-800"
              >
                ⬇ Unduh CSV
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:text-sky-800"
              >
                🖨️ Cetak / PDF
              </button>
            </div>
          </div>

          <Card className="overflow-x-auto p-0">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="px-4 py-3 font-semibold">Nama</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Kategori</th>
                  <th className="px-4 py-3 text-right font-semibold">Bruto sebulan</th>
                  <th className="px-4 py-3 text-right font-semibold">Tarif TER</th>
                  <th className="px-4 py-3 text-right font-semibold">PPh 21</th>
                  <th className="px-4 py-3 text-right font-semibold">Take home</th>
                </tr>
              </thead>
              <tbody>
                {hasil.map((b) => (
                  <tr
                    key={`${b.nomor}-${b.nama}`}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-4 py-2.5 font-semibold text-slate-800">
                      {b.nama}
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">{b.status}</td>
                    <td className="px-4 py-2.5 text-slate-600">
                      {b.hitung.kategori}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-slate-600">
                      {formatRupiah(b.bruto)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-slate-600">
                      {formatPersen(b.hitung.tarifPersen)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-slate-800">
                      {formatRupiah(b.hitung.pph21)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-slate-600">
                      {formatRupiah(b.bruto - b.hitung.pph21)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold text-slate-900">
                  <td className="px-4 py-3" colSpan={3}>
                    Total
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatRupiah(totalBruto)}
                  </td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatRupiah(totalPPh)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatRupiah(totalBruto - totalPPh)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </Card>

          <div className="mt-4">
            <CatatanInfo>
              Perhitungan memakai TER bulanan (masa Januari–November). Untuk
              masa Desember, gunakan perhitungan setahun di{" "}
              <a className="font-semibold underline" href="/kalkulator/pph21">
                Kalkulator PPh 21
              </a>{" "}
              per karyawan. Setor hasil potongan paling lambat tanggal 10 bulan
              berikutnya melalui Coretax.
            </CatatanInfo>
          </div>
        </div>
      )}
    </div>
  );
}
