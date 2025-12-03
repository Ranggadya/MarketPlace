import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, MapPin, Store, Heart, ShoppingCart } from "lucide-react";
import { getProductById } from "@/lib/productData";
import ProductReviews from "@/components/ProductReviews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
interface ProductDetailPageProps {
  params: Promise<{    // ✅ Updated: params is now Promise
    id: string;
  }>;
}
export default async function ProductDetailPage({ 
  params 
}: ProductDetailPageProps) {
  // ✅ FIX: Unwrap params Promise with await
  const { id } = await params;
  const product = getProductById(id);
  // Handle 404 - Product not found
  if (!product) {
    notFound();
  }
  // Format price to IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };
  // Render rating stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => {
          const starValue = index + 1;
          return (
            <Star
              key={index}
              className={`w-5 h-5 ${
                starValue <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          );
        })}
      </div>
    );
  };
  return (
    <main className="min-h-screen bg-white">
      {/* Back Button */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali ke Beranda</span>
          </Link>
        </div>
      </section>
      {/* Product Detail Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          {/* Right Column: Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {product.category}
              </Badge>
            </div>
            {/* Product Name */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
            {/* Price */}
            <div className="pb-6 border-b border-gray-200">
              <p className="text-3xl md:text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>
            </div>
            {/* Rating & Sold */}
            <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                {renderStars(product.rating)}
                <span className="font-semibold text-gray-900">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <div className="h-6 w-px bg-gray-300" />
              <div className="text-gray-600">
                <span className="font-semibold text-gray-900">{product.sold}</span> Terjual
              </div>
            </div>
            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Deskripsi Produk
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
            {/* Store Info */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Store className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-gray-900">
                      {product.storeName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-700">
                          {product.storeRating.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{product.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button size="lg" className="flex-1 text-base font-semibold">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Beli Sekarang
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="sm:w-auto px-6"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>
            {/* Info Note */}
            <p className="text-sm text-gray-500 pt-2">
              💡 <span className="font-medium">Tips:</span> Chat penjual untuk nego harga atau tanya stok sebelum membeli.
            </p>
          </div>
        </div>
      </section>
      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 border-t border-gray-200">
        <ProductReviews productId={id} />
      </section>
    </main>
  );
}
