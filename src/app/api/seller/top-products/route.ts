import { createClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Helper untuk mendapatkan User ID dari session (Multi-Seller Support)
async function getUserId() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // Return null jika tidak ada user login
  if (error || !user) return null;
  
  return user.id;
}

export async function GET() {
  try {
    const userId = await getUserId();

    // Jika tidak ada user login, return 401 Unauthorized
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Get all completed orders for this seller
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id, product_id, quantity")
      .eq("seller_id", userId)
      .eq("status", "completed");

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
      return NextResponse.json({ error: ordersError.message }, { status: 500 });
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json([]);
    }

    // Get unique product IDs
    const productIds = [...new Set(orders.map(o => o.product_id).filter(Boolean))];

    // Get products info
    const { data: products, error } = await supabase
      .from("products")
      .select("id, name")
      .in("id", productIds);

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create product map for quick lookup
    const productMap = new Map(products?.map(p => [p.id, p.name]) || []);

    // Aggregate sales by product
    const productSales = new Map<string, { name: string; sales: number }>();
    
    orders.forEach((order: { product_id?: string; quantity?: number }) => {
      const productId = order.product_id;
      const quantity = order.quantity || 0;

      if (productId && productMap.has(productId)) {
        const productName = productMap.get(productId) || "Unknown Product";
        const existing = productSales.get(productId);
        if (existing) {
          existing.sales += quantity;
        } else {
          productSales.set(productId, { name: productName, sales: quantity });
        }
      }
    });

    // Convert to array and sort by sales (descending)
    const topProductsData = Array.from(productSales.values())
      .map(product => ({
        name: product.name.length > 25 ? product.name.substring(0, 25) + "..." : product.name,
        sales: product.sales,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // Top 5 products

    return NextResponse.json(topProductsData);
  } catch (error: unknown) {
    console.error("Error in top-products API:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
