import { supabase } from "@/lib/supabase";
import { SellerProps } from "@lib/models/Seller";

export default class SellerRepository {
  async create(data: SellerProps) {
    const { data: inserted, error } = await supabase
      .from("sellers")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return inserted;
  }

  async findAll() {
    const { data, error } = await supabase.from("sellers").select("*");
    if (error) throw new Error(error.message);
    return data;
  }

  async findById(id: string) {
    const { data, error } = await supabase
      .from("sellers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}
