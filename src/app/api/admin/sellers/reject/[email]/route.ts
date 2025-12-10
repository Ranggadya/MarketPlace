import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendRejectionEmail } from "@/lib/email";
export async function POST(
  req: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    // ✅ Await params before accessing
    const { email } = await params;
    const sellerEmail = decodeURIComponent(email);
    const body = await req.json();
    const reason = body.reason || "Tidak memenuhi persyaratan";
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
    // 2. GET SELLER DATA BY EMAIL
    // ===================================
    const { data: seller, error: fetchError } = await supabase
      .from("sellers")
      .select("*")
      .eq("pic_email", sellerEmail)
      .single();
    if (fetchError || !seller) {
      return NextResponse.json(
        { success: false, message: "Seller tidak ditemukan" },
        { status: 404 }
      );
    }
    if (seller.status !== "pending") {
      return NextResponse.json(
        { success: false, message: `Seller sudah ${seller.status}` },
        { status: 400 }
      );
    }
    // ===================================
    // 3. UPDATE SELLERS TABLE (SET STATUS REJECTED)
    // ===================================
    const { data: updated, error: updateError } = await supabase
      .from("sellers")
      .update({
        status: "rejected",
        rejection_reason: reason,
        // ✅ REMOVED: rejected_at (column doesn't exist in database schema)
        // NOTE: updated_at will automatically update via database trigger
      })
      .eq("pic_email", sellerEmail) // ⭐ USE EMAIL (not id)
      .select()
      .single();
    if (updateError) {
      console.error("❌ Seller update error:", updateError);
      return NextResponse.json(
        { success: false, message: `Gagal update seller: ${updateError.message}` },
        { status: 400 }
      );
    }
    console.log("✅ Seller rejected:", updated);
    // ===================================
    // 4. SEND REJECTION EMAIL
    // ===================================
    try {
      await sendRejectionEmail({
        to: seller.pic_email,
        name: seller.pic_name,
        storeName: seller.store_name,
        reason: reason,
      });
      console.log("✅ Rejection email sent to:", seller.pic_email);
    } catch (emailError) {
      console.error("❌ Email send error:", emailError);
      // Don't fail the rejection if email fails
    }
    return NextResponse.json({
      success: true,
      result: updated,
      message: "Seller berhasil ditolak dan email telah dikirim",
    });
  } catch (err) {
    console.error("❌ Reject API Error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
