/** Baris kepercayaan: dasar hukum + tanggal verifikasi terakhir kalkulator. */
export default function DasarHukum({
  peraturan,
  diverifikasi,
}: {
  peraturan: string[];
  diverifikasi: string; // mis. "1 September 2026"
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      <p className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs leading-relaxed text-slate-500">
        <span className="font-semibold text-slate-600">Dasar hukum:</span>{" "}
        {peraturan.join(" · ")}
        <span className="mx-2">|</span>
        <span className="font-semibold text-slate-600">
          Terakhir diverifikasi:
        </span>{" "}
        {diverifikasi}. Alat ini memberikan estimasi untuk edukasi, bukan
        nasihat pajak profesional.
      </p>
    </div>
  );
}
