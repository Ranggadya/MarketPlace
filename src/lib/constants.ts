// Category mapping: UI value → Database name
export const CATEGORY_MAP: Record<string, string> = {
  "all": "all",
  "elektronik": "Elektronik",
  "fashion-pria": "Fashion Pria",
  "fashion-wanita": "Fashion Wanita",
  "makanan": "Makanan & Minuman",
  "buku": "Buku",
  "hobi": "Hobi & Koleksi",
  "kesehatan": "Kesehatan",
};
// Reverse mapping: Database name → UI value (for displaying from DB)
export const CATEGORY_REVERSE_MAP: Record<string, string> = {
  "Elektronik": "elektronik",
  "Fashion Pria": "fashion-pria",
  "Fashion Wanita": "fashion-wanita",
  "Makanan & Minuman": "makanan",
  "Buku": "buku",
  "Hobi & Koleksi": "hobi",
  "Kesehatan": "kesehatan",
};
// Helper function: Get database name from UI value
export function getCategoryDBName(uiValue: string): string {
  return CATEGORY_MAP[uiValue] || uiValue;
}
// Helper function: Get UI value from database name
export function getCategoryUIValue(dbName: string): string {
  return CATEGORY_REVERSE_MAP[dbName] || dbName.toLowerCase();
}
// Category list for dropdowns (UI display)
export const CATEGORY_OPTIONS = [
  { value: "all", label: "Semua Kategori" },
  { value: "elektronik", label: "Elektronik" },
  { value: "fashion-pria", label: "Fashion Pria" },
  { value: "fashion-wanita", label: "Fashion Wanita" },
  { value: "makanan", label: "Makanan & Minuman" },
  { value: "buku", label: "Buku" },
  { value: "hobi", label: "Hobi & Koleksi" },
  { value: "kesehatan", label: "Kesehatan" },
];
