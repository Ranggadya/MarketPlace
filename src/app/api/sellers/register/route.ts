import { NextResponse } from "next/server";
import { SellerController } from "@/layers/controllers/SellerController";
import { supabase } from "@/lib/supabase";

const controller = new SellerController();

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const photo = form.get("picPhotoPath") as File | null;
    const ktp = form.get("picKtpFilePath") as File | null;

    let photoUrl: string | undefined;
    let ktpUrl: string | undefined;

    async function uploadFile(file: File, prefix: string) {
      const ext = file.name.split(".").pop() || "file";
      const filename = `${prefix}-${Date.now()}.${ext}`;

      const { data, error } = await supabase.storage
        .from("seller-files")
        .upload(filename, file);

      if (error) throw new Error(error.message);

      const { data: urlData } = supabase.storage
        .from("seller-files")
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    }

    if (photo) {
      photoUrl = await uploadFile(photo, "photo");
    }

    if (ktp) {
      ktpUrl = await uploadFile(ktp, "ktp");
    }

    const body = {
      storeName: String(form.get("storeName") || ""),
      storeDescription: form.get("storeDescription")?.toString() || undefined,

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

      picPhotoPath: photoUrl,
      picKtpFilePath: ktpUrl,
      password: String(form.get("password") || "")
    };

    const result = await controller.register(body);

    return NextResponse.json(
      { success: true, message: "Registrasi berhasil", data: result },
      { status: 201 }
    );

  } catch (err: unknown) {
    console.error("❌ REGISTER ERROR:", err);

    let message = "Terjadi kesalahan server";

    if (err instanceof Error) {
      message = err.message;
    }

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 }
    );
  }
}
