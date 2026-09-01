"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const KALKULATOR = [
  { href: "/kalkulator/pph21", label: "PPh 21 Karyawan (TER)" },
  { href: "/kalkulator/pph-final-umkm", label: "PPh Final UMKM 0,5%" },
  { href: "/kalkulator/ppn", label: "PPN 11% / 12%" },
  { href: "/kalkulator/pph-badan", label: "PPh Badan 22%" },
  { href: "/kalkulator/pph23", label: "PPh 23 / Pasal 4(2)" },
  { href: "/kalkulator/umkm-vs-tarif-umum", label: "UMKM vs Tarif Umum" },
];

const MENU_LAIN = [
  { href: "/payroll-pph21", label: "Payroll PPh 21" },
  { href: "/kalender-pajak", label: "Kalender Pajak" },
  { href: "/edukasi", label: "Edukasi" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [bukaMobile, setBukaMobile] = useState(false);
  const [bukaDropdown, setBukaDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function tutupMenu() {
    setBukaMobile(false);
    setBukaDropdown(false);
  }

  useEffect(() => {
    function tutup(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setBukaDropdown(false);
      }
    }
    document.addEventListener("mousedown", tutup);
    return () => document.removeEventListener("mousedown", tutup);
  }, []);

  const diKalkulator = pathname.startsWith("/kalkulator");

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-900 text-lg font-black text-amber-400">
            Y!
          </span>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Yes<span className="text-sky-700">Pajak</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setBukaDropdown(!bukaDropdown)}
              aria-expanded={bukaDropdown}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                diKalkulator
                  ? "bg-sky-100 text-sky-900"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              Kalkulator{" "}
              <span
                className={`inline-block transition ${bukaDropdown ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>
            {bukaDropdown && (
              <div className="absolute left-0 top-full mt-1 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                {KALKULATOR.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={tutupMenu}
                    className={`block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      pathname.startsWith(item.href)
                        ? "bg-sky-100 text-sky-900"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {MENU_LAIN.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                pathname.startsWith(item.href)
                  ? "bg-sky-100 text-sky-900"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setBukaMobile(!bukaMobile)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Buka menu"
          aria-expanded={bukaMobile}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {bukaMobile ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {bukaMobile && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 lg:hidden">
          <p className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            Kalkulator
          </p>
          {KALKULATOR.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={tutupMenu}
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
          <p className="px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
            Lainnya
          </p>
          {MENU_LAIN.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={tutupMenu}
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
