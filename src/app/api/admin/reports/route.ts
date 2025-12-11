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
        .select("id, store_name, status, created_at, pic_name, pic_email");
      
      if (error) throw error;
      
      data = sellers.map((s: any) => ({
        user_name: s.pic_email, // Using email as User Name
        pic_name: s.pic_name,
        store_name: s.store_name,
        status: s.status,
        is_verified: s.status === "APPROVED" || s.status === "ACTIVE",
        created_at: s.created_at,
      }));

      // Sort: Active/Approved first, then others
      data.sort((a, b) => {
        const statusA = (a.status || "").toUpperCase();
        const statusB = (b.status || "").toUpperCase();
        
        const aActive = statusA === "APPROVED" || statusA === "ACTIVE";
        const bActive = statusB === "APPROVED" || statusB === "ACTIVE";
        
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;
        return 0;
      });

    } else if (type === "SELLERS_LOCATION") {
      // Laporan daftar penjual (toko) untuk setiap Lokasi propinsi
      const { data: sellers, error } = await supabase
        .from("sellers")
        .select("id, store_name, pic_province, pic_city, pic_name")
        .order("pic_province", { ascending: true });
      
      if (error) throw error;
      
      data = sellers.map((s: any) => ({
        store_name: s.store_name,
        pic_name: s.pic_name,
        province: s.pic_province,
        city: s.pic_city,
      }));
    } else if (type === "PRODUCTS_RATING") {
      console.log("🔍 [ADMIN REPORT] Fetching PRODUCTS_RATING...");
      
      // Attempt 1: Full Join with reviews
      let { data: products, error } = await supabase.from("products").select(`
          id, 
          name, 
          price, 
          rating,
          categories (name),
          sellers (store_name, pic_province),
          guest_reviews (rating)
        `);
      
      if (error) {
        console.warn("⚠️ [ADMIN REPORT] Attempt 1 (Full Join) failed:", error.message);
        
        // Attempt 2: Manual fetching fallback
        const { data: basicProducts, error: basicError } = await supabase
          .from("products")
          .select(`id, name, price, rating, seller_id, category_id`);
        
        if (basicError) {
          console.error("❌ [ADMIN REPORT] Critical: Failed to fetch basic products:", basicError.message);
          throw basicError;
        }
        
        console.log("⚠️ [ADMIN REPORT] Switching to Manual Fetching...");
        
        // Fetch related data
        const sellerIds = [...new Set(basicProducts.map((p: any) => p.seller_id).filter(Boolean))];
        const categoryIds = [...new Set(basicProducts.map((p: any) => p.category_id).filter(Boolean))];
        const productIds = basicProducts.map((p: any) => p.id);
        
        const { data: sellers } = await supabase
          .from("sellers")
          .select("id, store_name, pic_province")
          .in("id", sellerIds);
        
        const { data: categories } = await supabase
          .from("categories")
          .select("id, name")
          .in("id", categoryIds);
        
        // ✅ CRITICAL FIX: Fetch reviews separately and calculate rating
        const { data: reviews } = await supabase
          .from("guest_reviews")
          .select("product_id, rating")
          .in("product_id", productIds);
        
        // Group reviews by product
        const reviewsByProduct = new Map<string, number[]>();
        reviews?.forEach((review: any) => {
          if (!reviewsByProduct.has(review.product_id)) {
            reviewsByProduct.set(review.product_id, []);
          }
          reviewsByProduct.get(review.product_id)!.push(review.rating);
        });
        
        // Map manually with calculated ratings
        data = basicProducts.map((p: any) => {
          const seller = sellers?.find((s: any) => s.id === p.seller_id);
          const category = categories?.find((c: any) => c.id === p.category_id);
          const productReviews = reviewsByProduct.get(p.id) || [];
          
          // Calculate average rating from reviews OR use products.rating column
          let avgRating = p.rating || 0;
          if (productReviews.length > 0) {
            avgRating = productReviews.reduce((sum, r) => sum + r, 0) / productReviews.length;
          }
          
          return {
            name: p.name,
            rating: avgRating,
            price: p.price,
            category: category?.name || "Uncategorized",
            store_name: seller?.store_name || "Unknown Store",
            province: seller?.pic_province || "Unknown Location",
          };
        });
        
        console.log(`✅ [ADMIN REPORT] Manual fetch complete: ${data.length} products`);
      } else {
        // Happy Path: Full Join Succeeded
        console.log(`✅ [ADMIN REPORT] Full join succeeded: ${products?.length || 0} products`);
        
        data = (products || []).map((p: any) => {
          const ratings = p.guest_reviews?.map((r: any) => r.rating) || [];
          
          // Use calculated average from reviews OR fallback to products.rating column
          let avgRating = p.rating || 0;
          if (ratings.length > 0) {
            avgRating = ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length;
          }
          
          return {
            name: p.name,
            rating: avgRating,
            price: p.price,
            category: p.categories?.name || "Uncategorized",
            store_name: p.sellers?.store_name || "Unknown Store",
            province: p.sellers?.pic_province || "Unknown Location",
          };
        });
      }
      
      // Sort by rating descending
      data.sort((a: any, b: any) => b.rating - a.rating);
      
      // ✅ DEBUG LOG: Show sample data
      console.log(`📊 [ADMIN REPORT] Total products: ${data.length}`);
      console.log(`📊 [ADMIN REPORT] Sample data:`, data.slice(0, 3).map(d => ({
        name: d.name,
        rating: d.rating,
        store: d.store_name
      })));
      
    } else if (type === "LATEST_REVIEWS") {
      // Fetch reviews with product info
      const { data: reviews, error } = await supabase
        .from("guest_reviews")
        .select(`
          id,
          rating,
          comment,
          created_at,
          products (name, images)
        `)
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
    console.error("❌ [ADMIN REPORT] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
