import { createClient } from "@/lib/supabase";
import ProductController from "@/layers/controllers/ProductController";
import { NextRequest, NextResponse } from "next/server";

const controller = new ProductController();
const DEV_USER_ID = "77c3dac9-5717-4998-acd2-3aaf8686d4f5"; 

async function getUserId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return user.id;
  return DEV_USER_ID;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId");
    const userId = sellerId || await getUserId();
    const response = await controller.getStats(userId);
    return response;
  } catch (error) {
    console.error("GET /api/products/stats error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
