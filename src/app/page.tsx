import Link from "next/link";

const ALAT = [
  {
    href: "/kalkulator/pph21",
    emoji: "🧑‍💼",
    judul: "Kalkulator PPh 21 Karyawan",
    deskripsi:
      "Hitung potongan PPh 21 bulanan dengan Tarif Efektif Rata-rata (TER, PP 58/2023) dan perhitungan tahunan tarif Pasal 17.",
  },
  {
    href: "/kalkulator/pph-final-umkm",
    emoji: "🏪",
    judul: "Kalkulator PPh Final UMKM 0,5%",
    deskripsi:
      "Estimasi PPh final untuk omzet s.d. Rp4,8 miliar — sudah termasuk pembebasan omzet Rp500 juta pertama bagi orang pribadi (PP 20/2026).",
  },
  {
    href: "/kalkulator/ppn",
    emoji: "🧾",
    judul: "Kalkulator PPN",
    deskripsi:
      "Hitung PPN 12% dengan DPP nilai lain 11/12 (efektif 11%) untuk barang umum, atau 12% penuh untuk barang mewah sesuai PMK 131/2024.",
  },
  {
    href: "/kalkulator/pph-badan",
    emoji: "🏢",
    judul: "Kalkulator PPh Badan",
    deskripsi:
      "Hitung PPh badan tarif 22% lengkap dengan fasilitas pengurangan 50% Pasal 31E untuk omzet s.d. Rp50 miliar.",
  },
  {
    href: "/kalkulator/pph23",
    emoji: "📄",
    judul: "Kalkulator PPh 23 & Sewa",
    deskripsi:
      "Pemotongan atas jasa, sewa, bunga, royalti, dan hadiah (15%/2%, naik 2× tanpa NPWP), plus PPh final 10% sewa tanah/bangunan.",
  },
  {
    href: "/kalkulator/umkm-vs-tarif-umum",
    emoji: "⚖️",
    judul: "UMKM 0,5% vs Tarif Umum",
    deskripsi:
      "Alat perencanaan pajak: bandingkan kedua skema berdasarkan margin laba Anda dan temukan titik impasnya sebelum memilih.",
  },
  {
    href: "/payroll-pph21",
    emoji: "📊",
    judul: "Payroll PPh 21 Massal",
    deskripsi:
      "Tempel data karyawan dari Excel, hitung PPh 21 TER seluruh tim sekaligus, lalu unduh hasilnya sebagai CSV. Data tetap di browser Anda.",
  },
  {
    href: "/kalender-pajak",
    emoji: "📅",
    judul: "Kalender Kewajiban Pajak",
    deskripsi:
      "Batas waktu setor dan lapor bulanan serta SPT Tahunan agar perusahaan Anda terhindar dari sanksi keterlambatan.",
  },
  {
    href: "/edukasi",
    emoji: "🎓",
    judul: "Edukasi Pajak Karyawan",
    deskripsi:
      "Materi ringkas tentang PPh 21, slip gaji, UMKM, dan PPN untuk membekali tim finance dan karyawan Anda.",
  },
];

export default function Beranda() {
  return (
    <>
      <section className="bg-sky-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="inline-block rounded-full border border-sky-700 bg-sky-900/60 px-4 py-1 text-sm font-semibold text-sky-200">
            Sesuai aturan terbaru: PP 58/2023 · PMK 131/2024 · PP 20/2026
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Urus pajak usaha Anda dengan{" "}
            <span className="text-amber-400">percaya diri</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-sky-200">
            YesPajak menyediakan kalkulator pajak, kalender kewajiban, dan
            materi edukasi untuk UMKM dan perusahaan Indonesia — gratis, cepat,
            dan dalam Bahasa Indonesia.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/kalkulator/pph21"
              className="rounded-xl bg-amber-400 px-6 py-3 font-bold text-sky-950 transition hover:bg-amber-300"
            >
              Hitung PPh 21 Sekarang
            </Link>
            <Link
              href="/edukasi"
              className="rounded-xl border border-sky-600 px-6 py-3 font-bold text-white transition hover:bg-sky-900"
            >
              Belajar Pajak
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Semua alat dalam satu tempat
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Dirancang untuk pemilik usaha, tim finance, dan HR — tanpa perlu jadi
          ahli pajak terlebih dahulu.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ALAT.map((alat) => (
            <Link
              key={alat.href}
              href={alat.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
            >
              <span className="text-3xl">{alat.emoji}</span>
              <h3 className="mt-3 font-bold text-slate-900 group-hover:text-sky-800">
                {alat.judul}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {alat.deskripsi}
              </p>
              <p className="mt-4 text-sm font-semibold text-sky-700">
                Buka alat →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
          {[
            {
              angka: "0,5%",
              teks: "Tarif PPh final UMKM — kini berlaku tanpa batas waktu untuk orang pribadi & PT Perorangan (PP 20/2026).",
            },
            {
              angka: "TER",
              teks: "Skema pemotongan PPh 21 bulanan sejak 2024 — cukup kalikan tarif efektif dengan gaji bruto.",
            },
            {
              angka: "11%",
              teks: "Tarif efektif PPN barang & jasa umum (12% × DPP 11/12); barang mewah tetap 12% penuh.",
            },
          ].map((item) => (
            <div key={item.angka}>
              <p className="text-4xl font-extrabold text-sky-800">
                {item.angka}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.teks}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
