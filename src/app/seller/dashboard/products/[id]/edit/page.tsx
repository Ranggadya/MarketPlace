"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

// Export Default Function
export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "", price: "", stock: "", category_id: "",
    condition: "Baru", weight: "", description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const catRes = await fetch("/api/categories", {
          cache: "no-store",
          headers: { 'Content-Type': 'application/json' }
        });

        if (catRes.ok) {
          const catContentType = catRes.headers.get("content-type");
          if (catContentType && catContentType.includes("application/json")) {
            const catJson = await catRes.json();
            if (catJson.success && catJson.data) {
              setCategories(catJson.data);
            }
          }
        }

        // Fetch product
        const prodRes = await fetch(`/api/products/${productId}`, {
          cache: "no-store",
          headers: { 'Content-Type': 'application/json' }
        });

        if (!prodRes.ok) {
          throw new Error(`Failed to fetch product: ${prodRes.status}`);
        }

        const prodContentType = prodRes.headers.get("content-type");
        if (!prodContentType || !prodContentType.includes("application/json")) {
          throw new Error("Product response is not JSON");
        }

        const prodJson = await prodRes.json();
        
        if (prodJson.success && prodJson.data) {
          const d = prodJson.data;
          setFormData({
            name: d.name || "", 
            price: d.price || "", 
            stock: d.stock || "",
            category_id: d.category_id || "", 
            condition: d.condition || "Baru",
            weight: d.weight || "", 
            description: d.description || "",
          });
        } else {
          throw new Error(prodJson.message || "Failed to load product");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Gagal memuat data produk: " + (error instanceof Error ? error.message : "Unknown error"));
      }
    };
    if (productId) fetchData();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Failed to update: ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const json = await res.json();
      
      if (json.success) {
        alert("✅ Produk berhasil diupdate!");
        router.push("/seller/dashboard/products");
        router.refresh();
      } else {
        throw new Error(json.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("❌ Gagal update: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Edit Produk</h1>
          <Link href="/seller/dashboard/products" className="px-6 py-2 bg-white border rounded hover:bg-gray-50">Batal</Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border p-8 rounded-lg shadow-sm space-y-6">
          <div><label className="block text-sm font-bold mb-2">Nama Produk</label><input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" /></div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Kategori</label>
              <select name="category_id" required value={formData.category_id} onChange={handleChange} className="w-full border p-2 rounded bg-white">
                <option value="">Pilih Kategori</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Kondisi</label>
              <select name="condition" value={formData.condition} onChange={handleChange} className="w-full border p-2 rounded bg-white">
                <option value="Baru">Baru</option>
                <option value="Bekas">Bekas</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div><label className="block text-sm font-bold mb-2">Harga</label><input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full border p-2 rounded" /></div>
            <div><label className="block text-sm font-bold mb-2">Stok</label><input type="number" name="stock" required value={formData.stock} onChange={handleChange} className="w-full border p-2 rounded" /></div>
            <div><label className="block text-sm font-bold mb-2">Berat</label><input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full border p-2 rounded" /></div>
          </div>

          <div><label className="block text-sm font-bold mb-2">Deskripsi</label><textarea name="description" rows={5} value={formData.description} onChange={handleChange} className="w-full border p-2 rounded"></textarea></div>

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 disabled:bg-gray-400">
              {loading ? "Menyimpan..." : "Update Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}