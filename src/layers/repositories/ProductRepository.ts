import { createClient } from "@/lib/supabase";

export default class ProductRepository {
  async getBySellerId(sellerId: string) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
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

  async create(payload: any) {
    // Validate seller_id exists
    if (!payload.seller_id) {
      throw new Error("seller_id is required and cannot be null");
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from("products").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async findById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories!category_id (
          id,
          name,
          slug
        )
      `)
      .eq("id", id)
      .single();
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
      const { data, error } = await supabase
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
}