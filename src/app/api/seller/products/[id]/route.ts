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
// GET: GET SINGLE PRODUCT BY ID
// ===================================
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }  // ✅ FIXED: Added Promise<>
) {
  try {
    const { id: productId } = await params;  // ✅ FIXED: Added await
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
    // ===================================
    // 4. FETCH PRODUCT
    // ===================================
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("seller_id", sellerId) // ⭐ Only allow owner to access
      .single();
    if (fetchError || !product) {
      return NextResponse.json(
        { success: false, message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (err) {
    console.error("❌ GET Product API Error:", err);
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}
// ===================================
// PUT: UPDATE PRODUCT
// ===================================
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }  // ✅ FIXED: Added Promise<>
) {
  try {
    const { id: productId } = await params;  // ✅ FIXED: Added await
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
    console.log("✅ Seller authenticated for product update:", sellerId);
    // ===================================
    // 4. VERIFY OWNERSHIP
    // ===================================
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("seller_id")
      .eq("id", productId)
      .single();
    if (fetchError || !existingProduct) {
      return NextResponse.json(
        { success: false, message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }
    if (existingProduct.seller_id !== sellerId) {
      return NextResponse.json(
        { success: false, message: "Tidak memiliki akses ke produk ini" },
        { status: 403 }
      );
    }
    // ===================================
    // 5. UPDATE PRODUCT (prevent seller_id change)
    // ===================================
    const updateData = { ...body };
    delete updateData.seller_id; // ⭐ Remove seller_id from update (prevent hijacking)
    const { data: updated, error: updateError } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", productId)
      .eq("seller_id", sellerId) // ⭐ Double-check ownership
      .select()
      .single();
    if (updateError) {
      console.error("❌ Product update error:", updateError);
      return NextResponse.json(
        { success: false, message: updateError.message },
        { status: 400 }
      );
    }
    console.log("✅ Product updated successfully:", updated.id);
    return NextResponse.json({
      success: true,
      product: updated,
      message: "Produk berhasil diupdate",
    });
  } catch (err) {
    console.error("❌ PUT Product API Error:", err);
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}
// ===================================
// DELETE: DELETE PRODUCT
// ===================================
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }  // ✅ FIXED: Added Promise<>
) {
  try {
    const { id: productId } = await params;  // ✅ FIXED: Added await
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
    console.log("✅ Seller authenticated for product deletion:", sellerId);
    // ===================================
    // 4. VERIFY OWNERSHIP BEFORE DELETE
    // ===================================
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("seller_id, name")
      .eq("id", productId)
      .single();
    if (fetchError || !existingProduct) {
      return NextResponse.json(
        { success: false, message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }
    if (existingProduct.seller_id !== sellerId) {
      return NextResponse.json(
        { success: false, message: "Tidak memiliki akses ke produk ini" },
        { status: 403 }
      );
    }
    // ===================================
    // 5. DELETE PRODUCT (RLS also enforces ownership)
    // ===================================
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .eq("seller_id", sellerId); // ⭐ Double-check ownership
    if (deleteError) {
      console.error("❌ Product delete error:", deleteError);
      return NextResponse.json(
        { success: false, message: deleteError.message },
        { status: 400 }
      );
    }
    console.log("✅ Product deleted successfully:", productId);
    return NextResponse.json({
      success: true,
      message: `Produk "${existingProduct.name}" berhasil dihapus`,
    });
  } catch (err) {
    console.error("❌ DELETE Product API Error:", err);
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}
