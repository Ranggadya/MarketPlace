import { NextResponse } from "next/server";
import { SellerController } from "@/layers/controllers/SellerController";
import { supabase } from "@/lib/supabase";

const controller = new SellerController();

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // Ambil file
    const photo = form.get("picPhotoPath") as File | null;
    const ktp = form.get("picKtpFilePath") as File | null;

    let photoUrl: string | undefined = undefined;
    let ktpUrl: string | undefined = undefined;

    // Upload Foto Penjual
    if (photo) {
      const upload = await supabase.storage
        .from("seller-files")
        .upload(`photo-${Date.now()}.jpg`, photo);

      if (upload.error) throw new Error(upload.error.message);

      photoUrl = supabase.storage
        .from("seller-files")
        .getPublicUrl(upload.data.path)
        .data.publicUrl;
    }

    // Upload Foto KTP
    if (ktp) {
      const upload = await supabase.storage
        .from("seller-files")
        .upload(`ktp-${Date.now()}.jpg`, ktp);

      if (upload.error) throw new Error(upload.error.message);

      ktpUrl = supabase.storage
        .from("seller-files")
        .getPublicUrl(upload.data.path)
        .data.publicUrl;
    }

    // Semua TEXT FIELD -- aman untuk TypeScript
    const body = {
      storeName: String(form.get("storeName") || ""),
      storeDescription:
        form.get("storeDescription")?.toString() || undefined,

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

      // FILE URLS
      picPhotoPath: photoUrl,
      picKtpFilePath: ktpUrl,

      // Tambahkan password (WAJIB ADA)
      password: String(form.get("password") || "")
    };

    const result = await controller.register(body);
    return NextResponse.json({ success: true, result });

  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 400 }
    );
  }
}
