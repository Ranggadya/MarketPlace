import { supabase } from "@/lib/supabase";
import { ProductDB } from "@/lib/models/Product";
import { getCategoryDBName } from "@/lib/constants";
export interface ProductFilters {
  keyword?: string;
  location?: string;
  category?: string;
}
export class ProductRepository {
  async findAll(filters: ProductFilters = {}): Promise<ProductDB[]> {
    // Base query dengan JOIN
    let query = supabase
      .from("products")
      .select(`
        *,
        sellers!inner ( store_name, pic_city ),
        categories!inner ( name )
      `);
    // Filter: Keyword (nama produk, case-insensitive)
    if (filters.keyword) {
      query = query.ilike("name", `%${filters.keyword}%`);
    }
    // Filter: Location (kota penjual, case-insensitive)
    if (filters.location) {
      query = query.ilike("sellers.pic_city", `%${filters.location}%`);
    }
    // Filter: Category (exact match dengan DB name)
    if (filters.category && filters.category !== "all") {
      // Convert UI value (e.g. "elektronik") → DB name (e.g. "Elektronik")
      const dbCategoryName = getCategoryDBName(filters.category);
      query = query.eq("categories.name", dbCategoryName);
    }
    const { data, error } = await query;
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    return data || [];
  }
}
