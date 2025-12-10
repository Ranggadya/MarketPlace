import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  // ===================================
  // 1. PROTECT /seller/* ROUTES (EXCEPT REGISTER)
  // ===================================
  if (path.startsWith("/seller")) {
    
    // ✅ ALLOW PUBLIC ACCESS to seller registration
    if (path === "/seller/register") {
      return NextResponse.next();
    }
    // ⭐ FIX: Check cookies for session tokens
    const accessToken = request.cookies.get('sb-access-token')?.value;
    const userId = request.cookies.get('sb-user-id')?.value;
    if (!accessToken || !userId) {
      // No session cookies → redirect to login
      console.log("🚫 No session cookies found, redirecting to /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // ⭐ FIX: Verify token with Supabase using Authorization header
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
    // Verify the access token is valid
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!user || error) {
      console.log("🚫 Invalid session token, redirecting to /login");
      // Invalid token → redirect to login and clear cookies
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete('sb-access-token');
      response.cookies.delete('sb-refresh-token');
      response.cookies.delete('sb-user-id');
      return response;
    }
    // Check if user is a seller and active
    const { data: seller } = await supabase
      .from("sellers")
      .select("status")
      .eq("id", user.id)
      .single();
    if (!seller) {
      // Not a seller → redirect to home
      console.log("🚫 Not a seller, redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (seller.status !== "active") {
      // Not active seller → redirect to home with message
      console.log("🚫 Seller not active, redirecting to home");
      return NextResponse.redirect(new URL("/?error=seller_not_active", request.url));
    }
    // ✅ Seller is authenticated and active → allow access
    console.log("✅ Seller authenticated:", user.id);
    return NextResponse.next();
  }
  // ===================================
  // 2. PROTECT /admin/* ROUTES
  // ===================================
  if (path.startsWith("/admin")) {
    // Check for admin session cookie
    const adminSession = request.cookies.get('admin-session')?.value;
    
    if (!adminSession || adminSession !== 'true') {
      console.log("🚫 No admin session, redirecting to /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
    console.log("✅ Admin authenticated");
    return NextResponse.next();
  }
  // ===================================
  // 3. ALL OTHER ROUTES → ALLOW
  // ===================================
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/seller/:path*",
    "/admin/:path*",
  ],
};
