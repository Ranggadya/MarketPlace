/**
 * Formatter mata uang Rupiah Indonesia.
 *
 * Mengubah angka nominal harga menjadi string Rupiah yang intuitif bagi
 * pengguna lokal, contoh: 150000 -> "Rp 150.000".
 *
 * Aturan format:
 * - Menggunakan locale "id-ID" sehingga pemisah ribuan adalah titik (".").
 * - Tidak menampilkan angka desimal (sen) -> minimum & maximum fraction 0.
 * - Spasi setelah "Rp" dinormalisasi menjadi spasi biasa (Intl menghasilkan
 *   non-breaking space U+00A0) agar output deterministik & mudah diuji.
 * - Nilai non-finite (NaN, Infinity) dianggap "Rp 0" untuk menghindari
 *   menampilkan teks rusak ke pengguna.
 *
 * @param value Nominal harga dalam Rupiah (number).
 * @returns String harga terformat, misalnya "Rp 150.000".
 */
export function formatRupiah(value: number): string {
  // Cabang 1: tolak nilai non-finite (NaN, Infinity) -> "Rp 0"
  if (!Number.isFinite(value)) {
    return "Rp 0";
  }

  // Cabang 2: format normal dengan locale id-ID, tanpa angka desimal
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  // Normalisasi non-breaking space (char code 160) dari Intl menjadi spasi biasa.
  const nbsp = String.fromCharCode(160);
  return formatted.split(nbsp).join(" ");
}
