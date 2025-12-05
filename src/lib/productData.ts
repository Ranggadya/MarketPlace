export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  location: string;
  imageUrl: string;
  sold: number;
  description: string;
  storeName: string;
  storeRating: number;
}
export const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Laptop HP Pavilion 14 Intel Core i5 Gen 11",
    price: 4500000,
    category: "Elektronik",
    rating: 4.8,
    location: "Jakarta",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    sold: 127,
    description: "Laptop HP Pavilion 14 dengan prosesor Intel Core i5 Gen 11, RAM 8GB, SSD 512GB. Kondisi mulus seperti baru, garansi resmi masih aktif. Cocok untuk kerja, kuliah, dan gaming ringan. Sudah termasuk tas laptop dan mouse wireless.",
    storeName: "Tech Store Jakarta",
    storeRating: 4.9,
  },
  {
    id: "2",
    name: "Kaos Oversized Premium Cotton Combed 30s",
    price: 85000,
    category: "Fashion",
    rating: 4.6,
    location: "Bandung",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    sold: 234,
    description: "Kaos oversized premium dari bahan cotton combed 30s yang adem dan nyaman. Tersedia berbagai warna dan ukuran (M, L, XL, XXL). Sablon tidak mudah luntur, jahitan rapi dan kuat. Cocok untuk daily wear dan hangout.",
    storeName: "Fashion Hub Bandung",
    storeRating: 4.7,
  },
  {
    id: "3",
    name: "Nasi Goreng Spesial + Telur + Kerupuk",
    price: 18000,
    category: "Makanan & Minuman",
    rating: 4.9,
    location: "Surabaya",
    imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
    sold: 456,
    description: "Nasi goreng spesial dengan bumbu rahasia, pakai telur mata sapi dan kerupuk udang. Porsi jumbo bikin kenyang! Bisa request level pedas sesuai selera. Fresh dan higienis. Tersedia untuk delivery area Surabaya.",
    storeName: "Warung Nasi Goreng Pak Budi",
    storeRating: 4.9,
  },
  {
    id: "4",
    name: "Buku Clean Code: A Handbook of Agile Software",
    price: 145000,
    category: "Buku & Alat Tulis",
    rating: 5.0,
    location: "Jakarta",
    imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80",
    sold: 89,
    description: "Buku Clean Code edisi terbaru, kondisi baru segel. Panduan wajib untuk software developer yang ingin menulis kode berkualitas tinggi. Bahasa Inggris original. Cocok untuk mahasiswa IT dan professional developer.",
    storeName: "Toko Buku Digital Jakarta",
    storeRating: 4.8,
  },
  {
    id: "5",
    name: "Action Figure Naruto Uzumaki SH Figuarts",
    price: 320000,
    category: "Hobi & Koleksi",
    rating: 4.7,
    location: "Bandung",
    imageUrl: "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800&q=80",
    sold: 156,
    description: "Action figure Naruto Uzumaki SH Figuarts original, tinggi 15cm dengan artikulasi lengkap. Include aksesori kunai, rasengan effect, dan berbagai hand parts. Box lengkap dan kondisi mint. Limited edition untuk kolektor sejati!",
    storeName: "Hobby Collectibles Bandung",
    storeRating: 4.8,
  },
  {
    id: "6",
    name: "Sepatu Sneakers Nike Air Force 1 White Original",
    price: 1200000,
    category: "Fashion",
    rating: 4.9,
    location: "Surabaya",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    sold: 312,
    description: "Nike Air Force 1 Triple White 100% original dengan invoice dan box lengkap. Ukuran lengkap dari 39-45. Bahan premium leather berkualitas tinggi, sol yang empuk dan tahan lama. Icon sneakers yang timeless!",
    storeName: "Sneakers Station Surabaya",
    storeRating: 4.9,
  },
  {
    id: "7",
    name: "Mouse Wireless Logitech MX Master 3S",
    price: 1450000,
    category: "Elektronik",
    rating: 4.8,
    location: "Semarang",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    sold: 98,
    description: "Mouse wireless premium Logitech MX Master 3S dengan sensor 8000 DPI, scroll wheel elektromagnetik super halus, dan baterai tahan hingga 70 hari. Cocok untuk designer, programmer, dan productivity enthusiast. Garansi resmi 1 tahun.",
    storeName: "Gadget Pro Semarang",
    storeRating: 4.7,
  },
  {
    id: "8",
    name: "Jaket Hoodie Zipper Premium Fleece Tebal",
    price: 135000,
    category: "Fashion",
    rating: 4.5,
    location: "Jakarta",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    sold: 187,
    description: "Jaket hoodie zipper dengan bahan fleece tebal dan hangat. Cocok untuk cuaca dingin atau AC. Tersedia berbagai warna (Hitam, Navy, Abu, Maroon). Zipper YKK berkualitas, kantong depan luas. Jahitan rapih dan kuat.",
    storeName: "Urban Style Jakarta",
    storeRating: 4.6,
  },
  {
    id: "9",
    name: "Kopi Arabica Gayo Premium 250gr Biji/Bubuk",
    price: 65000,
    category: "Makanan & Minuman",
    rating: 4.8,
    location: "Bandung",
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
    sold: 421,
    description: "Kopi Arabica Gayo Premium langsung dari petani Aceh. Biji kopi pilihan dengan tingkat kematangan sempurna, rasa balance dengan aroma harum. Tersedia pilihan biji atau bubuk sesuai kebutuhan. Kemasan ziplock food grade.",
    storeName: "Kopi Nusantara Bandung",
    storeRating: 4.9,
  },
  {
    id: "10",
    name: "Stabilo Boss Pastel Highlighter Set 6 Warna",
    price: 48000,
    category: "Buku & Alat Tulis",
    rating: 4.7,
    location: "Surabaya",
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80",
    sold: 267,
    description: "Stabilo Boss Original Pastel Collection isi 6 warna cantik (pink, mint, lilac, peach, blue, yellow). Tinta tidak tembus kertas, warna pastel soft yang nyaman di mata. Perfect untuk notes, journaling, dan highlighting buku pelajaran.",
    storeName: "Stationery Corner Surabaya",
    storeRating: 4.7,
  },
  {
    id: "11",
    name: "Tanaman Hias Monstera Deliciosa Pot Keramik",
    price: 95000,
    category: "Hobi & Koleksi",
    rating: 4.6,
    location: "Semarang",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80",
    sold: 143,
    description: "Monstera Deliciosa ukuran sedang dalam pot keramik cantik. Tanaman hias indoor populer dengan daun berlubang unik. Mudah perawatan, cocok untuk pemula. Include tips perawatan lengkap. Bikin ruangan jadi lebih segar dan aesthetic!",
    storeName: "Green Garden Semarang",
    storeRating: 4.8,
  },
  {
    id: "12",
    name: "Keyboard Mechanical RGB Gaming Gateron Switch",
    price: 750000,
    category: "Elektronik",
    rating: 4.9,
    location: "Jakarta",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    sold: 201,
    description: "Keyboard mechanical gaming dengan Gateron Red Switch yang smooth dan responsif. RGB backlight dengan berbagai mode, hot-swappable switch, dan keycaps PBT double-shot. Anti-ghosting full key, build quality premium aluminium. Garansi 1 tahun.",
    storeName: "Gaming Gear Jakarta",
    storeRating: 4.9,
  },
];
// Helper function: Get product by ID
export function getProductById(id: string): Product | undefined {
  return dummyProducts.find((product) => product.id === id);
}
// Helper function: Get all products
export function getAllProducts(): Product[] {
  return dummyProducts;
}
// Helper function: Get products by category
export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return dummyProducts;
  return dummyProducts.filter((product) => 
    product.category.toLowerCase().includes(category.toLowerCase())
  );
}
