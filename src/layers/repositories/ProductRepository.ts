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
   * Helper: Get category ID by slug/name
   * Returns null if not found
   * @private
   */
  private async getCategoryIdBySlug(slug: string): Promise<string | null> {
    try {
      const dbName = getCategoryDBName(slug);
      const { data, error } = await supabase
        .from("categories")
        .select("id")
        .eq("name", dbName)
        .single();
      
      if (error) {
        console.warn(`Category not found: ${slug}`, error);
        return null;
      }
      return data?.id || null;
    } catch (error) {
      console.error("Error fetching category ID:", error);
      return null;
    }
  }
  /**
   * Find all products with optional filters
   * ✅ FIXED: Fetches seller data separately to show province/city correctly
   * ✅ FIXED: Category filter now uses category_id instead of nested relation
   */
  async findAll(filters: ProductFilters = {}): Promise<ProductDB[]> {
    // ============================================================
    // STEP 1: Build base query for products with categories
    // ============================================================
    let query = supabase
      .from("products")
      .select(`
        *,
        categories ( name )
      `)
      .eq("status", "active"); // Only show active products
    // ============================================================
    // STEP 2: Apply keyword filter (product name)
    // ============================================================
    if (filters.keyword) {
      query = query.ilike("name", `%${filters.keyword}%`);
    }
    // ============================================================
    // STEP 3: Apply category filter - FIXED to use category_id
    // ============================================================
    if (filters.category && filters.category !== "all") {
      const categoryId = await this.getCategoryIdBySlug(filters.category);
      if (categoryId) {
        query = query.eq("category_id", categoryId);
      } else {
        console.warn(`Category "${filters.category}" not found, showing all products`);
      }
    }
    // ============================================================
    // STEP 4: Execute products query
    // ============================================================
    const { data: products, error } = await query;
    if (error) {
      console.error("Error fetching products:", error);
      throw new Error(`Database error: ${error.message}`);
    }
    if (!products || products.length === 0) {
      return [];
    }
    // ============================================================
    // STEP 5: Extract unique seller IDs from products
    // ============================================================
    const sellerIds = [...new Set(
      products
        .map(p => p.seller_id)
        .filter(id => id != null)
    )];
    if (sellerIds.length === 0) {
      // No sellers to fetch, return products as-is (will show "Unknown")
      return products as ProductDB[];
    }
    // ============================================================
    // STEP 6: Batch fetch all sellers in ONE query (performance!)
    // ============================================================
    const { data: sellers, error: sellerError } = await supabase
      .from("sellers")
      .select("id, store_name, pic_city, pic_province, pic_phone")
      .in("id", sellerIds)
      .eq("status", "active");
    if (sellerError) {
      console.warn("Error fetching sellers, continuing without seller data:", sellerError);
      // Graceful degradation: continue without seller data
      return products as ProductDB[];
    }
    // ============================================================
    // STEP 7: Create seller lookup map for O(1) access
    // ============================================================
    const sellerMap = new Map(
      (sellers || []).map(s => [s.id, s])
    );
    // ============================================================
    // STEP 8: Attach seller data to each product
    // ============================================================
    const productsWithSellers = products.map(product => ({
      ...product,
      sellers: sellerMap.get(product.seller_id) || {
        store_name: "Toko Tidak Tersedia",
        pic_city: "Unknown",
        pic_province: "Unknown",
        pic_phone: null,
      }
    }));
    // ============================================================
    // STEP 9: Apply location filter (city OR province)
    // Now we have seller data, so location filter can work!
    // ============================================================
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      return productsWithSellers.filter(p => 
        p.sellers?.pic_city?.toLowerCase().includes(locationLower) ||
        p.sellers?.pic_province?.toLowerCase().includes(locationLower)
      ) as ProductDB[];
    }
    return productsWithSellers as ProductDB[];
  }
  /**
   * Find product by ID with seller info
   * ⚠️ FIXED: Fetch seller separately (no FK constraint)
   */
  async findById(id: string): Promise<ProductDB | null> {
    try {
      // Step 1: Fetch product with category
      const { data: product, error: productError } = await supabase
        .from("products")
        .select(`
          *,
          categories ( name )
        `)
        .eq("id", id)
        .single();
      if (productError) {
        if (productError.code === "PGRST116") {
          // Not found error
          return null;
        }
        throw new Error(`Database error: ${productError.message}`);
      }
      // Step 2: Fetch seller info separately if seller_id exists
      if (product.seller_id) {
        const { data: seller, error: sellerError } = await supabase
          .from("sellers")
          .select("store_name, pic_city, pic_province, pic_phone")
          .eq("id", product.seller_id)
          .eq("status", "active") // Only active sellers
          .single();
        if (!sellerError && seller) {
          // Attach seller info to product
          (product as any).sellers = seller;
        } else {
          // Seller not found or not active
          console.warn(`Seller ${product.seller_id} not found or not active`);
          (product as any).sellers = {
            store_name: "Toko Tidak Aktif",
            pic_city: "Unknown",
            pic_province: "Unknown",
            pic_phone: null,
          };
        }
      }
      return product as ProductDB;
    } catch (error) {
      console.error("ProductRepository.findById error:", error);
      throw error;
    }
  }
  /**
   * Get products by seller ID (for seller dashboard)
   * Uses direct query (no join needed)
   */
  async getBySellerId(sellerId: string) {
    try {
      const supabaseClient = await createClient();
      const { data, error } = await supabaseClient
        .from("products")
        .select(`
          *,
          categories ( id, name, slug )
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
   * Create new product
   * ⚠️ Validates seller_id exists and is active before insert
   */
  async create(payload: any) {
    // Validate seller_id exists
    if (!payload.seller_id) {
      throw new Error("seller_id is required and cannot be null");
    }
    // Verify seller is active
    const { data: seller, error: sellerError } = await supabase
      .from("sellers")
      .select("status")
      .eq("id", payload.seller_id)
      .single();
    if (sellerError || !seller) {
      throw new Error("Seller not found");
    }
    if (seller.status !== "active") {
      throw new Error("Seller is not active. Cannot create product.");
    }
    const supabaseClient = await createClient();
    const { data, error } = await supabaseClient
      .from("products")
      .insert(payload)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  }
  /**
   * Update product
   */
  async update(id: string, payload: any) {
    const supabaseClient = await createClient();
    const { data, error } = await supabaseClient
      .from("products")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  }
  /**
   * Delete product
   */
  async delete(id: string) {
    const supabaseClient = await createClient();
    const { error } = await supabaseClient
      .from("products")
      .delete()
      .eq("id", id);
      
    if (error) throw new Error(error.message);
    return true;
  }
  /**
   * Get all categories
   */
  async getCategories() {
    try {
      const supabaseClient = await createClient();
      const { data, error } = await supabaseClient
        .from("categories")
        .select("id, name")
        .order("name");
        
      if (error) throw new Error(error.message);
      return data || [];
    } catch (error) {
      console.error("ProductRepository.getCategories:", error);
      return [];
    }
  }
  /**
   * Get product statistics for seller dashboard
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
   * Update product rating
   * 
   * ⚠️ DEPRECATED: Use RPC function submit_review_with_rating_sync instead.
   * This method is kept for backward compatibility and emergency manual fixes only.
   * Direct rating updates should be avoided to prevent race conditions.
   * 
   * @param productId - Product UUID
   * @param newRating - New average rating
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
