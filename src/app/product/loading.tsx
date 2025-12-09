import ProductCardSkeleton from "@/components/ProductCardSkeleton";
export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb Skeleton */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </section>
      {/* Search Section Skeleton */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="h-32 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </section>
      {/* Product Grid Skeleton */}
      <section className="px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
