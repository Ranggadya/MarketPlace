"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ReportPanel from "./ReportPanel";
import ChartSection from "./ChartSection";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  rating: number;
  status: string;
  category?: { name: string };
}

interface Stats {
  totalProducts: number;
  activeProducts: number;
  criticalStock: number;
  totalValue: number;
  avgRating: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

export default function SellerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    activeProducts: 0,
    criticalStock: 0,
    totalValue: 0,
    avgRating: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUserName = "Admin Toko";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products
        const productsRes = await fetch("/api/products", { 
          cache: "no-store",
          headers: { 'Content-Type': 'application/json' }
        });

        if (!productsRes.ok) {
          throw new Error(`HTTP error! status: ${productsRes.status}`);
        }

        const productsJson = await productsRes.json();
        
        if (productsJson.success) {
          setProducts(productsJson.data || []);
        }

        // Fetch statistics
        const statsRes = await fetch("/api/products/stats", {
          cache: "no-store",
          headers: { 'Content-Type': 'application/json' }
        });

        if (statsRes.ok) {
          const statsJson = await statsRes.json();
          if (statsJson.success) {
            setStats(statsJson.data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "Terjadi kesalahan");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Statistik</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ringkasan performa toko Anda hari ini
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Stats Cards - 4 Horizontal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total Produk */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Total Produk</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {loading ? "-" : stats.totalProducts}
                </h3>
                <p className="text-xs text-gray-400 mt-2">
                  {stats.outOfStockProducts > 0 ? `${stats.outOfStockProducts} stok habis` : "Semua tersedia"}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: Produk Aktif */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Produk Aktif</p>
                <h3 className="text-3xl font-bold text-green-600">
                  {loading ? "-" : stats.activeProducts}
                </h3>
                <p className="text-xs text-green-500 mt-2">
                  {stats.totalProducts > 0 
                    ? `${Math.round((stats.activeProducts / stats.totalProducts) * 100)}% dari total` 
                    : "Belum ada produk"}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3: Stok Kritis */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">
                  Stok Kritis ({'<'}2)
                </p>
                <h3
                  className={`text-3xl font-bold ${
                    stats.criticalStock > 0 ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {loading ? "-" : stats.criticalStock}
                </h3>
                <p className="text-xs text-red-400 mt-2">
                  {stats.lowStockProducts > 0 
                    ? `${stats.lowStockProducts} produk stok menipis` 
                    : "Stok aman"}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 4: Nilai Inventori */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">
                  Nilai Inventori
                </p>
                <h3 className="text-2xl font-bold text-orange-600">
                  {loading ? "-" : `Rp ${stats.totalValue.toLocaleString("id-ID")}`}
                </h3>
                <p className="text-xs text-orange-400 mt-2">
                  Total nilai stok saat ini
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Charts & Table (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart Section */}
            <ChartSection products={products} loading={loading} />

            {/* Product Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Laporan Daftar Stok Produk
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Lihat, cari, dan kelola produk yang terdaftar di toko Anda
                  </p>
                </div>
                <Link
                  href="/seller/dashboard/products"
                  className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  + Tambah Produk
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Produk
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Harga
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Stok
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-gray-400"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mb-4"></div>
                            <p>Memuat data...</p>
                          </div>
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-gray-400"
                        >
                          Belum ada produk
                        </td>
                      </tr>
                    ) : (
                      products.slice(0, 8).map((product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 font-bold text-xs">
                                {product.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  ID: #{product.id.slice(0, 8)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-700">
                            Rp {product.price.toLocaleString("id-ID")}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                product.stock < 2
                                  ? "bg-red-100 text-red-700"
                                  : product.stock <= 10
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {product.stock} unit
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {product.category?.name || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                product.status === "active"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  product.status === "active"
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                                }`}
                              ></span>
                              {product.status === "active" ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/seller/dashboard/products/${product.id}/edit`}
                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                                title="Edit"
                              >
                                <svg
                                  className="w-4 h-4 text-gray-400 group-hover:text-blue-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </Link>
                              <button
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                                title="Delete"
                              >
                                <svg
                                  className="w-4 h-4 text-gray-400 group-hover:text-red-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {!loading && products.length > 8 && (
                <div className="px-6 py-4 border-t border-gray-100 text-center bg-gray-50">
                  <p className="text-sm text-gray-500">
                    Data di atas masih dummy. Nanti bisa diambil dari label
                    order transaksi / Supabase.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Report Panel (1/3 width) */}
          <div className="lg:col-span-1">
            <ReportPanel products={products} user={currentUserName} />
          </div>
        </div>
      </div>
    </div>
  );
}