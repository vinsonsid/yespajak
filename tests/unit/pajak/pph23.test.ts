import { describe, expect, it } from "vitest";
import { OBJEK_PPH23, hitungPPh23, type ObjekPPh23 } from "../../../src/core/pajak/pph23";

const semua = Object.keys(OBJEK_PPH23) as ObjekPPh23[];

describe("hitungPPh23", () => {
  it.each(semua)("AC1 AC2 AC3 AC4 AC5 AC6: %s: pph = bruto × tarif dipakai, diterima = bruto − pph", (objek) => {
    for (const npwp of [true, false]) {
      const r = hitungPPh23(objek, 10_000_000, npwp);
      expect(r.pph).toBe((r.bruto * r.tarifDipakaiPersen) / 100);
      expect(r.diterimaBersih).toBe(r.bruto - r.pph);
      expect(r.kenaikanNonNPWP).toBe(!npwp && !OBJEK_PPH23[objek].final);
      expect(r.info).toBe(OBJEK_PPH23[objek]);
      expect(r.objek).toBe(objek);
    }
  });
});
