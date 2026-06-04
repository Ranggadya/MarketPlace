import { describe, it, expect } from "vitest";
import { fmtMoney } from "../admin-pdf-generator";

describe("DUPL-11-06 - Unit Testing Format Harga Produk pada Laporan Rating Produk", () => {
  it("memformat angka harga produk menjadi format Rupiah yang benar", () => {
    expect(fmtMoney(150000)).toBe("Rp 150.000");
    expect(fmtMoney(2500000)).toBe("Rp 2.500.000");
    expect(fmtMoney(99999)).toBe("Rp 99.999");
    expect(fmtMoney(0)).toBe("Rp 0");
  });
});