"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@supabase/supabase-js";
import { 
  Store, Package, ShoppingCart, DollarSign, 
  TrendingUp, Clock, Loader2, Plus 
} from "lucide-react";
import Link from "next/link";
interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  storeBalance: number;
}
export default function SellerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    storeBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  useEffect(() => {
    if (user?.id) {
      loadDashboardStats();
    }
  }, [user]);
  async function loadDashboardStats() {
    try {
      setLoading(true);
      
      // Get products count
      const { count: totalProducts } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("seller_id", user!.id);
      const { count: activeProducts } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("seller_id", user!.id)
        .eq("status", "active");
      // Get seller balance
      const { data: sellerData } = await supabase
        .from("sellers")
        .select("balance")
        .eq("id", user!.id)
        .single();
      setStats({
        totalProducts: totalProducts || 0,
        activeProducts: activeProducts || 0,
        totalOrders: 0, // TODO: Implement orders
        pendingOrders: 0, // TODO: Implement orders
        totalRevenue: 0, // TODO: Calculate from orders
        storeBalance: sellerData?.balance || 0,
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <ProtectedRoute allowedRoles={["seller"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Store className="w-8 h-8" />
                  <h1 className="text-3xl font-bold">{user?.store_name}</h1>
                </div>
                <p className="text-red-100">
                  Selamat datang kembali, {user?.name}!
                </p>
              </div>
              <Link
                href="/seller/dashboard/products/create"
                className="
                  flex items-center gap-2 px-6 py-3 
                  bg-white text-red-600 rounded-lg font-semibold
                  hover:bg-red-50 transition-colors
                "
              >
                <Plus className="w-5 h-5" />
                Tambah Produk
              </Link>
            </div>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Products */}
                <StatCard
                  title="Total Produk"
                  value={stats.totalProducts}
                  icon={Package}
                  color="blue"
                  subtitle={`${stats.activeProducts} aktif`}
                />
                {/* Total Orders */}
                <StatCard
                  title="Total Pesanan"
                  value={stats.totalOrders}
                  icon={ShoppingCart}
                  color="green"
                  subtitle={`${stats.pendingOrders} pending`}
                />
                {/* Revenue */}
                <StatCard
                  title="Total Pendapatan"
                  value={`Rp ${stats.totalRevenue.toLocaleString("id-ID")}`}
                  icon={TrendingUp}
                  color="purple"
                  subtitle="Semua waktu"
                />
                {/* Balance */}
                <StatCard
                  title="Saldo Toko"
                  value={`Rp ${stats.storeBalance.toLocaleString("id-ID")}`}
                  icon={DollarSign}
                  color="orange"
                  subtitle="Dapat ditarik"
                />
              </div>
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Aksi Cepat
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <QuickActionButton
                    href="/seller/dashboard/products"
                    icon={Package}
                    title="Kelola Produk"
                    description="Lihat dan edit produk Anda"
                  />
                  <QuickActionButton
                    href="/seller/dashboard/reports"
                    icon={TrendingUp}
                    title="Laporan Produk"
                    description="Download laporan stok & rating"
                  />
                </div>
              </div>
              {/* Recent Activity Placeholder */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Aktivitas Terbaru
                </h2>
                <div className="text-center py-12 text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-3" />
                  <p>Belum ada aktivitas</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
// ===================================
// STAT CARD COMPONENT
// ===================================
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: "blue" | "green" | "purple" | "orange";
  subtitle?: string;
}
function StatCard({ title, value, icon: Icon, color, subtitle }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };
  return (
    <div className={`${colorClasses[color]} border rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-sm font-medium opacity-80 mb-1">{title}</p>
        <p className="text-2xl font-bold mb-1">{value}</p>
        {subtitle && <p className="text-xs opacity-70">{subtitle}</p>}
      </div>
    </div>
  );
}
// ===================================
// QUICK ACTION BUTTON COMPONENT
// ===================================
interface QuickActionButtonProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}
function QuickActionButton({ href, icon: Icon, title, description }: QuickActionButtonProps) {
  return (
    <Link
      href={href}
      className="
        flex items-start gap-4 p-4 rounded-lg border border-gray-200
        hover:border-red-300 hover:bg-red-50 transition-all
        group
      "
    >
      <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
        <Icon className="w-6 h-6 text-red-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
