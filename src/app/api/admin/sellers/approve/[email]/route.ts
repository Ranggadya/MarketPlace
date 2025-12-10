import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendApprovalEmail } from "@/lib/email";
export async function POST(
  req: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    // ✅ Await params before accessing
    const { email } = await params;
    const sellerEmail = decodeURIComponent(email);
    // ===================================
    // 1. INIT SUPABASE ADMIN CLIENT
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
    // 3. GENERATE RANDOM PASSWORD
    // ===================================
    const password = generatePassword(12);
    console.log("🔐 Generated password for:", seller.pic_email);
    // ===================================
    // 4. CHECK IF AUTH USER ALREADY EXISTS
    // ===================================
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(
      (u) => u.email === seller.pic_email
    );
    let userId: string;
    let isNewUser = false;
    if (existingUser) {
      // ✅ USER ALREADY EXISTS - REUSE IT
      userId = existingUser.id;
      console.log("✅ Auth user already exists, reusing ID:", userId);
      // Update user metadata (in case store info changed)
      const { error: updateMetaError } = await supabase.auth.admin.updateUserById(
        userId,
        {
          user_metadata: {
            name: seller.pic_name,
            role: "seller",
            store_name: seller.store_name,
          },
        }
      );
      if (updateMetaError) {
        console.warn("⚠️ Failed to update user metadata:", updateMetaError);
        // Don't fail the approval, just log warning
      }
      // Reset password for re-approval scenario
      const { error: resetPwError } = await supabase.auth.admin.updateUserById(
        userId,
        {
          password: password,
        }
      );
      if (resetPwError) {
        console.warn("⚠️ Failed to reset password:", resetPwError);
        // Don't fail the approval, use old password flow
      } else {
        console.log("✅ Password reset for existing user");
      }
    } else {
      // ✅ CREATE NEW AUTH USER
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: seller.pic_email,
        password: password,
        email_confirm: true, // Auto-confirm
        user_metadata: {
          name: seller.pic_name,
          role: "seller",
          store_name: seller.store_name,
        },
      });
      if (authError || !authData.user) {
        console.error("❌ Auth user creation failed:", authError);
        return NextResponse.json(
          {
            success: false,
            message: authError?.message || "Gagal membuat akun auth",
          },
          { status: 400 }
        );
      }
      userId = authData.user.id;
      isNewUser = true;
      console.log("✅ New auth user created with ID:", userId);
    }
    // ===================================
    // 5. UPDATE SELLERS TABLE (SET ID + STATUS ACTIVE)
    // ===================================
    const { data: updated, error: updateError } = await supabase
      .from("sellers")
      .update({
        id: userId, // ⭐ SET AUTH USER ID
        status: "active", // ⭐ STATUS = ACTIVE (approved)
        approved_at: new Date().toISOString(),
        generated_password: password,
      })
      .eq("pic_email", sellerEmail) // ⭐ USE EMAIL (not id, because id might be null)
      .select()
      .single();
    if (updateError) {
      console.error("❌ Seller update error:", updateError);
      // Rollback: Delete auth user ONLY if it was newly created
      if (isNewUser) {
        await supabase.auth.admin.deleteUser(userId);
        console.log("🔄 Rolled back: Deleted newly created auth user");
      }
      return NextResponse.json(
        { success: false, message: `Gagal update seller: ${updateError.message}` },
        { status: 400 }
      );
    }
    console.log("✅ Seller approved:", updated);
    // ===================================
    // 6. SEND APPROVAL EMAIL
    // ===================================
    try {
      await sendApprovalEmail({
        to: seller.pic_email,
        name: seller.pic_name,
        storeName: seller.store_name,
        email: seller.pic_email,
        password: password,
      });
      console.log("✅ Approval email sent to:", seller.pic_email);
    } catch (emailError) {
      console.error("❌ Email send error:", emailError);
      // Don't fail the approval if email fails
    }
    return NextResponse.json({
      success: true,
      result: updated,
      message: existingUser
        ? "Seller berhasil disetujui dengan akun existing dan email telah dikirim"
        : "Seller berhasil disetujui dan email telah dikirim",
    });
  } catch (err) {
    console.error("❌ Approve API Error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
// ===================================
// HELPER: GENERATE RANDOM PASSWORD
// ===================================
function generatePassword(length: number): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  // Ensure at least one uppercase, one lowercase, one number, one special char
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
  password += "0123456789"[Math.floor(Math.random() * 10)];
  password += "!@#$%^&*"[Math.floor(Math.random() * 8)];
  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  // Shuffle
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}
