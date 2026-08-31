import type { Metadata } from "next";
import Link from "next/link";
import { Card, JudulHalaman } from "@/components/ui";

export const metadata: Metadata = {
  title: "Edukasi Pajak",
  description:
    "Materi edukasi pajak ringkas untuk karyawan, tim finance, dan pemilik UMKM: PPh 21, TER, PPh Final UMKM, PPN, dan istilah pajak penting.",
};

const MATERI = [
  {
    id: "pph21",
    judul: "Memahami PPh 21 & skema TER",
    isi: [
      "PPh Pasal 21 adalah pajak atas penghasilan dari pekerjaan yang dipotong langsung oleh pemberi kerja dari gaji karyawan setiap bulan.",
      "Sejak Januari 2024 (PP 58/2023), potongan bulan Januari–November dihitung sederhana: tarif efektif rata-rata (TER) × gaji bruto sebulan. Tarif TER ditentukan oleh kategori status PTKP — Kategori A (TK/0, TK/1, K/0), B (TK/2, TK/3, K/1, K/2), dan C (K/3).",
      "Pada bulan Desember, perusahaan menghitung ulang PPh setahun penuh dengan tarif progresif Pasal 17 (5%–35%), lalu mengurangkan seluruh potongan Januari–November. Selisihnya dipotong (atau dikembalikan) di gaji Desember — inilah sebabnya potongan Desember sering berbeda.",
      "Karyawan tetap wajib melaporkan SPT Tahunan Orang Pribadi paling lambat 31 Maret, menggunakan bukti potong 1721-A1 dari perusahaan.",
    ],
    kalkulator: "/kalkulator/pph21",
  },
  {
    id: "ptkp",
    judul: "PTKP: penghasilan yang tidak kena pajak",
    isi: [
      "PTKP (Penghasilan Tidak Kena Pajak) adalah batas penghasilan yang bebas dari PPh: Rp54 juta setahun untuk diri sendiri, ditambah Rp4,5 juta jika kawin, dan Rp4,5 juta per tanggungan (maksimal 3 orang).",
      "Contoh: karyawan kawin dengan 2 tanggungan (K/2) memiliki PTKP Rp67,5 juta — artinya penghasilan neto sampai jumlah itu tidak dikenai pajak sama sekali.",
      "Status PTKP ditentukan kondisi pada awal tahun pajak (1 Januari). Pastikan HR memiliki data status kawin dan tanggungan yang benar, karena status ini menentukan kategori TER dan besarnya potongan bulanan.",
    ],
    kalkulator: "/kalkulator/pph21",
  },
  {
    id: "umkm",
    judul: "PPh Final UMKM 0,5%: siapa dan sampai kapan",
    isi: [
      "Wajib pajak dengan omzet sampai Rp4,8 miliar setahun dapat membayar PPh final hanya 0,5% dari omzet bulanan — tanpa pembukuan laba-rugi fiskal yang rumit (PP 55/2022).",
      "Kabar baik dari PP 20/2026: orang pribadi dan PT Perorangan kini dapat memakai tarif ini tanpa batas waktu. Koperasi dibatasi 4 tahun sejak terdaftar; ketentuan jangka waktu badan lain mengikuti aturan sebelumnya.",
      "Khusus orang pribadi, bagian omzet Rp500 juta pertama dalam setahun tidak dikenai pajak sama sekali. Artinya warung dengan omzet Rp400 juta setahun tidak membayar PPh final sepeser pun.",
      "Setoran dilakukan paling lambat tanggal 15 bulan berikutnya. Jika omzet menembus Rp4,8 miliar, mulai tahun pajak berikutnya wajib memakai tarif umum.",
    ],
    kalkulator: "/kalkulator/pph-final-umkm",
  },
  {
    id: "ppn",
    judul: "PPN 11% atau 12%? Memahami PMK 131/2024",
    isi: [
      "Tarif PPN dalam undang-undang adalah 12% sejak 1 Januari 2025. Namun untuk barang dan jasa umum, PPN dihitung dari DPP nilai lain sebesar 11/12 dari harga jual — sehingga tarif efektifnya tetap 11%.",
      "Tarif 12% penuh hanya berlaku untuk barang mewah yang menjadi objek PPnBM: kendaraan bermotor tertentu, hunian mewah, pesawat pribadi, kapal pesiar, dan sejenisnya.",
      "Pengusaha wajib dikukuhkan sebagai PKP (Pengusaha Kena Pajak) jika omzet melewati Rp4,8 miliar setahun; di bawah itu boleh memilih. PKP wajib menerbitkan faktur pajak elektronik dan melaporkan SPT Masa PPN setiap bulan.",
      "Barang kebutuhan pokok, jasa kesehatan, jasa pendidikan, dan jasa keuangan tertentu dibebaskan atau tidak dikenai PPN.",
    ],
    kalkulator: "/kalkulator/ppn",
  },
  {
    id: "badan",
    judul: "Kewajiban pajak perusahaan (badan)",
    isi: [
      "PPh badan dikenakan 22% atas laba kena pajak (laba setelah koreksi fiskal). Badan dengan omzet sampai Rp50 miliar mendapat diskon tarif 50% (jadi 11%) atas bagian laba dari omzet sampai Rp4,8 miliar — fasilitas Pasal 31E.",
      "Selain PPh badan tahunan, perusahaan umumnya wajib: memotong PPh 21 gaji karyawan, memotong PPh 23 atas jasa/sewa yang dibayarkan, menyetor angsuran PPh 25 bulanan, dan (jika PKP) memungut PPN.",
      "Semua bukti potong kini dibuat melalui sistem Coretax DJP dalam skema bukti potong unifikasi.",
      "SPT Tahunan badan paling lambat disampaikan akhir bulan keempat setelah tahun buku berakhir (30 April untuk tahun buku kalender).",
    ],
    kalkulator: "/kalkulator/pph-badan",
  },
];

