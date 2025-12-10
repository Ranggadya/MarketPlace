import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Server Configuration Error" },
      { status: 500 }
    );
  }
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  try {
    let data: any[] = [];
    if (type === "SELLERS_STATUS") {
      // Laporan daftar akun penjual aktif dan tidak aktif
      const { data: sellers, error } = await supabase
        .from("sellers")
        .select("id, store_name, status, created_at");
      if (error) throw error;
      data = sellers.map((s: any) => ({
        store_name: s.store_name,
        status: s.status,
        is_verified: s.status === "APPROVED" || s.status === "ACTIVE",
        created_at: s.created_at,
      }));
    } else if (type === "SELLERS_LOCATION") {
      // Laporan daftar penjual (toko) untuk setiap Lokasi propinsi
      // ✅ FIXED: Menggunakan pic_province dan pic_city (sesuai schema)
      const { data: sellers, error } = await supabase
        .from("sellers")
        .select("id, store_name, pic_province, pic_city")
        .order("pic_province", { ascending: true });
      if (error) throw error;
      data = sellers.map((s: any) => ({
        store_name: s.store_name,
        province: s.pic_province, // ✅ FIXED: pic_province
        city: s.pic_city,         // ✅ FIXED: pic_city
      }));
    } else if (type === "PRODUCTS_RATING") {
      console.log("🔍 Fetching PRODUCTS_RATING...");
      // Attempt 1: Full Join
      // ✅ FIXED: sellers (store_name, pic_province) bukan province
      // ✅ FIXED: guest_reviews (bukan reviews)
      let { data: products, error } = await supabase.from("products").select(`
          id, 
          name, 
          price, 
          categories (name),
          sellers (store_name, pic_province),
          guest_reviews (rating)
        `);
      if (error) {
        console.warn("⚠️ Attempt 1 (Full Join) failed:", error.message);
        // Attempt 2: Manual fetching fallback
        const { data: basicProducts, error: basicError } = await supabase.from(
          "products"
        ).select(`
            id, 
            name, 
            price,
            seller_id,
            category_id
          `);
        if (basicError) {
          console.error(
            "❌ Critical: Failed to fetch basic products:",
            basicError.message
          );
          throw basicError;
        }
        // Manual Fetching for relations (N+1 problem but safe fallback)
        console.log("⚠️ Switching to Manual Fetching for relations...");
        const sellerIds = [
          ...new Set(
            basicProducts.map((p: any) => p.seller_id).filter(Boolean)
          ),
        ];
        const categoryIds = [
          ...new Set(
            basicProducts.map((p: any) => p.category_id).filter(Boolean)
          ),
        ];
        // ✅ FIXED: Select pic_province instead of province
        const { data: sellers } = await supabase
          .from("sellers")
          .select("id, store_name, pic_province")
          .in("id", sellerIds);
        const { data: categories } = await supabase
          .from("categories")
          .select("id, name")
          .in("id", categoryIds);
        // Map manually
        data = basicProducts.map((p: any) => {
          const seller = sellers?.find((s: any) => s.id === p.seller_id);
          const category = categories?.find((c: any) => c.id === p.category_id);
          return {
            name: p.name,
            rating: 0, // Default 0 if reviews fail
            price: p.price,
            category: category?.name || "Uncategorized",
            store_name: seller?.store_name || "Unknown Store",
            province: seller?.pic_province || "Unknown Location", // ✅ FIXED
          };
        });
      } else {
        // Happy Path: Full Join Succeeded
        // ✅ FIXED: p.guest_reviews (bukan p.reviews)
        data = (products || []).map((p: any) => {
          const ratings = p.guest_reviews?.map((r: any) => r.rating) || [];
          const avgRating =
            ratings.length > 0
              ? ratings.reduce((a: number, b: number) => a + b, 0) /
                ratings.length
              : 0;
          return {
            name: p.name,
            rating: avgRating,
            price: p.price,
            category: p.categories?.name || "Uncategorized",
            store_name: p.sellers?.store_name || "Unknown Store",
            province: p.sellers?.pic_province || "Unknown Location", // ✅ FIXED
          };
        });
      }
      // Sort by rating descending
      data.sort((a: any, b: any) => b.rating - a.rating);
    } else if (type === "LATEST_REVIEWS") {
      // Fetch reviews with product info
      // ✅ FIXED: guest_reviews (bukan reviews)
      const { data: reviews, error } = await supabase
        .from("guest_reviews")
        .select(
          `
          id,
          rating,
          comment,
          created_at,
          products (name, images)
        `
        )
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      data = reviews.map((r: any) => ({
        id: r.id,
        product_name: r.products?.name || "Unknown Product",
        product_image: Array.isArray(r.products?.images)
          ? r.products.images[0]
          : r.products?.images,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
        reviewer: "Pengunjung",
      }));
    } else {
      return NextResponse.json(
        { error: "Invalid report type" },
        { status: 400 }
      );
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Report API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
