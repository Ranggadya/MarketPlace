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
      const buffer = await file.arrayBuffer();

      const { data, error } = await supabase.storage
        .from("seller-files")
        .upload(filename, buffer, {
          contentType: file.type,
        });

      if (error) throw new Error(error.message);

      const { data: urlData } = supabase.storage
        .from("seller-files")
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    }

    if (photo) photoUrl = await uploadFile(photo, "photo");
    if (ktp) ktpUrl = await uploadFile(ktp, "ktp");

    const body = {
      storeName: form.get("storeName")?.toString() || "",
      storeDescription: form.get("storeDescription")?.toString() || undefined,

      picName: form.get("picName")?.toString() || "",
      picPhone: form.get("picPhone")?.toString() || "",
      picEmail: form.get("picEmail")?.toString() || "",

      picStreet: form.get("picStreet")?.toString() || "",
      picRT: form.get("picRT")?.toString() || "",
      picRW: form.get("picRW")?.toString() || "",
      picVillage: form.get("picVillage")?.toString() || "",
      picCity: form.get("picCity")?.toString() || "",
      picProvince: form.get("picProvince")?.toString() || "",

      picKtpNumber: form.get("picKtpNumber")?.toString() || "",

      picPhotoPath: photoUrl,
      picKtpFilePath: ktpUrl,

      password: form.get("password")?.toString() || "",
    };

    const result = await controller.register(body);

    return NextResponse.json(
      { success: true, message: "Registrasi berhasil", data: result },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan server";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
