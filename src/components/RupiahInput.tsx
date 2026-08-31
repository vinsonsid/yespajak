"use client";

import { formatRupiah, parseRupiah } from "@/lib/format";

interface RupiahInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
  placeholder?: string;
}

export default function RupiahInput({
  id,
  label,
  value,
  onChange,
  hint,
  placeholder,
}: RupiahInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative mt-1.5">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-medium text-slate-400">
          Rp
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder={placeholder ?? "0"}
          value={value === 0 ? "" : formatRupiah(value, false)}
          onChange={(e) => onChange(parseRupiah(e.target.value))}
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-right text-base font-semibold text-slate-900 tabular-nums shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
