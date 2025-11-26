import { NextResponse } from "next/server";
import { SellerController } from "@/layers/controllers/SellerController";
import { supabase } from "@/lib/supabase";

const controller = new SellerController();

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // FILE UPLOADS
    const photo = form.get("picPhotoPath") as File | null;
    const ktp = form.get("picKtpFilePath") as File | null;

    let photoUrl: string | null = null;
    let ktpUrl: string | null = null;

    // Upload Foto Penjual
    if (photo) {
      const upload = await supabase.storage
        .from("seller-files")
        .upload(`photo-${Date.now()}.jpg`, photo);

      if (upload.error) {
        throw new Error(upload.error.message);
      }

      const publicUrl = supabase.storage
        .from("seller-files")
        .getPublicUrl(upload.data!.path);

      photoUrl = publicUrl.data.publicUrl;
    }

    // Upload Foto KTP
    if (ktp) {
      const upload = await supabase.storage
        .from("seller-files")
        .upload(`ktp-${Date.now()}.jpg`, ktp);

      if (upload.error) {
        throw new Error(upload.error.message);
      }

      const publicUrl = supabase.storage
        .from("seller-files")
        .getPublicUrl(upload.data!.path);

      ktpUrl = publicUrl.data.publicUrl;
    }

    // TEXT FIELDS - TypeScript safe
    const body = {
      storeName: String(form.get("storeName") || ""),
      storeDescription: form.get("storeDescription")
        ? String(form.get("storeDescription"))
        : undefined,

      picName: String(form.get("picName") || ""),
      picPhone: String(form.get("picPhone") || ""),
      picEmail: String(form.get("picEmail") || ""),

      picStreet: String(form.get("picStreet") || ""),
      picRT: String(form.get("picRT") || ""),
      picRW: String(form.get("picRW") || ""),
      picVillage: String(form.get("picVillage") || ""),
      picCity: String(form.get("picCity") || ""),
      picProvince: String(form.get("picProvince") || ""),

      picKtpNumber: String(form.get("picKtpNumber") || ""),

      picPhotoPath: photoUrl ?? undefined,
      picKtpFilePath: ktpUrl ?? undefined,
    };

    const result = await controller.store(body);

    return NextResponse.json({ success: true, result });

  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, message: msg }, { status: 400 });
  }
}
