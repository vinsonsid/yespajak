import type { Metadata } from "next";
import { Card, CatatanInfo, JudulHalaman } from "@/components/ui";

export const metadata: Metadata = {
  title: "Kalender Kewajiban Pajak",
  description:
    "Batas waktu setor dan lapor pajak bulanan serta SPT Tahunan untuk UMKM dan perusahaan Indonesia.",
};

const KEWAJIBAN_BULANAN = [
  {
    jenis: "PPh Pasal 21/26 (gaji karyawan)",
    setor: "Tanggal 10 bulan berikutnya",
    lapor: "Tanggal 20 bulan berikutnya",
  },
  {
    jenis: "PPh Pasal 23/26, PPh Pasal 4 ayat (2) — bupot unifikasi",
    setor: "Tanggal 10 bulan berikutnya",
    lapor: "Tanggal 20 bulan berikutnya",
  },
  {
    jenis: "PPh Pasal 25 (angsuran bulanan)",
    setor: "Tanggal 15 bulan berikutnya",
    lapor: "Dianggap lapor jika sudah setor dan mendapat validasi NTPN",
  },
  {
    jenis: "PPh Final UMKM 0,5% (PP 55/2022 jo. PP 20/2026)",
    setor: "Tanggal 15 bulan berikutnya",
    lapor: "Dianggap lapor jika sudah setor dan mendapat validasi NTPN",
  },
  {
    jenis: "PPN & PPnBM (SPT Masa PPN)",
    setor: "Akhir bulan berikutnya, sebelum SPT dilaporkan",
    lapor: "Akhir bulan berikutnya",
  },
];

const KEWAJIBAN_TAHUNAN = [
  {
    jenis: "SPT Tahunan PPh Orang Pribadi (termasuk pemilik UMKM perorangan)",
    batas: "31 Maret tahun berikutnya",
  },
  {
    jenis: "SPT Tahunan PPh Badan (PT, CV, koperasi, yayasan)",
    batas: "30 April tahun berikutnya (akhir bulan ke-4 setelah tahun buku berakhir)",
  },
  {
    jenis: "Pelunasan PPh Pasal 29 (kurang bayar SPT Tahunan)",
    batas: "Sebelum SPT Tahunan disampaikan",
  },
];

export default function KalenderPajak() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JudulHalaman
        eyebrow="Referensi"
        judul="Kalender Kewajiban Pajak"
        deskripsi="Ringkasan batas waktu penyetoran dan pelaporan pajak yang paling sering berlaku bagi UMKM dan perusahaan. Jika batas waktu jatuh pada hari libur, pembayaran/pelaporan dapat dilakukan pada hari kerja berikutnya."
      />

      <section>
        <h2 className="mb-3 text-xl font-bold text-slate-900">
          Kewajiban Bulanan (Masa)
        </h2>
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <th className="px-5 py-3 font-semibold">Jenis pajak</th>
                <th className="px-5 py-3 font-semibold">Batas setor</th>
                <th className="px-5 py-3 font-semibold">Batas lapor</th>
              </tr>
            </thead>
            <tbody>
              {KEWAJIBAN_BULANAN.map((k) => (
                <tr key={k.jenis} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{k.jenis}</td>
                  <td className="px-5 py-3.5 text-slate-600">{k.setor}</td>
                  <td className="px-5 py-3.5 text-slate-600">{k.lapor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-bold text-slate-900">
          Kewajiban Tahunan
        </h2>
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <th className="px-5 py-3 font-semibold">Kewajiban</th>
                <th className="px-5 py-3 font-semibold">Batas waktu</th>
              </tr>
            </thead>
            <tbody>
              {KEWAJIBAN_TAHUNAN.map((k) => (
                <tr key={k.jenis} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{k.jenis}</td>
                  <td className="px-5 py-3.5 text-slate-600">{k.batas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <div className="mt-8 space-y-4">
        <CatatanInfo>
          Sejak 2025, administrasi pajak (pendaftaran, pembayaran, pelaporan,
          bukti potong) dilakukan melalui sistem <b>Coretax DJP</b> di{" "}
          <a
            className="font-semibold underline"
            href="https://coretaxdjp.pajak.go.id"
            target="_blank"
            rel="noopener noreferrer"
          >
            coretaxdjp.pajak.go.id
          </a>
          . Sanksi keterlambatan lapor SPT Masa: Rp100.000–Rp500.000 per SPT;
          keterlambatan setor dikenai bunga sanksi administrasi per bulan.
        </CatatanInfo>
      </div>
    </div>
  );
}
