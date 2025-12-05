"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface Product {
  id: string;
  name: string;
  stock: number;
  price: number;
  rating?: number;
}

interface ChartSectionProps {
  products: Product[];
  loading: boolean;
}

interface SalesTrendData {
  date: string;
  orders: number;
}

interface TopProductData {
  name: string;
  sales: number;
}

interface RegionData {
  province: string;
  orders: number;
  revenue: number;
  topProduct: string;
}

export default function ChartSection({ products, loading }: ChartSectionProps) {
  // State for real data from APIs
  const [salesTrendData, setSalesTrendData] = useState<SalesTrendData[]>([]);
  const [topProductsData, setTopProductsData] = useState<TopProductData[]>([]);
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real data from APIs
  useEffect(() => {
    async function fetchData() {
      try {
        setDataLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [salesTrendRes, topProductsRes, regionRes] = await Promise.all([
          fetch("/api/seller/sales-trend"),
          fetch("/api/seller/top-products"),
          fetch("/api/seller/sales-by-province"),
        ]);

        // Check for HTTP errors
        if (!salesTrendRes.ok || !topProductsRes.ok || !regionRes.ok) {
          throw new Error("Failed to fetch chart data");
        }

        const salesTrend = await salesTrendRes.json();
        const topProducts = await topProductsRes.json();
        const regions = await regionRes.json();

        // Validate that responses are arrays
        setSalesTrendData(Array.isArray(salesTrend) ? salesTrend : []);
        setTopProductsData(Array.isArray(topProducts) ? topProducts : []);
        setRegionData(Array.isArray(regions) ? regions : []);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setError("Gagal memuat data chart. Silakan refresh halaman.");
      } finally {
        setDataLoading(false);
      }
    }

    fetchData();
  }, []);

  // Warna dinamis berdasarkan stok (untuk grafik stok)
  const getBarColor = (stock: number) => {
    if (stock < 2) return "#DC2626"; // Red - Kritis
    if (stock <= 10) return "#F59E0B"; // Yellow - Menipis
    return "#10B981"; // Green - Aman
  };

  // Data untuk grafik sebaran stok (10 produk)
  const stockChartData = [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 10)
    .map((p) => ({
      name: p.name.length > 18 ? p.name.substring(0, 18) + "..." : p.name,
      stok: p.stock,
      fill: getBarColor(p.stock),
    }));

  // Chart data for regional sales
  const regionChartData = regionData.map((r) => ({
    province: r.province,
    orders: r.orders,
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section: Laporan Penjualan & Stok */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Laporan Penjualan & Stok</h2>
          <p className="text-sm text-gray-500 mt-1">
            Ringkasan grafik performa toko: tren penjualan, produk terlaris, stok, dan sebaran pembeli per daerah.
          </p>
        </div>

        {/* Row 1: Trend Penjualan + Top Produk Terlaris */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Tren Penjualan 7 Hari Terakhir */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Tren Penjualan 7 Hari Terakhir</h3>
                <p className="text-xs text-gray-500 mt-1">Grafik jumlah order per hari dari database.</p>
              </div>
            </div>

            <div className="h-72">
              {dataLoading ? (
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg animate-pulse">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-400 text-sm">Memuat data...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={11} 
                      stroke="#6B7280"
                      tick={{ fill: "#6B7280" }}
                    />
                    <YAxis 
                      fontSize={11} 
                      stroke="#6B7280"
                      tick={{ fill: "#6B7280" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        color: "#111827"
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#F97316" 
                      strokeWidth={3}
                      dot={{ fill: "#F97316", r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
            {!dataLoading && !error && salesTrendData.length > 0 && salesTrendData.every(d => d.orders === 0) && (
              <p className="text-xs text-gray-400 text-center mt-2">
                💡 Belum ada penjualan dalam 7 hari terakhir
              </p>
            )}
          </div>

          {/* Top Produk Terlaris */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Top Produk Terlaris</h3>
                <p className="text-xs text-gray-500 mt-1">Berdasarkan unit yang terjual dari database.</p>
              </div>
            </div>

            <div className="h-72">
              {dataLoading ? (
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg animate-pulse">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-400 text-sm">Memuat data...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              ) : topProductsData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">Belum ada produk terjual</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProductsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                    <XAxis type="number" fontSize={11} stroke="#6B7280" tick={{ fill: "#6B7280" }} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      fontSize={10} 
                      stroke="#6B7280"
                      tick={{ fill: "#6B7280" }}
                      width={140}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        color: "#111827"
                      }}
                    />
                    <Bar dataKey="sales" fill="#10B981" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Grafik Sebaran Stok + Laporan Penjualan per Daerah */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grafik Sebaran Stok Produk */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Grafik Sebaran Stok Produk</h3>
                <p className="text-xs text-gray-500 mt-1">Batang hijau: stok aman, kuning: menipis, merah: kritis.</p>
              </div>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis
                    dataKey="name"
                    fontSize={10}
                    stroke="#6B7280"
                    tick={{ fill: "#6B7280" }}
                    angle={-35}
                    textAnchor="end"
                    height={90}
                  />
                  <YAxis fontSize={11} stroke="#6B7280" tick={{ fill: "#6B7280" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      color: "#111827"
                    }}
                  />
                  <Bar dataKey="stok" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Laporan Penjualan per Daerah (SRS-MartPlace-08) */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Laporan Penjualan per Daerah</h3>
                  <p className="text-xs text-gray-500 mt-1">Kelompokkan berdasarkan provinsi pembeli dari database.</p>
                </div>
              </div>
              <select className="bg-white text-gray-900 text-xs px-3 py-1.5 rounded-lg border border-gray-300">
                <option>Semua Daerah</option>
              </select>
            </div>

            {/* Bar Chart Mini */}
            <div className="h-32 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionChartData}>
                  <XAxis dataKey="province" fontSize={9} stroke="#6B7280" tick={{ fill: "#6B7280" }} />
                  <Bar dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* List Provinsi */}
            <div className="space-y-2">
              {regionData.map((region, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {region.province.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{region.province}</p>
                        <p className="text-xs text-gray-500">Produk terpopuler: {region.topProduct}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{region.orders} order</p>
                      <p className="text-xs text-orange-500">Rp {region.revenue.toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {dataLoading && (
              <p className="text-xs text-gray-500 mt-4 text-center">
                ⏳ Loading data...
              </p>
            )}
            {!dataLoading && regionData.length === 0 && (
              <p className="text-xs text-gray-500 mt-4 text-center">
                ℹ️ Belum ada data penjualan per daerah.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}