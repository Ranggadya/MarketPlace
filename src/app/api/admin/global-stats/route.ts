import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
export async function GET() {
  console.log("⚡ Admin Stats API called");
  // 1. Cek Environment Variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Prioritize the key from .env.local (SUPABASE_SERVICE_ROLE)
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("❌ Missing Env Vars:", {
      supabaseUrl,
      serviceRoleKey: serviceRoleKey ? "Exists" : "Missing",
    });
    return NextResponse.json(
      { error: "Server Configuration Error: Missing Supabase Keys" },
      { status: 500 }
    );
  }
  // 2. Init Supabase Admin Client
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  try {
    // --- A. Product Distribution (Categories) ---
    let productDistribution: { name: string; value: number }[] = [];
    try {
      // Coba ambil kategori beserta jumlah produknya
      const { data: categories, error: catError } = await supabase
        .from("categories")
        .select("name, products(count)");
      if (catError) {
        console.warn(
          "⚠️ Error fetching categories relation:",
          catError.message
        );
        throw catError;
      }
      productDistribution =
        categories?.map((c: any) => ({
          name: c.name,
          value: c.products?.[0]?.count || 0,
        })) || [];
    } catch (err) {
      console.log(
        "⚠️ Fallback: Returning empty product distribution due to error."
      );
    }
    // --- B. Shop Distribution & User Status (Sellers) ---
    let shopDistribution: { name: string; value: number }[] = [];
    let userStatus: { name: string; value: number }[] = [];
    try {
      const { data: sellers, error: sellerError } = await supabase
        .from("sellers")
        .select("pic_province, status"); // ✅ FIXED: pic_province (bukan province)
      if (sellerError) throw sellerError;
      if (sellers) {
        const shopMap: Record<string, number> = {};
        let active = 0;
        let inactive = 0;
        sellers.forEach((s: any) => {
          // Shop Distribution
          const prov = s.pic_province || "Unknown"; // ✅ FIXED: pic_province
          shopMap[prov] = (shopMap[prov] || 0) + 1;
          // User Status
          const st = s.status?.toUpperCase();
          if (st === "APPROVED" || st === "ACTIVE") active++;
          else inactive++;
        });
        shopDistribution = Object.entries(shopMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);
        userStatus = [
          { name: "Active Sellers", value: active },
          { name: "Inactive Sellers", value: inactive },
        ];
      }
    } catch (err: any) {
      console.error("❌ Error fetching sellers:", err.message);
      // Jangan throw error agar dashboard tetap jalan sebagian
    }
    // --- C. Engagement (Reviews & Ratings) ---
    let totalRatings = 0;
    let totalComments = 0;
    try {
      // 1. Count Ratings (where rating is not null)
      // ✅ FIXED: guest_reviews (bukan reviews)
      const { count: ratingCount, error: ratingError } = await supabase
        .from("guest_reviews")
        .select("*", { count: "exact", head: true })
        .not("rating", "is", null);
      if (!ratingError && ratingCount !== null) totalRatings = ratingCount;
      // 2. Count Comments (where comment is not empty)
      // ✅ FIXED: guest_reviews (bukan reviews)
      const { count: commentCount, error: commentError } = await supabase
        .from("guest_reviews")
        .select("*", { count: "exact", head: true })
        .neq("comment", "");
      if (!commentError && commentCount !== null) totalComments = commentCount;
    } catch (err) {
      console.warn("⚠️ Error fetching reviews:", err);
    }
    console.log("✅ Stats fetched successfully");
    return NextResponse.json({
      productDistribution,
      shopDistribution,
      userStatus,
      totalRatings,
      totalComments,
    });
  } catch (error: any) {
    console.error("🔥 CRITICAL API ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
