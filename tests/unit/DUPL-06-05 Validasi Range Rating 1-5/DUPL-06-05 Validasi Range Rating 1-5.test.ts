import { describe, it, expect } from "vitest";
import { isValidRating } from "@/lib/models/Review";

/**
 * DUPL-06-05 — Validasi Range Rating 1-5
 * SKPL: SRS-MartPlace-06
 */
describe("DUPL-06-05: isValidRating - Validasi Range Skor Rating (1-5)", () => {
  it("menerima seluruh skor valid 1 sampai 5", () => {
    [1, 2, 3, 4, 5].forEach((r) => expect(isValidRating(r)).toBe(true));
  });

  it("batas bawah: menerima 1, menolak 0", () => {
    expect(isValidRating(1)).toBe(true);
    expect(isValidRating(0)).toBe(false);
  });

  it("batas atas: menerima 5, menolak 6", () => {
    expect(isValidRating(5)).toBe(true);
    expect(isValidRating(6)).toBe(false);
  });

  it("menolak skor negatif", () => {
    expect(isValidRating(-1)).toBe(false);
  });

  it("menolak skor desimal / bukan integer", () => {
    expect(isValidRating(4.5)).toBe(false);
    expect(isValidRating(3.0001)).toBe(false);
  });

  it("menolak NaN", () => {
    expect(isValidRating(NaN)).toBe(false);
  });
});
