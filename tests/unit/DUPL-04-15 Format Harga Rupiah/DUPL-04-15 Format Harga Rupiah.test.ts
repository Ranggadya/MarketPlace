import { describe, it, expect } from "vitest";
import { formatPrice } from "@/components/ProductCard";

/**
 * DUPL-04-15 — Format Harga Rupiah
 * SKPL: SRS-MartPlace-04
 */
const norm = (s: string) => s.split(String.fromCharCode(160)).join(" ");

describe("DUPL-04-15: formatPrice - Formatter Mata Uang Rupiah", () => {
  it("memformat nominal ribuan dengan pemisah titik", () => {
    expect(norm(formatPrice(150000))).toBe("Rp 150.000");
  });

  it("memformat nilai nol", () => {
    expect(norm(formatPrice(0))).toBe("Rp 0");
  });

  it("memformat jutaan dengan dua pemisah ribuan", () => {
    expect(norm(formatPrice(1000000))).toBe("Rp 1.000.000");
  });

  it("membulatkan & menghilangkan angka desimal", () => {
    expect(norm(formatPrice(150000.4))).toBe("Rp 150.000"); 
    expect(norm(formatPrice(150000.6))).toBe("Rp 150.001"); 
  });

  it("selalu diawali prefiks 'Rp' dan memakai pemisah ribuan titik", () => {
    const out = norm(formatPrice(2500));
    expect(out.startsWith("Rp")).toBe(true);
    expect(out).toBe("Rp 2.500");
  });
});
