import { supabase } from "@/lib/supabase";
import { SellerProps } from "@lib/models/Seller";
import { toSnakeCase, toCamelCase } from "@/lib/utils/caseConverter";
export default class SellerRepository {
  async create(data: SellerProps) {
    // Convert camelCase to snake_case before INSERT
    const dbData = toSnakeCase(data);
    console.log("📤 Inserting to DB (snake_case):", dbData);
    const { data: inserted, error } = await supabase
      .from("sellers")
      .insert(dbData)
      .select()
      .single();
    if (error) {
      console.error("❌ Supabase INSERT error:", error);
      throw new Error(error.message);
    }
    console.log("✅ Seller created successfully:", inserted);
    return inserted;
  }
  async findAll() {
    const { data, error } = await supabase.from("sellers").select("*");
    if (error) throw new Error(error.message);
    
    // Optionally convert response to camelCase
    // return data?.map(item => toCamelCase(item)) || [];
    return data;
  }
  async findById(id: string) {
    const { data, error } = await supabase
      .from("sellers")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    
    // Optionally convert response to camelCase
    // return toCamelCase(data);
    return data;
  }
}
