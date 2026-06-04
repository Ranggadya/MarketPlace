export interface ProductDB {
  id: string;
  name: string;
  price: number;
  description: string | null;
  images: string[] | null;
  rating: number;
  sold_count: number;
  seller_id: string;
  category_id: string;

  // JOIN fields
  sellers?: {
    store_name: string;
    pic_city: string;
    pic_province?: string;
    pic_phone: string; // ✅ ADDED: Phone number dari sellers table
  };
  categories?: {
    name: string;
  };
}
/**
 * Interface untuk Frontend (ProductCard & ProductDetail compatible)
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string; // mapped: images[0] atau placeholder
  images: string[]; // all images array
  category: string; // mapped: categories.name
  rating: number;
  sold: number; // mapped: sold_count
  location: string; // mapped: sellers.pic_city
  storeName: string; // mapped: sellers.store_name
}
/**
 * Interface untuk Product Detail Page (dengan info lengkap)
 */
export interface ProductDetail extends Product {
  sellerId: string;
  categoryId: string;
  storeCity: string; // alias dari location untuk clarity
  sellerPhone: string | null; // ✅ ADDED: Phone number untuk WhatsApp link
}
