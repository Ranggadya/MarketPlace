import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Coba cek sebagai seller
    const sellerCheck = await supabase
      .from("sellers")
      .select("*")
      .eq("picEmail", email)
      .single();

    if (sellerCheck.data) {
      if (sellerCheck.data.password !== password) {
        return NextResponse.json(
          { success: false, message: "Password salah." },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        role: "seller",
        account: sellerCheck.data,
      });
    }

    // 2. Coba cek sebagai user
    const userCheck = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!userCheck.data) {
      return NextResponse.json(
        { success: false, message: "Akun tidak ditemukan." },
        { status: 404 }
      );
    }

    if (userCheck.data.password !== password) {
      return NextResponse.json(
        { success: false, message: "Password salah." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      role: "user",
      account: userCheck.data,
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
