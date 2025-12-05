"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
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
                  {loading ? "-" : `Rp ${(stats.totalValue || 0).toLocaleString("id-ID")}`}
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

        {/* Main Content: Charts */}
        <div className="space-y-6">
          {/* Chart Section */}
          <ChartSection products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
}