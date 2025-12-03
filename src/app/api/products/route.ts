import { createClient } from "@/lib/supabase";
import ProductController from "@/layers/controllers/ProductController";
import { NextRequest, NextResponse } from "next/server";

const controller = new ProductController();

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId");
    
    // Jika tidak ada sellerId, gunakan userId dari auth
    const userId = sellerId || await getUserId();
    const response = await controller.getAll(userId);
    return response;
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await controller.create(body);
    return response;
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}