'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Swal from 'sweetalert2';
import { Upload, X, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
interface Category {
  id: string;
  name: string;
  slug: string;
}
interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
}
export default function CreateProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: ''
  });
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error: any) {
        console.error('Fetch categories error:', error);
        // Fallback to default categories if API fails
        setCategories([
          { id: '1', name: 'Electronics', slug: 'electronics' },
          { id: '2', name: 'Fashion', slug: 'fashion' },
          { id: '3', name: 'Home & Garden', slug: 'home-garden' },
          { id: '4', name: 'Sports & Outdoors', slug: 'sports-outdoors' },
          { id: '5', name: 'Books & Media', slug: 'books-media' },
          { id: '6', name: 'Toys & Games', slug: 'toys-games' },
          { id: '7', name: 'Food & Beverage', slug: 'food-beverage' },
          { id: '8', name: 'Health & Beauty', slug: 'health-beauty' },
          { id: '9', name: 'Automotive', slug: 'automotive' },
          { id: '10', name: 'Other', slug: 'other' }
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
    }));
  };
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = imageFiles.length + files.length;
    
    if (totalImages > 5) {
      Swal.fire({
        icon: 'warning',
        title: 'Terlalu Banyak Gambar',
        text: 'Maksimal 5 gambar per produk'
      });
      return;
    }
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      if (!isValidType) {
        Swal.fire({
          icon: 'error',
          title: 'Tipe File Tidak Valid',
          text: `${file.name} bukan file gambar`
        });
        return false;
      }
      if (!isValidSize) {
        Swal.fire({
          icon: 'error',
          title: 'File Terlalu Besar',
          text: `${file.name} melebihi batas 5MB`
        });
        return false;
      }
      return true;
    });
    // Create previews
    const newPreviews: string[] = [];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
    setImageFiles(prev => [...prev, ...validFiles]);
  };
  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];
    setUploadingImages(true);
    const uploadedUrls: string[] = [];
    try {
      for (const file of imageFiles) {
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${file.name}`;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', fileName);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }
        const data = await response.json();
        uploadedUrls.push(data.url);
      }
      return uploadedUrls;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!formData.name.trim()) {
      Swal.fire('Error', 'Nama produk harus diisi', 'error');
      return;
    }
    if (!formData.description.trim()) {
      Swal.fire('Error', 'Deskripsi produk harus diisi', 'error');
      return;
    }
    if (formData.price <= 0) {
      Swal.fire('Error', 'Harga harus lebih besar dari 0', 'error');
      return;
    }
    if (formData.stock < 0) {
      Swal.fire('Error', 'Stok tidak boleh negatif', 'error');
      return;
    }
    if (!formData.category_id) {
      Swal.fire('Error', 'Silakan pilih kategori', 'error');
      return;
    }
    if (imageFiles.length === 0) {
      Swal.fire('Error', 'Minimal 1 gambar produk diperlukan', 'error');
      return;
    }
    setLoading(true);
    try {
      // Upload images first
      const imageUrls = await uploadImages();
      // Create product
      const response = await fetch('/api/seller/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          category_id: formData.category_id,
          images: imageUrls,
          status: 'active'
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal menambahkan produk');
      }
      await Swal.fire({
        icon: 'success',
        title: 'Produk Berhasil Ditambahkan!',
        text: 'Produk Anda telah berhasil ditambahkan',
        timer: 2000,
        showConfirmButton: false
      });
      router.push('/seller/dashboard/products');
    } catch (error: any) {
      console.error('Create product error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menambahkan Produk',
        text: error.message || 'Terjadi kesalahan'
      });
    } finally {
      setLoading(false);
    }
  };
  if (loadingCategories) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-red-500" size={48} />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back Button */}
        <Link 
          href="/seller/dashboard/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Daftar Produk</span>
        </Link>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Tambah Produk Baru</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Produk <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Masukkan nama produk"
                required
              />
            </div>
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Deskripsikan produk Anda..."
                required
              />
            </div>
            {/* Price and Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga (IDR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stok <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>
            </div>
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Pilih kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gambar Produk <span className="text-red-500">*</span> (Maks 5 gambar, 5MB per gambar)
              </label>
              <div className="space-y-4">
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border-2 border-red-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Upload Button */}
                {imagePreviews.length < 5 && (
                  <div className="grid grid-cols-5 gap-4">
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-red-500 hover:bg-red-50 transition">
                      <Upload className="text-gray-400 mb-2" size={24} />
                      <span className="text-xs text-gray-500 text-center">Tambah Gambar</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {imagePreviews.length}/5 gambar
              </p>
            </div>
            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || uploadingImages}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    {uploadingImages ? 'Mengupload Gambar...' : 'Menambahkan Produk...'}
                  </span>
                ) : (
                  'Tambah Produk'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
