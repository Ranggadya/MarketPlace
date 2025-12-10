import { createClient } from "@supabase/supabase-js";
// ===================================
// GET CURRENT SELLER ID FROM SESSION
// ===================================
export async function getCurrentSellerId(): Promise<string | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { session } } = await supabase.auth.getSession();
  
  return session?.user?.id || null;
}
// ===================================
// VERIFY PRODUCT OWNERSHIP
// ===================================
export async function verifyProductOwnership(
  productId: string,
  sellerId: string
): Promise<boolean> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase
    .from("products")
    .select("seller_id")
    .eq("id", productId)
    .single();
  if (error || !data) {
    return false;
  }
  return data.seller_id === sellerId;
}
// ===================================
// VERIFY SELLER IS ACTIVE
// ===================================
export async function verifySellerActive(sellerId: string): Promise<boolean> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase
    .from("sellers")
    .select("status")
    .eq("id", sellerId)
    .single();
  if (error || !data) {
    return false;
  }
  return data.status === "active";
}
// ===================================
// GET SELLER INFO
// ===================================
export async function getSellerInfo(sellerId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase
    .from("sellers")
    .select("*")
    .eq("id", sellerId)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
// ===================================
// REQUIRE AUTH (Server-side)
// ===================================
export async function requireAuth() {
  const sellerId = await getCurrentSellerId();
  
  if (!sellerId) {
    throw new Error("Unauthorized: No active session");
  }
  const isActive = await verifySellerActive(sellerId);
  
  if (!isActive) {
    throw new Error("Forbidden: Seller is not active");
  }
  return sellerId;
}
