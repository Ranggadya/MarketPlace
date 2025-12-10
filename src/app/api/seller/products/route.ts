import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
// ===================================
// HELPER FUNCTION: GET COOKIE VALUE
// ===================================
function getCookie(req: Request, name: string): string | undefined {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookie = cookieHeader
    .split('; ')
    .find(row => row.startsWith(`${name}=`));
  
  return cookie ? cookie.split('=')[1] : undefined;
}
// ===================================
// GET: LIST SELLER'S PRODUCTS
// ===================================
export async function GET(req: Request) {
  try {
    // ===================================
    // 1. GET ACCESS TOKEN FROM COOKIES
    // ===================================
    const accessToken = getCookie(req, 'sb-access-token');
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No session found" },
        { status: 401 }
      );
    }
    // ===================================
    // 2. INIT SUPABASE CLIENT WITH AUTH
    // ===================================
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
    // ===================================
    // 3. GET USER FROM TOKEN
    // ===================================
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid session" },
        { status: 401 }
      );
    }
    const sellerId = user.id;
    console.log("✅ Seller authenticated:", sellerId);
    // ===================================
    // 4. VERIFY SELLER IS ACTIVE
    // ===================================
    const { data: seller, error: sellerError } = await supabase
      .from("sellers")
      .select("status")
      .eq("id", sellerId)
      .single();
    if (sellerError || !seller || seller.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Seller tidak aktif" },
        { status: 403 }
      );
    }
    // ===================================
    // 5. GET PRODUCTS (RLS auto-filters by seller_id)
    // ===================================
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });
    if (productsError) {
      return NextResponse.json(
        { success: false, message: productsError.message },
        { status: 400 }
      );
    }
    return NextResponse.json({
      success: true,
      products: products || [],
    });
  } catch (err) {
    console.error("❌ GET Products API Error:", err);
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}
// ===================================
// POST: CREATE NEW PRODUCT
// ===================================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // ===================================
    // 1. GET ACCESS TOKEN FROM COOKIES
    // ===================================
    const accessToken = getCookie(req, 'sb-access-token');
    if (!accessToken) {
      console.error("❌ No access token found in cookies");
      return NextResponse.json(
        { success: false, message: "Unauthorized: No session found" },
        { status: 401 }
      );
    }
    // ===================================
    // 2. INIT SUPABASE CLIENT WITH AUTH
    // ===================================
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
    // ===================================
    // 3. GET USER FROM TOKEN
    // ===================================
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("❌ Failed to get user from token:", userError);
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid session" },
        { status: 401 }
      );
    }
    const sellerId = user.id;
    console.log("✅ Seller authenticated for product creation:", sellerId);
    // ===================================
    // 4. VERIFY SELLER IS ACTIVE
    // ===================================
    const { data: seller, error: sellerError } = await supabase
      .from("sellers")
      .select("status")
      .eq("id", sellerId)
      .single();
    if (sellerError || !seller || seller.status !== "active") {
      console.error("❌ Seller not active:", sellerError);
      return NextResponse.json(
        { success: false, message: "Seller tidak aktif" },
        { status: 403 }
      );
    }
    // ===================================
    // 5. AUTO-INJECT SELLER_ID (prevent manipulation)
    // ===================================
    const productData = {
      ...body,
      seller_id: sellerId, // ⭐ FORCE seller_id from auth session
    };
    console.log("📦 Creating product:", {
      name: productData.name,
      seller_id: sellerId,
    });
    // ===================================
    // 6. INSERT PRODUCT (RLS enforces seller_id = auth.uid())
    // ===================================
    const { data: product, error: insertError } = await supabase
      .from("products")
      .insert(productData)
      .select()
      .single();
    if (insertError) {
      console.error("❌ Product insert error:", insertError);
      return NextResponse.json(
        { success: false, message: insertError.message },
        { status: 400 }
      );
    }
    console.log("✅ Product created successfully:", product.id);
    return NextResponse.json({
      success: true,
      product: product,
      message: "Produk berhasil ditambahkan",
    });
  } catch (err) {
    console.error("❌ POST Product API Error:", err);
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}
