"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface ChartSectionProps {
  products: any[];
  loading: boolean;
}

export default function ChartSection({ products, loading }: ChartSectionProps) {
  // Warna dinamis berdasarkan stok
  const getBarColor = (stock: number) => {
    if (stock < 2) return "#DC2626"; // Red - Kritis
    if (stock <= 10) return "#F59E0B"; // Yellow - Menipis
    return "#16A34A"; // Green - Aman
  };

  // Data untuk Bar Chart Stok
  const stockChartData = [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 10)
    .map((p) => ({
      name: p.name.length > 12 ? p.name.substring(0, 12) + "..." : p.name,
      stok: p.stock,
      fill: getBarColor(p.stock),
    }));

  // Data untuk Pie Chart Rating
  const ratingChartData = [
    {
      name: "5.0 Sempurna",
      value: products.filter((p) => p.rating === 5).length,
    },
    {
      name: "4.0 - 4.9 Bagus",
      value: products.filter((p) => p.rating >= 4 && p.rating < 5).length,
    },
    {
      name: "3.0 - 3.9 Cukup",
      value: products.filter((p) => p.rating >= 3 && p.rating < 4).length,
    },
    {
      name: "< 3.0 Kurang",
      value: products.filter((p) => p.rating < 3).length,
    },
  ].filter((d) => d.value > 0);

  const PIE_COLORS = ["#16A34A", "#3B82F6", "#F59E0B", "#DC2626"];

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bar Chart - Grafik Sebaran Stok */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Grafik Sebaran Stok Produk
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Batang hijau: stok aman, kuning: menipis, merah: kritis.
          </p>

          {/* Legend */}
          <div className="flex gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-gray-600">Aman ({">"}10)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-gray-600">Menipis (2-10)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className="text-gray-600">Kritis ({"<"}2)</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                fontSize={11}
                tick={{ fill: "#6B7280" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis fontSize={11} tick={{ fill: "#6B7280" }} />
              <Tooltip
                cursor={{ fill: "#F3F4F6" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="stok" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart - Sebaran Rating (Optional) */}
      {ratingChartData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Sebaran Rating Produk
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ratingChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ratingChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "8px" }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}