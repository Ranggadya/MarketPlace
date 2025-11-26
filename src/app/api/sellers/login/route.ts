import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { picEmail, password } = await req.json();

    if (!picEmail || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    // Cari user berdasarkan email
    const { data: seller, error } = await supabase
      .from("sellers")
      .select("*")
      .eq("picEmail", picEmail)
      .single();

    if (error || !seller) {
      return NextResponse.json(
        { success: false, message: "Email tidak ditemukan." },
        { status: 404 }
      );
    }

    // Cocokkan password
    // NOTE: sementara plain text (nanti bisa kita ganti ke hashed bcrypt)
    if (seller.password !== password) {
      return NextResponse.json(
        { success: false, message: "Password salah." },
        { status: 401 }
      );
    }

    // LOGIN SUKSES
    return NextResponse.json({
      success: true,
      message: "Login berhasil.",
      seller: {
        id: seller.id,
        storeName: seller.storeName,
        picEmail: seller.picEmail,
      },
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan server.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
