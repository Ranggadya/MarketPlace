import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import ProductPageClientWrapper from "@/components/ProductPageClientWrapper";
import Breadcrumb from "@/components/Breadcrumb";
import { ProductService } from "@/layers/services/ProductService";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_MAP } from "@/lib/constants";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
interface ProductListPageProps {
  searchParams: Promise<{
    keyword?: string;
    location?: string;
    category?: string;
  }>;
}
export default async function ProductListPage({ searchParams }: ProductListPageProps) {
  // Unwrap searchParams Promise
  const params = await searchParams;
  // Fetch products dengan filters
  const productService = new ProductService();
  const products = await productService.getCatalog({
    keyword: params.keyword,
    location: params.location,
    category: params.category,
  });
  // Build breadcrumb label
  const hasFilters = params.keyword || params.location || params.category;
  const breadcrumbLabel = hasFilters ? "Hasil Pencarian" : "Semua Produk";
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: breadcrumbLabel }]} />
        </div>
      </section>
      {/* Search Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <ProductPageClientWrapper />
        </div>
      </section>
      {/* Active Filters Badge */}
      {hasFilters && (
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Filter Aktif:</span>
              
              {params.keyword && (
                <Badge variant="secondary" className="text-sm">
                  Produk: <span className="font-semibold ml-1">{params.keyword}</span>
                </Badge>
              )}
              
              {params.location && (
                <Badge variant="secondary" className="text-sm">
                  Lokasi: <span className="font-semibold ml-1">{params.location}</span>
                </Badge>
              )}
              
              {params.category && params.category !== "all" && (
                <Badge variant="secondary" className="text-sm">
                  Kategori: <span className="font-semibold ml-1">
                    {CATEGORY_MAP[params.category] || params.category}
                  </span>
                </Badge>
              )}
              {/* Clear All Button */}
              <a 
                href="/product"
                className="text-sm text-primary hover:underline font-medium ml-2"
              >
                Hapus Semua Filter
              </a>
            </div>
          </div>
        </section>
      )}
      {/* Product Grid Section */}
      <section className="px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header with Result Count */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {hasFilters ? "Hasil Pencarian" : "Semua Produk"}
            </h1>
            <p className="text-gray-600">
              {products.length > 0 ? (
                <>
                  Menampilkan <span className="font-semibold text-gray-900">{products.length}</span> produk
                  {params.keyword && ` untuk "${params.keyword}"`}
                </>
              ) : (
                "Tidak ada produk ditemukan"
              )}
            </p>
          </div>
          {/* Product Grid */}
          <Suspense fallback={
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          }>
            {products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <svg 
                      className="w-12 h-12 text-gray-400" 
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
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Tidak Ada Produk Ditemukan
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Coba ubah kata kunci atau filter pencarian Anda
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a 
                      href="/product"
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      Lihat Semua Produk
                    </a>
                    <a 
                      href="/"
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Kembali ke Beranda
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </Suspense>
        </div>
      </section>
    </main>
  );
}
