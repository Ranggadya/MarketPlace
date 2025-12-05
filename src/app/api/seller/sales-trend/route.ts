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

    // Get last 7 days of orders for this seller
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const { data: orders, error } = await supabase
      .from("orders")
      .select("created_at")
      .eq("seller_id", userId)
      .eq("status", "completed")
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching sales trend:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Group orders by date
    const dateMap = new Map<string, number>();
    
    // Initialize all 7 days with 0 orders
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      // Use consistent date format: DD MMM (e.g., "06 Des")
      const day = String(date.getDate()).padStart(2, "0");
      const month = date.toLocaleDateString("id-ID", { month: "short" });
      const dateStr = `${day} ${month}`;
      dateMap.set(dateStr, 0);
    }

    // Count orders per day
    orders?.forEach((order: { created_at: string }) => {
      const orderDate = new Date(order.created_at);
      const day = String(orderDate.getDate()).padStart(2, "0");
      const month = orderDate.toLocaleDateString("id-ID", { month: "short" });
      const dateStr = `${day} ${month}`;
      if (dateMap.has(dateStr)) {
        dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
      }
    });

    // Convert to array format for chart
    const salesTrendData = Array.from(dateMap.entries()).map(([date, orders]) => ({
      date,
      orders,
    }));

    return NextResponse.json(salesTrendData);
  } catch (error: unknown) {
    console.error("Error in sales-trend API:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
