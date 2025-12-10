"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2, BarChart3, TrendingUp } from "lucide-react";

// --- Types ---
interface ProductData {
  id: string;
  name: string;
  stock: number;
  reviews: { rating: number }[];
}

interface ChartData {
  name: string;
  value: number;
}

export default function SellerDashboardCharts() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Chart Data States
  const [stockData, setStockData] = useState<ChartData[]>([]);
  const [ratingData, setRatingData] = useState<ChartData[]>([]);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (user?.id) {
      fetchChartData();
    }
  }, [user]);

  const fetchChartData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Products with Reviews
      // Note: Using 'guest_reviews' as per schema and repository usage.
      const { data: products, error } = await supabase
        .from("products")
        .select(
          `
          id,
          name,
          stock,
          guest_reviews (
            rating
          )
        `
        )
        .eq("seller_id", user!.id);

      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }

      if (products) {
        // --- A. Stock Distribution ---
        const stocks = products.map((p: any) => ({
          name: p.name.length > 15 ? p.name.substring(0, 15) + "..." : p.name,
          value: p.stock,
          fullName: p.name,
        }));
        // Sort by stock desc and take top 10
        setStockData(stocks.sort((a, b) => b.value - a.value).slice(0, 10));

        // --- B. Rating Distribution ---
        const ratings = products.map((p: any) => {
          const reviews = p.guest_reviews || [];
          const avgRating =
            reviews.length > 0
              ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
                reviews.length
              : 0;

          return {
            name: p.name.length > 15 ? p.name.substring(0, 15) + "..." : p.name,
            value: parseFloat(avgRating.toFixed(1)),
            fullName: p.name,
            count: reviews.length,
          };
        });
        // Sort by rating desc and take top 10
        setRatingData(ratings.sort((a, b) => b.value - a.value).slice(0, 10));
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-200">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (stockData.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-200">
        <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">
          Belum ada data produk untuk ditampilkan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Stock Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Stok Produk</h3>
              <p className="text-sm text-gray-500">
                Jumlah stok per produk (Top 10)
              </p>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <PackageIcon className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stockData}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  cursor={{ fill: "#FEF2F2" }}
                />
                <Bar
                  dataKey="value"
                  fill="#EF4444"
                  radius={[0, 4, 4, 0]}
                  name="Stok"
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Rating Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Rating Produk</h3>
              <p className="text-sm text-gray-500">
                Rata-rata rating per produk (Top 10)
              </p>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" style={{ fontSize: "12px" }} />
                <YAxis domain={[0, 5]} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  cursor={{ fill: "#FEF2F2" }}
                />
                <Bar
                  dataKey="value"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                  name="Rating"
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22v-10" />
    </svg>
  );
}
