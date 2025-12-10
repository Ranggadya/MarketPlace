"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@supabase/supabase-js";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Search,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  status: string;
  images: string[] | null;
  category_id: string | null;
  created_at: string;
}
export default function SellerProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  useEffect(() => {
    if (user?.id) {
      loadProducts();
    }
  }, [user]);
  async function loadProducts() {
    try {
      setLoading(true);

      // ⭐ RLS automatically filters by seller_id = auth.uid()
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error loading products:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Produk",
          text: error.message,
        });
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }
  async function toggleProductStatus(productId: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const { error } = await supabase
      .from("products")
      .update({ status: newStatus })
      .eq("id", productId)
      .eq("seller_id", user!.id); // ⭐ Double-check ownership
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Update Status",
        text: error.message,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Status Diupdate",
        text: `Produk ${
          newStatus === "active" ? "diaktifkan" : "dinonaktifkan"
        }`,
        timer: 1500,
        showConfirmButton: false,
      });
      loadProducts();
    }
  }
  async function deleteProduct(productId: string, productName: string) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Hapus Produk?",
      text: `Yakin ingin menghapus "${productName}"? Aksi ini tidak dapat dibatalkan.`,
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .eq("seller_id", user!.id); // ⭐ Double-check ownership
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Hapus",
        text: error.message,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Berhasil Dihapus",
        timer: 1500,
        showConfirmButton: false,
      });
      loadProducts();
    }
  }
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <ProtectedRoute allowedRoles={["seller"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-red-500" />
                <h1 className="text-2xl font-bold text-gray-800">
                  Kelola Produk
                </h1>
              </div>
              <Link
                href="/seller/dashboard/products/create"
                className="
                  flex items-center gap-2 px-6 py-3
                  bg-red-500 text-white rounded-lg font-semibold
                  hover:bg-red-600 transition-colors
                "
              >
                <Plus className="w-5 h-5" />
                Tambah Produk
              </Link>
            </div>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-red-500
                "
              />
            </div>
          </div>
        </div>
        {/* Products List */}
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">
                {searchQuery
                  ? "Produk tidak ditemukan"
                  : "Belum ada produk. Tambahkan produk pertama Anda!"}
              </p>
              {!searchQuery && (
                <Link
                  href="/seller/dashboard/products/create"
                  className="
                    inline-flex items-center gap-2 px-6 py-3
                    bg-red-500 text-white rounded-lg font-semibold
                    hover:bg-red-600 transition-colors
                  "
                >
                  <Plus className="w-5 h-5" />
                  Tambah Produk
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onToggleStatus={toggleProductStatus}
                  onDelete={deleteProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
// ===================================
// PRODUCT CARD COMPONENT
// ===================================
interface ProductCardProps {
  product: Product;
  onToggleStatus: (id: string, status: string) => void;
  onDelete: (id: string, name: string) => void;
}
function ProductCard({ product, onToggleStatus, onDelete }: ProductCardProps) {
  const imageUrl = product.images?.[0] || "/placeholder-product.png";
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4">
      {/* Image */}
      <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg text-gray-800 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 truncate mb-2">
          {product.description || "Tidak ada deskripsi"}
        </p>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold text-red-600">
            Rp {product.price.toLocaleString("id-ID")}
          </span>
          <span className="text-gray-600">Stok: {product.stock}</span>
          <span
            className={`
              px-2 py-1 rounded text-xs font-medium
              ${
                product.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }
            `}
          >
            {product.status === "active" ? "Aktif" : "Nonaktif"}
          </span>
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleStatus(product.id, product.status)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title={product.status === "active" ? "Nonaktifkan" : "Aktifkan"}
        >
          {product.status === "active" ? (
            <EyeOff className="w-5 h-5 text-gray-600" />
          ) : (
            <Eye className="w-5 h-5 text-gray-600" />
          )}
        </button>
        <Link
          href={`/seller/dashboard/products/${product.id}/edit`}
          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit"
        >
          <Edit className="w-5 h-5 text-blue-600" />
        </Link>
        <button
          onClick={() => onDelete(product.id, product.name)}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          title="Hapus"
        >
          <Trash2 className="w-5 h-5 text-red-600" />
        </button>
      </div>
    </div>
  );
}
