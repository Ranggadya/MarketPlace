import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }
    // ========================================
    // 0. CHECK ADMIN (Hardcoded)
    // ========================================
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (email === adminEmail && password === adminPassword) {
      console.log("✅ Admin login successful:", email);
      
      const response = NextResponse.json({
        success: true,
        role: "admin",
        account: {
          id: "admin-001",
          email: email,
          name: "Administrator",
        },
      });
      // Set admin session flag in cookie
      response.cookies.set('admin-session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      return response;
    }
    // ========================================
    // 1. CHECK SELLER (via Supabase Auth)
    // ========================================
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    // Try to login with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authData?.user && authData?.session) {
      // Check if user is a seller
      const { data: sellerData, error: sellerError } = await supabase
        .from("sellers")
        .select("*")
        .eq("id", authData.user.id)
        .single();
      if (sellerData) {
        // ⭐ CHECK IF ACTIVE (approved)
        if (sellerData.status !== "active") {
          // Sign out immediately
          await supabase.auth.signOut();
          
          return NextResponse.json(
            {
              success: false,
              message: `Akun Anda berstatus "${sellerData.status}". ${
                sellerData.status === "pending"
                  ? "Mohon tunggu persetujuan admin."
                  : sellerData.status === "rejected"
                  ? `Alasan: ${sellerData.rejection_reason || "Tidak memenuhi syarat"}`
                  : "Hubungi admin untuk informasi lebih lanjut."
              }`,
            },
            { status: 403 }
          );
        }
        console.log("✅ Seller login successful:", email);
        // ⭐ FIX: Extract session tokens and set cookies
        const accessToken = authData.session.access_token;
        const refreshToken = authData.session.refresh_token;
        const response = NextResponse.json({
          success: true,
          role: "seller",
          account: {
            id: sellerData.id,
            email: sellerData.pic_email,
            name: sellerData.pic_name,
            store_name: sellerData.store_name,
            store_description: sellerData.store_description,
            status: sellerData.status,
          },
          session: authData.session,
        });
        // ⭐ SET COOKIES for middleware to read
        response.cookies.set('sb-access-token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });
        response.cookies.set('sb-refresh-token', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });
        // Also set user ID for quick middleware checks
        response.cookies.set('sb-user-id', authData.user.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });
        return response;
      }
    }
    // ========================================
    // 2. LOGIN FAILED
    // ========================================
    return NextResponse.json(
      { success: false, message: "Email atau password salah" },
      { status: 401 }
    );
  } catch (err) {
    console.error("❌ Login API Error:", err);
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}
