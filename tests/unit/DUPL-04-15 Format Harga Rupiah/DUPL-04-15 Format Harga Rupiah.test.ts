import { describe, it, expect } from "vitest";
import { formatRupiah } from "@/lib/format";

/**
 * DUPL-04-15 — Format Harga Rupiah
 * SKPL: SRS-MartPlace-04
 */
describe("DUPL-04-15: formatRupiah - Formatter Mata Uang Rupiah", () => {
  it("memformat nominal ribuan dengan pemisah titik", () => {
    expect(formatRupiah(150000)).toBe("Rp 150.000");
  });

  it("memformat nilai nol", () => {
    expect(formatRupiah(0)).toBe("Rp 0");
  });

  it("memformat jutaan dengan dua pemisah ribuan", () => {
    expect(formatRupiah(1000000)).toBe("Rp 1.000.000");
  });

  it("membulatkan & menghilangkan angka desimal", () => {
    expect(formatRupiah(150000.4)).toBe("Rp 150.000"); 
    expect(formatRupiah(150000.6)).toBe("Rp 150.001"); 
  });

  it("selalu diawali prefiks 'Rp ' dengan spasi biasa (bukan NBSP)", () => {
    const out = formatRupiah(2500);
    expect(out.startsWith("Rp ")).toBe(true);
    expect(out).toBe("Rp 2.500");
    expect(out.charCodeAt(2)).toBe(32); // 32 = spasi biasa, 160 = NBSP
  });

  it("mengembalikan 'Rp 0' untuk nilai non-finite (NaN, Infinity)", () => {
    expect(formatRupiah(NaN)).toBe("Rp 0");
    expect(formatRupiah(Infinity)).toBe("Rp 0");
    expect(formatRupiah(-Infinity)).toBe("Rp 0");
  });
});
