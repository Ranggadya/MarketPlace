import { createClient } from "@/lib/supabase";

export default class ProductRepository {
  async getBySellerId(sellerId: string) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select(`*, category:categories(name)`)
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

  async create(payload: any) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("products").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async findById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, payload: any) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("products").update(payload).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async delete(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return true;
  }

  async getCategories() {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.from("categories").select("id, name").order("name");
      if (error) throw new Error(error.message);
      return data || [];
    } catch (error) {
      console.error("ProductRepository.getCategories:", error);
      return [];
    }
  }

  async getProductStats(sellerId: string) {
    try {
      const supabase = await createClient();
      
      // Get all products for this seller
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", sellerId);

      if (error) throw new Error(error.message);

      const allProducts = products || [];
      
      // Calculate statistics
      const totalProducts = allProducts.length;
      const activeProducts = allProducts.filter(p => p.status === "active").length;
      const criticalStock = allProducts.filter(p => p.stock < 2).length;
      const totalValue = allProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
      
      // Get average rating
      const productsWithRating = allProducts.filter(p => p.rating);
      const avgRating = productsWithRating.length > 0 
        ? productsWithRating.reduce((sum, p) => sum + p.rating, 0) / productsWithRating.length 
        : 0;

      return {
        totalProducts,
        activeProducts,
        criticalStock,
        totalValue,
        avgRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        lowStockProducts: allProducts.filter(p => p.stock < 5).length,
        outOfStockProducts: allProducts.filter(p => p.stock === 0).length,
      };
    } catch (error) {
      console.error("ProductRepository.getProductStats:", error);
      throw error;
    }
  }
}