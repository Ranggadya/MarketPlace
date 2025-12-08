import { supabase } from "@/lib/supabase";
import { ProductDB } from "@/lib/models/Product";
import { getCategoryDBName } from "@/lib/constants";
export interface ProductFilters {
  keyword?: string;
  location?: string;
  category?: string;
}
export class ProductRepository {
  /**
   * Find all products dengan filters
   */
  async findAll(filters: ProductFilters = {}): Promise<ProductDB[]> {
    let query = supabase
      .from("products")
      .select(`
        *,
        sellers!inner ( store_name, pic_city ),
        categories!inner ( name )
      `);
    if (filters.keyword) {
      query = query.ilike("name", `%${filters.keyword}%`);
    }
    if (filters.location) {
      query = query.ilike("sellers.pic_city", `%${filters.location}%`);
    }
    if (filters.category && filters.category !== "all") {
      const dbCategoryName = getCategoryDBName(filters.category);
      query = query.eq("categories.name", dbCategoryName);
    }
    const { data, error } = await query;
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    return data || [];
  }
  /**
   * Find product by ID dengan JOIN sellers & categories
   */
  async findById(productId: string): Promise<ProductDB | null> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          sellers!inner ( store_name, pic_city, pic_phone ),
          categories!inner ( name )
        `)
        .eq("id", productId)
        .single();
      if (error) {
        if (error.code === "PGRST116") {
          // Not found error
          return null;
        }
        throw new Error(`Database error: ${error.message}`);
      }
      return data as ProductDB;
    } catch (error) {
      console.error("ProductRepository.findById error:", error);
      throw error;
    }
  }
  /**
   * ✅ NEW METHOD: Update product rating (after new review submission)
   * @param productId - UUID of product
   * @param newRating - New average rating (0-5, rounded to 1 decimal)
   */
  async updateRating(productId: string, newRating: number): Promise<void> {
    try {
      const { error } = await supabase
        .from("products")
        .update({ rating: newRating })
        .eq("id", productId);
      if (error) {
        console.error("Error updating product rating:", error);
        throw new Error(`Database error: ${error.message}`);
      }
      console.log(`✅ Product ${productId} rating updated to ${newRating}`);
    } catch (error) {
      console.error("ProductRepository.updateRating error:", error);
      throw error;
    }
  }
}
