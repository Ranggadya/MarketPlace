"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: { name: string };
  status: string;
}

// Export Default Function
export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const json = await res.json();
      if (json.success) setProducts(json.data);
    } catch (error) {
      console.error("Gagal load produk:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus produk ini secara permanen?")) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        const json = await res.json();
        
        if (json.success) {
          alert("✅ Produk berhasil dihapus!");
          fetchProducts();
        } else {
          alert("❌ Gagal menghapus: " + json.message);
        }
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black tracking-tight">Produk Saya</h1>
            <p className="text-gray-500 mt-1">Kelola stok, harga, dan status produk di tokomu.</p>
          </div>
          <Link
            href="/seller/dashboard/products/create"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-red-600 rounded hover:bg-red-700 transition-all shadow-md gap-2"
          >
            + Tambah Produk
          </Link>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-gray-200 rounded-t-lg p-4 flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Cari nama produk..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="text-sm text-gray-500 font-medium">Total: {filteredProducts.length} Produk</div>
        </div>

        {/* Tabel */}
        <div className="bg-white border-x border-b border-gray-200 rounded-b-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Memuat data...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-16 text-center text-gray-500">Belum ada produk.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Info Produk</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Harga</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Stok</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{product.category?.name || "-"}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">Rp {product.price.toLocaleString("id-ID")}</td>
                      <td className="px-6 py-4 text-sm font-medium">{product.stock}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/seller/dashboard/products/${product.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                            ✏️
                          </Link>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}