const GLOSARIUM: [string, string][] = [
  ["NPWP", "Nomor Pokok Wajib Pajak — identitas wajib pajak; kini terintegrasi dengan NIK untuk orang pribadi."],
  ["SPT", "Surat Pemberitahuan — laporan pajak, ada SPT Masa (bulanan) dan SPT Tahunan."],
  ["PKP (status)", "Pengusaha Kena Pajak — pengusaha yang wajib memungut PPN."],
  ["PKP (hitungan)", "Penghasilan Kena Pajak — dasar pengenaan PPh setelah pengurang dan PTKP."],
  ["PTKP", "Penghasilan Tidak Kena Pajak — batas penghasilan bebas pajak (mulai Rp54 juta/tahun)."],
  ["TER", "Tarif Efektif Rata-rata — tarif potongan PPh 21 bulanan sesuai PP 58/2023."],
  ["DPP", "Dasar Pengenaan Pajak — nilai yang dikalikan tarif pajak."],
  ["Bukti potong (bupot)", "Dokumen bukti bahwa penghasilan sudah dipotong pajaknya oleh pihak pembayar."],
  ["Coretax", "Sistem administrasi perpajakan terpadu DJP yang berlaku sejak 2025."],
  ["NTPN", "Nomor Transaksi Penerimaan Negara — bukti validasi setoran pajak."],
  ["Biaya jabatan", "Pengurang penghasilan bruto pegawai tetap: 5%, maksimal Rp6 juta setahun."],
  ["PPnBM", "Pajak Penjualan atas Barang Mewah — dikenakan di samping PPN untuk barang tergolong mewah."],
];

export default function Edukasi() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JudulHalaman
        eyebrow="Edukasi"
        judul="Belajar Pajak untuk Tim & Karyawan Anda"
        deskripsi="Materi ringkas dalam bahasa sederhana — cocok dibagikan ke karyawan saat onboarding, atau untuk tim finance yang baru mulai menangani pajak perusahaan."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MATERI.map((m) => (
          <a
            key={m.id}
            href={`#${m.id}`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-sky-800 shadow-sm transition hover:border-sky-300"
          >
            {m.judul} ↓
          </a>
        ))}
      </div>

      <div className="mt-10 space-y-8">
        {MATERI.map((m) => (
          <Card key={m.id} className="scroll-mt-24" >
            <div id={m.id} className="scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900">{m.judul}</h2>
              <div className="mt-3 space-y-3">
                {m.isi.map((p, i) => (
                  <p key={i} className="text-sm leading-relaxed text-slate-600">
                    {p}
                  </p>
                ))}
              </div>
              <Link
                href={m.kalkulator}
                className="mt-4 inline-block rounded-lg bg-sky-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-800"
              >
                Coba kalkulatornya →
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900">Glosarium Pajak</h2>
        <p className="mt-2 text-slate-600">
          Istilah yang paling sering muncul di slip gaji dan dokumen pajak.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {GLOSARIUM.map(([istilah, arti]) => (
            <div
              key={istilah}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="font-bold text-sky-900">{istilah}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{arti}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
