"use client";

import { useState } from "react";

/**
 * Tombol bagikan (salin tautan berisi angka yang sedang dihitung) dan
 * cetak/simpan PDF. `params` berisi state kalkulator saat ini.
 */
export default function ShareBar({
  params,
}: {
  params: Record<string, string | number>;
}) {
  const [disalin, setDisalin] = useState(false);

  async function salin() {
    const url = new URL(window.location.pathname, window.location.origin);
    for (const [k, v] of Object.entries(params)) {
      if (v !== "" && v !== 0) url.searchParams.set(k, String(v));
    }
    await navigator.clipboard.writeText(url.toString());
    setDisalin(true);
    setTimeout(() => setDisalin(false), 2000);
  }

  const gaya =
    "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:text-sky-800";

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button type="button" onClick={salin} className={gaya}>
        {disalin ? "✓ Tautan disalin!" : "🔗 Salin tautan hasil"}
      </button>
      <button type="button" onClick={() => window.print()} className={gaya}>
        🖨️ Cetak / Simpan PDF
      </button>
    </div>
  );
}
