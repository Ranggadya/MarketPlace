"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@supabase/supabase-js";
import generateReportPDF from "@/lib/pdf-generator";
import { Loader2 } from "lucide-react";
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  weight?: number;
  condition?: string;
  status?: string;
  images?: string[];
  rating?: number;
  created_at?: string;
  updated_at?: string;
  category_id?: string;
  seller_id?: string;
  categories?: {
    id: string;
    name: string;
  };
}
export default function ReportsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  useEffect(() => {
    if (user?.id) {
      fetchProducts();
    }
  }, [user]);
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // ✅ FIXED: Filter by seller_id - only fetch current seller's products
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(id, name)")
        .eq("seller_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = (type: "STOCK" | "RATING" | "WARNING") => {
    // Use seller name from AuthContext
    generateReportPDF(type, products, { name: user?.name || "Seller" });
  };
  return (
    <ProtectedRoute allowedRoles={["seller"]}>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pusat Laporan Produk</h1>
          <p className="text-sm text-gray-500">Generate dan unduh laporan produk dalam format PDF</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Stok Produk</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Produk */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-600 font-medium">Total Produk</p>
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                  <p className="text-xs text-gray-400 mt-1">Item tersedia</p>
                </div>
                {/* Stok Aman */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-green-700 font-medium">Stok Aman</p>
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {products.filter(p => p.stock >= 5).length}
                  </p>
                  <p className="text-xs text-green-500 mt-1">Lebih dari 5 unit</p>
                </div>
                {/* Stok Kritis */}
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-yellow-700 font-medium">Stok Kritis</p>
                    <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {products.filter(p => p.stock >= 2 && p.stock < 5).length}
                  </p>
                  <p className="text-xs text-yellow-500 mt-1">Antara 2-4 unit</p>
                </div>
                {/* Stok Habis */}
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-red-700 font-medium">Stok Habis</p>
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {products.filter(p => p.stock < 2).length}
                  </p>
                  <p className="text-xs text-red-500 mt-1">Kurang dari 2 unit</p>
                </div>
              </div>
            </div>
            {/* Report Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* SRS-12: Stock Report */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-500 transition-all shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900">Laporan Stok</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Daftar lengkap produk dengan detail stok tersedia
                </p>
                <button
                  onClick={() => handleDownload("STOCK")}
                  disabled={loading || products.length === 0}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {products.length === 0 ? "Tidak Ada Data" : "Download PDF"}
                </button>
              </div>
              {/* SRS-13: Rating Report */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-yellow-500 transition-all shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900">Laporan Rating</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Analisis rating dan kepuasan pelanggan terhadap produk
                </p>
                <button
                  onClick={() => handleDownload("RATING")}
                  disabled={loading || products.length === 0}
                  className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {products.length === 0 ? "Tidak Ada Data" : "Download PDF"}
                </button>
              </div>
              {/* SRS-14: Warning Report */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-red-500 transition-all shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900">Laporan Stok Kritis</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Produk dengan stok kritis yang perlu segera di-restock
                </p>
                <button
                  onClick={() => handleDownload("WARNING")}
                  disabled={loading || products.length === 0}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {products.length === 0 ? "Tidak Ada Data" : "Download PDF"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
