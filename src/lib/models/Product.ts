// Interface untuk raw response dari Supabase
export interface ProductDB {
  id: string;
  name: string;
  price: number;
  images: string[] | null;
  rating: number;
  seller_id: string;
  category_id: string;
  sellers?: {
    store_name: string;
    pic_city: string;
  };
  categories?: {
    name: string;
  };
}

// Interface untuk Frontend (ProductCard compatible)
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;      // mapped: images[0]
  category: string;      // mapped: categories.name
  rating: number;
  location: string;      // mapped: sellers.pic_city
  sellerName: string;    // mapped: sellers.store_name
  sold?: number;         // default: 0
}
