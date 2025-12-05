"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { uploadProductImage } from "@/lib/uploadImage";

// ==========================================
// TypeScript Interfaces
// ==========================================
interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  weight: number;
  condition: "Baru" | "Bekas";
  category_id: string;
  images: string[] | null;
  status: "active" | "inactive" | "archived";
}

interface FormData {
  name: string;
  price: string;
  stock: string;
  category_id: string;
  condition: "Baru" | "Bekas";
  weight: string;
  description: string;
}

// ==========================================
// Main Component
// ==========================================
export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image management states
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadMethod, setUploadMethod] = useState<"file" | "link">("link");
  const [linkInput, setLinkInput] = useState("");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: "",
    stock: "",
    category_id: "",
    condition: "Baru",
    weight: "",
    description: "",
  });

  // ==========================================
  // Fetch Product & Categories
  // ==========================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Fetching product with ID:", id);

        // Fetch product data
        const productRes = await fetch(`/api/products/${id}`, {
          cache: "no-store",
        });

        if (!productRes.ok) {
          throw new Error(`HTTP ${productRes.status}`);
        }

        const productData = await productRes.json();
        console.log("📦 Product data:", productData);

        if (!productData.success) {
          throw new Error(productData.message || "Product not found");
        }

        const prod = productData.data;
        setProduct(prod);

        // Set form data
        setFormData({
          name: prod.name || "",
          price: prod.price?.toString() || "",
          stock: prod.stock?.toString() || "",
          category_id: prod.category_id || "",
          condition: prod.condition || "Baru",
          weight: prod.weight?.toString() || "",
          description: prod.description || "",
        });

        // Load existing images (handle both array and string formats)
        if (prod.images) {
          let urls: string[] = [];
          
          if (Array.isArray(prod.images)) {
            urls = prod.images.filter((url) => url && url.trim().length > 0);
          } else if (typeof prod.images === "string") {
            urls = prod.images
              .split(",")
              .map((url) => url.trim())
              .filter((url) => url.length > 0);
          }
          
          console.log("🖼️ Loaded existing images:", urls);
          setImageUrls(urls);
        }

        // Fetch categories
        const categoriesRes = await fetch("/api/categories", {
          cache: "no-store",
        });
        const categoriesData = await categoriesRes.json();

        if (categoriesData.success) {
          setCategories(categoriesData.data || []);
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load product data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // ==========================================
  // Image Handlers
  // ==========================================
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);

    if (imageUrls.length + files.length > 5) {
      alert("Maksimal 5 foto per produk");
      return;
    }

    setUploading(true);

    try {
      for (const file of files) {
        if (file.size > 2 * 1024 * 1024) {
          alert(`File ${file.name} terlalu besar. Maksimal 2MB per foto.`);
          continue;
        }

        const publicUrl = await uploadProductImage(file);
        setImageUrls((prev) => [...prev, publicUrl]);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert(
        "Gagal upload foto: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setUploading(false);
    }
  };

  const handleAddLink = () => {
    if (!linkInput.trim()) {
      alert("Masukkan URL gambar terlebih dahulu");
      return;
    }

    if (imageUrls.length >= 5) {
      alert("Maksimal 5 foto per produk");
      return;
    }

    try {
      new URL(linkInput);
      setImageUrls((prev) => [...prev, linkInput.trim()]);
      setLinkInput("");
    } catch {
      alert(
        "URL tidak valid. Pastikan URL lengkap dengan http:// atau https://"
      );
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // ==========================================
  // Form Handlers
  // ==========================================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return "Nama produk wajib diisi";
    }
    if (formData.name.trim().length < 3) {
      return "Nama produk minimal 3 karakter";
    }
    if (!formData.category_id) {
      return "Pilih kategori produk";
    }
    if (!formData.price || Number(formData.price) <= 0) {
      return "Harga produk harus lebih dari 0";
    }
    if (!formData.stock || Number(formData.stock) < 0) {
      return "Stok produk tidak boleh negatif";
    }
    return null;
  };

  // ==========================================
  // Submit Handler
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploading) {
      alert("Tunggu sampai upload foto selesai");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const imagesArray = imageUrls.length > 0 ? imageUrls : null;

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category_id: formData.category_id,
        condition: formData.condition,
        weight: formData.weight ? Number(formData.weight) : 0,
        images: imagesArray,
      };

      console.log("📤 Updating product with payload:", payload);

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const json = await res.json();
      console.log("✅ Update response:", json);

      if (json.success) {
        alert("Produk berhasil diperbarui!");
        router.push("/seller/dashboard/products");
        router.refresh();
      } else {
        throw new Error(json.message || "Gagal memperbarui produk");
      }
    } catch (error) {
      console.error("❌ Error updating product:", error);
      alert(
        "Gagal memperbarui produk:\n" +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // Loading State
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mb-4"></div>
          <p className="text-sm font-medium text-gray-600">Memuat data produk...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Error State
  // ==========================================
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-red-600 mb-6 flex justify-center">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Error Loading Data</h3>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Kembali
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Produk tidak ditemukan</p>
      </div>
    );
  }

  // ==========================================
  // Main UI
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Produk</h1>
              <p className="text-sm text-gray-600 mt-1">
                Perbarui informasi produk Anda
              </p>
            </div>
            <Link
              href="/seller/dashboard/products"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali
            </Link>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Foto Produk
              </label>
              <p className="text-xs text-gray-500">
                Maksimal 5 foto. Pilih metode upload yang Anda inginkan.
              </p>
            </div>

            {/* Upload Method Toggle */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setUploadMethod("link")}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  uploadMethod === "link"
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Link URL
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod("file")}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  uploadMethod === "file"
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload File
              </button>
            </div>

            {/* Link Input Method */}
            {uploadMethod === "link" && (
              <div className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddLink();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddLink}
                    disabled={imageUrls.length >= 5}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Tambah
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Contoh: https://i.imgur.com/abc123.jpg
                </p>
              </div>
            )}

            {/* Image Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square border-2 border-gray-200 rounded-lg overflow-hidden group bg-gray-50"
                >
                  <Image
                    src={url}
                    alt={`Product image ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg"
                    title="Hapus foto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded font-medium">
                    {index + 1}
                  </div>
                </div>
              ))}

              {imageUrls.length < 5 && uploadMethod === "file" && (
                <label className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-red-400 transition-all group">
                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-2"></div>
                      <span className="text-xs text-gray-500">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="w-10 h-10 text-gray-400 group-hover:text-red-500 transition-colors mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="text-xs text-gray-500 font-medium">
                        Tambah Foto
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>

            {/* Debug Info */}
            {imageUrls.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 mb-1">
                  Debug - Images Array:
                </p>
                <code className="text-xs text-blue-700 break-all">
                  {JSON.stringify(imageUrls)}
                </code>
              </div>
            )}
          </div>

          {/* Product Information Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">
              Informasi Produk
            </h2>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nama Produk <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Contoh: Samsung Galaxy S23 Ultra 256GB"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.name.length}/200 karakter
              </p>
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  name="category_id"
                  required
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Kondisi <span className="text-red-500">*</span>
                </label>
                <select
                  name="condition"
                  required
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  <option value="Baru">Baru</option>
                  <option value="Bekas">Bekas</option>
                </select>
              </div>
            </div>

            {/* Price, Stock, Weight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Harga <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    Rp
                  </span>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 pl-11 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="0"
                    min="0"
                    max="999999999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Stok <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="0"
                  min="0"
                  max="999999"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Berat (gram)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Deskripsi Produk
              </label>
              <textarea
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                placeholder="Jelaskan detail produk, spesifikasi, kondisi, kelengkapan, dll..."
                maxLength={2000}
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/2000 karakter
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            <Link
              href="/seller/dashboard/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="inline-flex items-center justify-center px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Produk
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}