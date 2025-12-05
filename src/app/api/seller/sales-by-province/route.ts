import { createClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// ⚠️ GANTI ID INI DENGAN UUID DARI SUPABASE KAMU (SQL: SELECT id FROM auth.users LIMIT 1)
const DEV_USER_ID = "77c3dac9-5717-4998-acd2-3aaf8686d4f5"; 

// Helper untuk menentukan User ID (Hybrid Logic)
async function getUserId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Jika ada user login (Production/Integrated), pakai ID dia.
  if (user) return user.id;
  
  // Jika tidak ada user login (Development sendiri), pakai ID Hardcode.
  return DEV_USER_ID;
}

export async function GET() {
  try {
    const userId = await getUserId();
    const supabase = await createClient();

    // Get all completed orders for this seller with province info
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id, buyer_province, buyer_city, total_amount, quantity, product_id")
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

    // Aggregate data by province
    const provinceMap = new Map<string, {
      province: string;
      orders: number;
      revenue: number;
      productSales: Map<string, number>;
    }>();

    orders.forEach((order: { buyer_province?: string; total_amount?: number; quantity?: number; product_id?: string }) => {
      const province = order.buyer_province || "Unknown";
      const revenue = order.total_amount || 0;
      const productId = order.product_id;
      const productName = productId && productMap.has(productId) 
        ? productMap.get(productId)! 
        : "Unknown Product";
      const quantity = order.quantity || 0;

      if (!provinceMap.has(province)) {
        provinceMap.set(province, {
          province,
          orders: 0,
          revenue: 0,
          productSales: new Map(),
        });
      }

      const provinceData = provinceMap.get(province)!;
      provinceData.orders += 1;
      provinceData.revenue += revenue;
      
      // Track product sales per province
      const currentSales = provinceData.productSales.get(productName) || 0;
      provinceData.productSales.set(productName, currentSales + quantity);
    });

    // Convert to array and find top product per province
    const regionData = Array.from(provinceMap.values())
      .map((data) => {
        // Find product with highest sales in this province
        let topProduct = "N/A";
        let maxSales = 0;
        data.productSales.forEach((sales, productName) => {
          if (sales > maxSales) {
            maxSales = sales;
            topProduct = productName;
          }
        });

        return {
          province: data.province,
          orders: data.orders,
          revenue: data.revenue,
          topProduct,
        };
      })
      .sort((a, b) => b.orders - a.orders); // Sort by order count descending

    return NextResponse.json(regionData);
  } catch (error: unknown) {
    console.error("Error in sales-by-province API:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
