import { supabase } from "@/lib/supabase";
import { SellerEntity, SellerRecord } from "@/lib/models/SellerEntity";

type SellerUpdatePayload = {
  status: "PENDING" | "ACTIVE" | "REJECTED";
  updated_at: string;
  rejection_reason?: string | null;
};

export class SellerRepository {

  async create(entity: SellerEntity): Promise<SellerRecord> {
    const payload = entity.toObject();

    const { data, error } = await supabase
      .from("sellers")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error("Supabase Insert Error:", error);
      throw new Error(error.message);
    }

    return data as SellerRecord;
  }

  /** Find seller by email */
  async findByEmail(email: string): Promise<SellerRecord | null> {
    const { data, error } = await supabase
      .from("sellers")
      .select("*")
      .eq("pic_email", email)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as SellerRecord) ?? null;
  }

  /** Find seller by ID */
  async findById(id: string): Promise<SellerRecord | null> {
    const { data, error } = await supabase
      .from("sellers")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as SellerRecord) ?? null;
  }

  /** List all sellers */
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

    const payload: SellerUpdatePayload = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Jika REJECTED, simpan alasan
    if (status === "REJECTED") {
      payload.rejection_reason = reason ?? null;
    }

    const { data, error } = await supabase
      .from("sellers")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return data as SellerRecord;
  }
}
