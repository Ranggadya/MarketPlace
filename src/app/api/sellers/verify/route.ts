import { NextResponse } from "next/server";
import { SellerController } from "@/layers/controllers/SellerController";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.id || !body.action) {
      return NextResponse.json(
        {
          success: false,
          message: "Field 'id' dan 'action' wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (!["ACCEPT", "REJECT"].includes(body.action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Action hanya boleh 'ACCEPT' atau 'REJECT'.",
        },
        { status: 400 }
      );
    }

    const controller = new SellerController();
    const result = await controller.verify(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message:
          body.action === "ACCEPT"
            ? "Seller berhasil diverifikasi dan diaktifkan."
            : "Seller berhasil ditolak.",
        data: result.data,
      },
      { status: 200 }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Terjadi kesalahan server.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
