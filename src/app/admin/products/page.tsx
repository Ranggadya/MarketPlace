"use client";

import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";

interface Product {
  name: string;
  category: string;
  price: number;
  store_name: string;
  rating: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Reuse the reports API as it provides the necessary joined data
        const res = await fetch("/api/admin/reports?type=PRODUCTS_RATING");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Group products by category
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.store_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Detail Produk per Kategori
          </h1>
          <p className="text-gray-500">
            Daftar semua produk yang dikelompokkan berdasarkan kategorinya.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari produk..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedProducts).map(([category, items]) => (
          <div
            key={category}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-bold text-gray-800">{category}</h2>
              <span className="text-xs font-medium bg-white px-2 py-1 rounded border text-gray-600">
                {items.length} Produk
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-3">Nama Produk</th>
                    <th className="px-6 py-3">Harga</th>
                    <th className="px-6 py-3">Toko</th>
                    <th className="px-6 py-3">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((product, idx) => (
                    <tr
                      key={idx}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4">
                        Rp {product.price.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4">{product.store_name}</td>
                      <td className="px-6 py-4 flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        {product.rating.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {Object.keys(groupedProducts).length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed">
            <p className="text-gray-500">Tidak ada produk ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
