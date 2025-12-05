"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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
  seller_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  weight: number;
  condition: "Baru" | "Bekas";
  status: "active" | "inactive" | "archived";
  images: string[] | null;
  rating: number | null;
  sold_count: number;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  categories?: Category | null;
}

// ==========================================
// Image Gallery Modal Component
// ==========================================
interface ImageGalleryModalProps {
  images: string[];
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

function ImageGalleryModal({ images, productName, isOpen, onClose }: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
      if (e.key === "ArrowLeft" && !isZoomed) prevImage();
      if (e.key === "ArrowRight" && !isZoomed) nextImage();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isZoomed]);

  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false);
      setIsZoomed(false);
    }
  }, [currentIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
      setIsZoomed(false);
      setImageLoaded(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const nextImage = () => {
    if (!isZoomed) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (!isZoomed) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (isZoomed) {
      toggleZoom();
    } else {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-95 backdrop-blur-md animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div 
        className="relative w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4 pointer-events-none">
          <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-semibold text-lg line-clamp-1">{productName}</h2>
              <p className="text-gray-300 text-sm mt-1">
                Foto {currentIndex + 1} dari {images.length}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleZoom();
                }}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm"
                title={isZoomed ? "Zoom Out (ESC)" : "Zoom In"}
              >
                {isZoomed ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm"
                title="Close (ESC)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main Image Container - PROPORTIONAL SIZING */}
        <div className="absolute inset-0 flex items-center justify-center" style={{
          paddingTop: '100px',
          paddingBottom: images.length > 1 && !isZoomed ? '180px' : '100px',
          paddingLeft: '80px',
          paddingRight: '80px'
        }}>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Loading Spinner */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
              </div>
            )}
            
            {/* Image Container - FIXED PROPORTIONAL SIZE */}
            <div 
              className={`relative transition-all duration-300 ${
                isZoomed 
                  ? 'w-full h-full' 
                  : 'w-auto h-auto'
              }`}
              style={{
                maxWidth: isZoomed ? '100%' : '700px',
                maxHeight: isZoomed ? '100%' : '700px',
              }}
            >
              <div
                className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl ${
                  isZoomed ? 'w-full h-full' : ''
                }`}
                style={{
                  width: isZoomed ? '100%' : '700px',
                  height: isZoomed ? '100%' : '700px',
                }}
                onClick={toggleZoom}
              >
                <Image
                  src={images[currentIndex]}
                  alt={`${productName} - Image ${currentIndex + 1}`}
                  fill
                  sizes={isZoomed ? "100vw" : "700px"}
                  className={`object-contain transition-all duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
                  unoptimized
                  priority
                  onLoad={() => setImageLoaded(true)}
                />
                
                {/* Zoom Hint */}
                {!isZoomed && imageLoaded && (
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all flex items-center justify-center group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-white px-4 py-2 rounded-full text-sm font-medium pointer-events-none">
                      Klik untuk zoom
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && !isZoomed && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute -left-16 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-4 shadow-2xl transition-all hover:scale-110 backdrop-blur-sm z-10"
                    title="Previous (Arrow Left)"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute -right-16 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-4 shadow-2xl transition-all hover:scale-110 backdrop-blur-sm z-10"
                    title="Next (Arrow Right)"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && !isZoomed && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/80 to-transparent p-6 pb-8 z-10">
            <div className="max-w-7xl mx-auto">
              <div className="flex gap-3 justify-center overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                      idx === currentIndex
                        ? "border-3 border-red-500 ring-4 ring-red-500/50 scale-110"
                        : "border-2 border-white/30 hover:border-white/60 hover:scale-105"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized
                    />
                    {idx === currentIndex && (
                      <div className="absolute inset-0 bg-red-500/20"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Info */}
        {!isZoomed && (
          <div className="absolute bottom-36 right-6 bg-black/60 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm z-10 pointer-events-none">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd>
                <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd>
                <span>Close</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}

// ==========================================
// Main Component
// ==========================================
export default function ProductsPage() {
  // ...existing code...
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch("/api/products", {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      
      if (json.success) {
        setProducts(json.data || []);
      } else {
        throw new Error(json.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();

      if (json.success) {
        alert("Produk berhasil dihapus");
        fetchProducts();
      } else {
        throw new Error(json.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Gagal menghapus produk: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string, name: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const action = newStatus === "active" ? "mengaktifkan" : "menonaktifkan";
    
    if (!confirm(`Yakin ingin ${action} produk "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();

      if (json.success) {
        alert(`Produk berhasil ${action === "mengaktifkan" ? "diaktifkan" : "dinonaktifkan"}`);
        fetchProducts();
      } else {
        throw new Error(json.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Gagal mengubah status: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  const openImageGallery = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const getCategoryName = (product: Product): string => {
    const cat = product.category || product.categories;
    if (!cat) return "-";
    if (typeof cat === 'object' && 'name' in cat) {
      return cat.name || "-";
    }
    return "-";
  };

  const getFirstImage = (images: string[] | null): string | null => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return null;
    }
    return images[0] || null;
  };

  const getImageCount = (images: string[] | null): number => {
    if (!images || !Array.isArray(images)) return 0;
    return images.filter(url => url && url.length > 0).length;
  };

  const filteredProducts = products.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryName = getCategoryName(p);
    const categoryMatch = categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || categoryMatch;
  });

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
          <button 
            onClick={fetchProducts}
            className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedProduct && (
        <ImageGalleryModal
          images={selectedProduct.images || []}
          productName={selectedProduct.name}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* ...existing code... */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kelola Produk</h1>
              <p className="text-sm text-gray-600 mt-1">
                Total {products.length} produk terdaftar
              </p>
            </div>
            <Link
              href="/seller/dashboard/products/create"
              className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Produk
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Cari produk berdasarkan nama atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-3 pl-11 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Informasi Produk
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                        <p className="text-sm font-medium text-gray-600">Memuat data dari database...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-base font-semibold text-gray-700 mb-2">
                          {searchQuery
                            ? `Tidak ada produk dengan kata kunci "${searchQuery}"`
                            : "Belum ada produk"}
                        </p>
                        {!searchQuery && (
                          <p className="text-sm text-gray-500 mb-6">
                            Tambahkan produk pertama Anda untuk mulai berjualan
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* ...existing table cells... */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openImageGallery(product)}
                          className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 hover:border-red-400 transition-all group cursor-pointer"
                          title="Klik untuk lihat semua foto"
                        >
                          {getFirstImage(product.images) ? (
                            <>
                              <Image
                                src={getFirstImage(product.images)!}
                                alt={product.name}
                                fill
                                sizes="80px"
                                className="object-cover group-hover:scale-110 transition-transform"
                                unoptimized
                              />
                              {getImageCount(product.images) > 1 && (
                                <>
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                    <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold bg-red-600 px-2 py-1 rounded">
                                      +{getImageCount(product.images) - 1} foto
                                    </span>
                                  </div>
                                  <div className="absolute top-1 right-1 bg-black bg-opacity-75 text-white text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                    {getImageCount(product.images)}
                                  </div>
                                </>
                              )}
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-3xl">
                              {product.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="font-semibold text-gray-900 mb-2 line-clamp-1">
                            {product.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
                              {product.condition}
                            </span>
                            <span className="text-gray-500">
                              {product.weight}g
                            </span>
                            {product.rating !== null && product.rating > 0 && (
                              <span className="flex items-center gap-1 text-gray-600">
                                <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {product.rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 text-base">
                          Rp {product.price.toLocaleString("id-ID")}
                        </p>
                        {product.sold_count > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Terjual {product.sold_count}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                            product.stock === 0
                              ? "bg-red-100 text-red-700"
                              : product.stock < 2
                              ? "bg-orange-100 text-orange-700"
                              : product.stock <= 10
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {product.stock === 0 ? "Habis" : `${product.stock} unit`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 font-medium">
                          {getCategoryName(product)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(product.id, product.status, product.name)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            product.status === "active"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          title={`Klik untuk ${product.status === "active" ? "menonaktifkan" : "mengaktifkan"}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              product.status === "active"
                                ? "bg-green-600"
                                : "bg-gray-400"
                            }`}
                          ></span>
                          {product.status === "active" ? "Aktif" : "Nonaktif"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/seller/dashboard/products/${product.id}/edit`}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                            title="Edit Produk"
                          >
                            <svg
                              className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                            title="Hapus Produk"
                          >
                            <svg
                              className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center font-medium">
              Klik foto produk untuk melihat semua gambar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}