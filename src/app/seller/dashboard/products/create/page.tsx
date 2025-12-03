"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Export Default Function
export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: "", price: "", stock: "", category_id: "",
    condition: "Baru", weight: "", description: "",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(json => { if(json.success) setCategories(json.data) });
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages([...selectedImages, ...files]);
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...previews]);
    }
  };

  const removeImage = (index: number) => {
    const newImgs = [...selectedImages]; newImgs.splice(index, 1);
    const newPrevs = [...imagePreviews]; newPrevs.splice(index, 1);
    setSelectedImages(newImgs);
    setImagePreviews(newPrevs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.category_id) throw new Error("Pilih kategori!");
      if (selectedImages.length === 0) throw new Error("Upload minimal 1 foto!");

      const payload = { ...formData, images: [] }; // Mock image upload dulu

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      alert("✅ Produk berhasil ditambahkan!");
      router.push("/seller/dashboard/products");
      router.refresh();
    } catch (error: any) {
      alert("❌ Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Tambah Produk Baru</h1>
          <Link href="/seller/dashboard/products" className="px-6 py-2 bg-white border rounded hover:bg-gray-50">Batal</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border p-8 rounded-lg shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">Foto Produk</label>
              <div className="grid grid-cols-5 gap-4">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square border rounded overflow-hidden group">
                    <Image src={src} alt="Preview" fill className="object-cover" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100">✕</button>
                  </div>
                ))}
                {imagePreviews.length < 5 && (
                  <label className="border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                    <span className="text-2xl text-gray-400">+</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Nama Produk</label>
              <input type="text" name="name" required className="w-full border p-2 rounded" onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Kategori</label>
                <select name="category_id" required className="w-full border p-2 rounded bg-white" onChange={handleChange}>
                  <option value="">Pilih Kategori</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Kondisi</label>
                <select name="condition" className="w-full border p-2 rounded bg-white" onChange={handleChange}>
                  <option value="Baru">Baru</option>
                  <option value="Bekas">Bekas</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div><label className="block text-sm font-bold mb-2">Harga</label><input type="number" name="price" required className="w-full border p-2 rounded" onChange={handleChange} /></div>
              <div><label className="block text-sm font-bold mb-2">Stok</label><input type="number" name="stock" required className="w-full border p-2 rounded" onChange={handleChange} /></div>
              <div><label className="block text-sm font-bold mb-2">Berat (g)</label><input type="number" name="weight" className="w-full border p-2 rounded" onChange={handleChange} /></div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Deskripsi</label>
              <textarea name="description" rows={5} className="w-full border p-2 rounded" onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="px-8 py-3 bg-red-600 text-white font-bold rounded shadow hover:bg-red-700 disabled:bg-gray-400">
              {loading ? "Menyimpan..." : "Simpan Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}