import { supabase } from "@/lib/supabase";
import { SellerEntity, SellerRecord } from "@/lib/models/SellerEntity";

export class SellerRepository {
  async create(entity: SellerEntity): Promise<SellerRecord> {
    const payload = entity.toObject();

    const { data, error } = await supabase
      .from("sellers")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Supabase Insert Error:", error);
      throw new Error(error.message);
    }

    return data as SellerRecord;
  }

  async findByEmail(email: string): Promise<SellerRecord | null> {
    const { data, error } = await supabase
      .from("sellers")
      .select()
      .eq("pic_email", email)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return data as SellerRecord;
  }

  async findById(id: string): Promise<SellerRecord | null> {
    const { data, error } = await supabase
      .from("sellers")
      .select()
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return data as SellerRecord;
  }

  async findAll(): Promise<SellerRecord[]> {
    const { data, error } = await supabase
      .from("sellers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data as SellerRecord[]) ?? [];
  }


  async updateStatus(
    id: string,
    status: "PENDING" | "ACTIVE" | "REJECTED",
    reason?: string
  ): Promise<SellerRecord> {
    const { data, error } = await supabase
      .from("sellers")
      .update({
        status,
        rejection_reason: reason ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data as SellerRecord;
  }

}
