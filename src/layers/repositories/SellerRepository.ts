import { supabase } from "@/lib/supabase";
import { SellerRecord } from "@/lib/models/SellerEntity";

export class SellerRepository {
  async create(data: SellerRecord) {
    const { data: inserted, error } = await supabase
      .from("sellers")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return inserted;
  }

  async findByEmail(email: string) {
    const { data, error } = await supabase
      .from("sellers")
      .select("*")
      .eq("pic_email", email)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ?? null;
  }

  async findById(id: string) {
    const { data, error } = await supabase
      .from("sellers")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data ?? null;
  }
}
