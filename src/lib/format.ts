export function formatRupiah(value: number, withSymbol = true): string {
  const rounded = Math.round(value);
  const formatted = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(rounded);
  return withSymbol ? `Rp ${formatted}` : formatted;
}

export function formatPersen(value: number, maxDigits = 2): string {
  return `${new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: maxDigits,
  }).format(value)}%`;
}

/** Ambil angka dari string input pengguna ("12.500.000" -> 12500000). */
export function parseRupiah(input: string): number {
  const digits = input.replace(/[^\d]/g, "");
  return digits === "" ? 0 : Number(digits);
}
