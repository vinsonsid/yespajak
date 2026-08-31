import { ReactNode } from "react";
import { formatRupiah } from "@/lib/format";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function BarisHasil({
  label,
  nilai,
  tebal = false,
  minus = false,
}: {
  label: ReactNode;
  nilai: number;
  tebal?: boolean;
  minus?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 py-1.5 ${
        tebal ? "font-bold text-slate-900" : "text-slate-600"
      }`}
    >
      <span className="text-sm">{label}</span>
      <span className="tabular-nums">
        {minus && nilai > 0 ? "− " : ""}
        {formatRupiah(nilai)}
      </span>
    </div>
  );
}

export function HasilUtama({
  label,
  nilai,
  keterangan,
}: {
  label: string;
  nilai: string;
  keterangan?: string;
}) {
  return (
    <div className="rounded-xl bg-sky-900 px-5 py-4 text-white">
      <p className="text-sm font-medium text-sky-200">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums">{nilai}</p>
      {keterangan && <p className="mt-1 text-xs text-sky-200">{keterangan}</p>}
    </div>
  );
}

export function CatatanInfo({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {children}
    </div>
  );
}

export function JudulHalaman({
  eyebrow,
  judul,
  deskripsi,
}: {
  eyebrow: string;
  judul: string;
  deskripsi: string;
}) {
  return (
    <header className="mb-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
        {eyebrow}
      </p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
        {judul}
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">{deskripsi}</p>
    </header>
  );
}
