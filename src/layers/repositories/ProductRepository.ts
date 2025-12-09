import { createClient } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { ProductDB } from "@/lib/models/Product";
import { getCategoryDBName } from "@/lib/constants";

export interface ProductFilters {
  keyword?: string;
  location?: string;
  category?: string;
}

export default class ProductRepository {
  /**
   * Find all products dengan filters (from rajwaa)
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
   * Find product by ID dengan JOIN sellers & categories (merged from both)
   */
  async findById(id: string): Promise<ProductDB | null> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          sellers!inner ( store_name, pic_city, pic_phone ),
          categories!inner ( name )
        `)
        .eq("id", id)
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
   * Get products by seller ID (from main)
   */
  async getBySellerId(sellerId: string) {
    try {
      const supabaseClient = await createClient();
      const { data, error } = await supabaseClient
        .from("products")
        .select(`
          *,
          categories!category_id (
            id,
            name,
            slug
          )
        `)
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("getBySellerId error:", error);
        throw new Error(error.message);
      }
      
      return data || [];
    } catch (error) {
      console.error("ProductRepository.getBySellerId:", error);
      return [];
    }
  }

  /**
   * Create new product (from main)
   */
  async create(payload: any) {
    // Validate seller_id exists
    if (!payload.seller_id) {
      throw new Error("seller_id is required and cannot be null");
    }

    const supabaseClient = await createClient();
    const { data, error } = await supabaseClient.from("products").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Update product (from main)
   */
  async update(id: string, payload: any) {
    const supabaseClient = await createClient();
    const { data, error } = await supabaseClient.from("products").update(payload).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Delete product (from main)
   */
  async delete(id: string) {
    const supabaseClient = await createClient();
    const { error } = await supabaseClient.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return true;
  }

  /**
   * Get all categories (from main)
   */
  async getCategories() {
    try {
      const supabaseClient = await createClient();
      const { data, error } = await supabaseClient.from("categories").select("id, name").order("name");
      if (error) throw new Error(error.message);
      return data || [];
    } catch (error) {
      console.error("ProductRepository.getCategories:", error);
      return [];
    }
  }

  /**
   * Get product statistics for seller dashboard (from main)
   */
  async getProductStats(sellerId: string) {
    try {
      const supabaseClient = await createClient();
      const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .eq("seller_id", sellerId);
      
      if (error) throw new Error(error.message);
      
      const totalProducts = data?.length || 0;
      const activeProducts = data?.filter(p => p.status === "active").length || 0;
      const totalStock = data?.reduce((sum, p) => sum + (p.stock || 0), 0) || 0;
      const lowStock = data?.filter(p => p.stock < 10 && p.stock > 0).length || 0;
      const outOfStock = data?.filter(p => p.stock === 0).length || 0;
      const criticalStock = lowStock + outOfStock;
      const totalValue = data?.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0) || 0;
      const avgRating = 0; // TODO: implement rating calculation
      
      return {
        totalProducts,
        activeProducts,
        criticalStock,
        totalValue,
        avgRating,
        lowStockProducts: lowStock,
        outOfStockProducts: outOfStock,
      };
    } catch (error) {
      console.error("ProductRepository.getProductStats:", error);
      return {
        totalProducts: 0,
        activeProducts: 0,
        criticalStock: 0,
        totalValue: 0,
        avgRating: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
      };
    }
  }

  /**
   * Update product rating (from rajwaa)
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
