"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RupiahInput from "@/components/RupiahInput";
import ShareBar from "@/components/ShareBar";
import {
  BarisHasil,
  Card,
  CatatanInfo,
  HasilUtama,
  JudulHalaman,
} from "@/components/ui";
import { formatPersen, formatRupiah } from "@/lib/format";
import { hitungPPhBadan } from "@/lib/pajak/pphBadan";
import { bacaParams } from "@/lib/prefill";

export default function KalkulatorPPhBadan() {
  const [omzet, setOmzet] = useState(0);
  const [pkp, setPkp] = useState(0);

  useEffect(() => {
    bacaParams({
      omzet: (v) => setOmzet(Number(v) || 0),
      pkp: (v) => setPkp(Number(v) || 0),
    });
  }, []);

  const hasil = hitungPPhBadan(omzet, pkp);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JudulHalaman
        eyebrow="Kalkulator"
        judul="PPh Badan 22%"
        deskripsi="Hitung PPh badan dengan tarif 22%, termasuk fasilitas Pasal 31E: pengurangan tarif 50% (menjadi 11%) atas bagian laba kena pajak dari omzet sampai Rp4,8 miliar, bagi badan dengan peredaran bruto sampai Rp50 miliar."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="print:hidden">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Data Perusahaan</h2>
          <div className="space-y-4">
            <RupiahInput
              id="omzet-badan"
              label="Peredaran bruto (omzet) setahun"
              value={omzet}
              onChange={setOmzet}
              hint="Seluruh penghasilan usaha sebelum biaya. Menentukan hak atas fasilitas Pasal 31E."
            />
            <RupiahInput
              id="pkp-badan"
              label="Penghasilan Kena Pajak (laba fiskal)"
              value={pkp}
              onChange={setPkp}
              hint="Laba setelah koreksi fiskal dan kompensasi kerugian."
            />
          </div>
        </Card>

        <div className="space-y-4">
          <HasilUtama
            label="PPh badan terutang"
            nilai={formatRupiah(hasil.totalPajak)}
            keterangan={`Tarif efektif ${formatPersen(hasil.tarifEfektifPersen)} dari laba kena pajak`}
          />
          <Card>
            <BarisHasil label="Penghasilan Kena Pajak" nilai={hasil.pkp} />
            {hasil.dapatFasilitas ? (
              <>
                <BarisHasil
                  label="Bagian PKP dapat fasilitas (tarif 11%)"
                  nilai={hasil.pkpFasilitas}
                />
                <BarisHasil
                  label="Bagian PKP tarif normal (22%)"
                  nilai={hasil.pkpNonFasilitas}
                />
                <div className="my-2 border-t border-slate-200" />
                <BarisHasil label="Pajak bagian fasilitas" nilai={hasil.pajakFasilitas} />
                <BarisHasil label="Pajak bagian normal" nilai={hasil.pajakNonFasilitas} />
              </>
            ) : (
              <div className="flex items-baseline justify-between gap-4 py-1.5 text-slate-600">
                <span className="text-sm">Fasilitas Pasal 31E</span>
                <span className="font-semibold">
                  Tidak berlaku (omzet &gt; Rp50 miliar)
                </span>
              </div>
            )}
            <div className="my-2 border-t border-slate-200" />
            <BarisHasil label="Total PPh badan" nilai={hasil.totalPajak} tebal />
          </Card>
          <ShareBar params={{ omzet, pkp }} />
          <CatatanInfo>
            Badan dengan omzet ≤ Rp4,8 miliar juga dapat memilih PPh Final UMKM
            0,5% dari omzet (selama masih dalam jangka waktu fasilitas) —
            bandingkan dengan{" "}
            <Link className="font-semibold underline" href="/kalkulator/pph-final-umkm">
              Kalkulator PPh Final UMKM
            </Link>{" "}
            untuk melihat mana yang lebih hemat.
          </CatatanInfo>
        </div>
      </div>
    </div>
  );
}
