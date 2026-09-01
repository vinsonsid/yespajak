/**
 * Isi state kalkulator dari query string (tautan hasil yang dibagikan).
 * Panggil sekali dari useEffect saat komponen dimuat.
 */
export function bacaParams(
  setters: Record<string, (nilai: string) => void>
): void {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams(window.location.search);
  for (const [kunci, set] of Object.entries(setters)) {
    const nilai = p.get(kunci);
    if (nilai !== null && nilai !== "") set(nilai);
  }
}
