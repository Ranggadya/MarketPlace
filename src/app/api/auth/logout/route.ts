import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const response = NextResponse.json({ success: true });
    // Clear all auth cookies
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    response.cookies.delete('sb-user-id');
    response.cookies.delete('admin-session');
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}
