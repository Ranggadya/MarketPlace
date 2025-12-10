import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    // ===================================
    // 1. INIT SUPABASE CLIENT
    // ===================================
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    // ===================================
    // 2. EXTRACT FORM DATA
    // ===================================
    const email = String(form.get("picEmail") || "");
    const picName = String(form.get("picName") || "");
    // Check if email already exists
    const { data: existingSeller } = await supabase
      .from("sellers")
      .select("pic_email")
      .eq("pic_email", email)
      .single();
    if (existingSeller) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }
    // ===================================
    // 3. UPLOAD FILES
    // ===================================
    const photo = form.get("picPhotoPath") as File | null;
    const ktp = form.get("picKtpFilePath") as File | null;
    let photoUrl: string | null = null;
    let ktpUrl: string | null = null;
    // Generate unique ID for file naming
    const tempId = crypto.randomUUID();
    // Upload Foto Penjual
    if (photo && photo.size > 0) {
      console.log("📸 Uploading photo:", photo.name);
      const upload = await supabase.storage
        .from("seller-files")
        .upload(`photo-${tempId}-${Date.now()}.jpg`, photo);
      if (upload.error) {
        console.error("❌ Photo upload error:", upload.error);
      } else {
        const publicUrl = supabase.storage
          .from("seller-files")
          .getPublicUrl(upload.data!.path);
        photoUrl = publicUrl.data.publicUrl;
        console.log("✅ Photo uploaded:", photoUrl);
      }
    }
    // Upload Foto KTP
    if (ktp && ktp.size > 0) {
      console.log("🆔 Uploading KTP:", ktp.name);
      const upload = await supabase.storage
        .from("seller-files")
        .upload(`ktp-${tempId}-${Date.now()}.jpg`, ktp);
      if (upload.error) {
        console.error("❌ KTP upload error:", upload.error);
      } else {
        const publicUrl = supabase.storage
          .from("seller-files")
          .getPublicUrl(upload.data!.path);
        ktpUrl = publicUrl.data.publicUrl;
        console.log("✅ KTP uploaded:", ktpUrl);
      }
    }
    // ===================================
    // 4. INSERT INTO SELLERS TABLE (NO ID, NO AUTH YET)
    // ===================================
    const sellerData = {
      // ⭐ NO ID - will be set when approved
      store_name: String(form.get("storeName") || ""),
      store_description: form.get("storeDescription")
        ? String(form.get("storeDescription"))
        : null,
      pic_name: picName,
      pic_phone: String(form.get("picPhone") || ""),
      pic_email: email,
      pic_street: String(form.get("picStreet") || ""),
      pic_rt: String(form.get("picRT") || ""),
      pic_rw: String(form.get("picRW") || ""),
      pic_village: String(form.get("picVillage") || ""),
      pic_city: String(form.get("picCity") || ""),
      pic_province: String(form.get("picProvince") || ""),
      pic_ktp_number: String(form.get("picKtpNumber") || ""),
      pic_photo_url: photoUrl,
      pic_ktp_url: ktpUrl,
      status: "pending", // ⭐ PENDING - waiting for admin approval
    };
    console.log("📤 Inserting seller data (pending approval):", sellerData);
    const { data: inserted, error: insertError } = await supabase
      .from("sellers")
      .insert(sellerData)
      .select()
      .single();
    if (insertError) {
      console.error("❌ Seller insert error:", insertError);
      return NextResponse.json(
        { success: false, message: `Gagal menyimpan data: ${insertError.message}` },
        { status: 400 }
      );
    }
    console.log("✅ Seller registered (pending approval):", inserted);
    return NextResponse.json({
      success: true,
      result: inserted,
      message:
        "Registrasi berhasil! Data Anda sedang diverifikasi oleh admin. Anda akan menerima email jika akun disetujui.",
    });
  } catch (err) {
    console.error("❌ Registration API Error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
