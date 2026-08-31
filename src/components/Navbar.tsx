"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const MENU = [
  { href: "/kalkulator/pph21", label: "PPh 21" },
  { href: "/kalkulator/pph-final-umkm", label: "PPh Final UMKM" },
  { href: "/kalkulator/ppn", label: "PPN" },
  { href: "/kalkulator/pph-badan", label: "PPh Badan" },
  { href: "/kalender-pajak", label: "Kalender Pajak" },
  { href: "/edukasi", label: "Edukasi" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [buka, setBuka] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
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
          {MENU.map((item) => {
            const aktif = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  aktif
                    ? "bg-sky-100 text-sky-900"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setBuka(!buka)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Buka menu"
          aria-expanded={buka}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {buka ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {buka && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 lg:hidden">
          {MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setBuka(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
