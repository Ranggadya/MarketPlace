import { NextResponse } from "next/server";
import { SellerController } from "@/layers/controllers/SellerController";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const controller = new SellerController();
    const result = await controller.detail(params.id);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Server error.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
