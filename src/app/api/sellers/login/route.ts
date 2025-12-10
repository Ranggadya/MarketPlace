import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { SellerController } from "@/layers/controllers/SellerController";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const controller = new SellerController();
    const result = await controller.login({
      email: body.email,
      password: body.password,
    });

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    const seller = result.data;

    const token = jwt.sign(
      {
        sellerId: seller.id,
        email: seller.pic_email,
        role: "seller",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil.",
    });

    response.cookies.set("seller_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 2 * 60 * 60,
    });

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan server.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
