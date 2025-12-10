import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: categories, error } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("name", { ascending: true });
    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json({
      success: true,
      categories: categories || [],
    });
  } catch (err) {
    console.error("❌ GET Categories API Error:", err);
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}
