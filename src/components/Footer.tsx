import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold text-white">
            Yes<span className="text-sky-400">Pajak</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            Alat bantu pajak untuk UMKM dan perusahaan Indonesia: kalkulator,
            kalender kewajiban, dan edukasi pajak karyawan.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
            Kalkulator
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/kalkulator/pph21">PPh 21 Karyawan (TER)</Link></li>
            <li><Link className="hover:text-white" href="/kalkulator/pph-final-umkm">PPh Final UMKM 0,5%</Link></li>
            <li><Link className="hover:text-white" href="/kalkulator/ppn">PPN 11%/12%</Link></li>
            <li><Link className="hover:text-white" href="/kalkulator/pph-badan">PPh Badan</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
            Referensi
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/kalender-pajak">Kalender Pajak</Link></li>
            <li><Link className="hover:text-white" href="/edukasi">Edukasi Pajak</Link></li>
            <li>
              <a className="hover:text-white" href="https://pajak.go.id" target="_blank" rel="noopener noreferrer">
                Situs Resmi DJP ↗
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs leading-relaxed text-slate-500 sm:px-6">
          YesPajak adalah alat bantu edukasi dan estimasi, bukan nasihat pajak
          profesional dan tidak berafiliasi dengan Direktorat Jenderal Pajak.
          Selalu verifikasi perhitungan dengan konsultan pajak atau ketentuan
          resmi yang berlaku. © {new Date().getFullYear()} YesPajak.
        </p>
      </div>
    </footer>
  );
}
