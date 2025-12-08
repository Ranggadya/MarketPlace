import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, MapPin, Store, MessageCircle } from "lucide-react";
import { ProductService } from "@/layers/services/ProductService";
import ProductReviews from "@/components/ProductReviews";
import ProductImageGallery from "@/components/ProductImageGallery"; // ✅ NEW IMPORT
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}
/**
 * Format nomor HP Indonesia untuk WhatsApp link
 * Converts: 08xxx → 628xxx
 * Handles: spaces, dashes, parentheses
 */
function formatPhoneForWhatsApp(phone: string): string {
  // Remove semua non-digit characters (spasi, dash, tanda kurung, dll)
  const cleaned = phone.replace(/\D/g, "");
  
  // Convert 08xxx → 628xxx
  if (cleaned.startsWith("08")) {
    return "62" + cleaned.substring(1);
  }
  
  // Jika sudah 628xxx, return as is
  if (cleaned.startsWith("62")) {
    return cleaned;
  }
  
  // Jika format lain (edge case), assume Indonesia dan tambah 62
  return "62" + cleaned;
}
/**
 * Generate pre-filled WhatsApp message (Detailed format)
 */
function generateWhatsAppMessage(storeName: string, productName: string, price: number): string {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
  return `Halo ${storeName}, saya melihat produk Anda di Marketplace PPL:
Nama Produk: ${productName}
Harga: ${formattedPrice}
Apakah produk masih tersedia? Terima kasih.`;
}
export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Unwrap params Promise
  const { id } = await params;
  // Fetch product detail dari database
  const productService = new ProductService();
  const result = await productService.getProductDetail(id);
  // Handle 404 - Product not found
  if (!result) {
    notFound();
  }
  const { product, reviews, reviewCount, averageRating } = result;
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
  // Generate WhatsApp link jika seller phone tersedia
  const whatsappLink = product.sellerPhone
    ? `https://wa.me/${formatPhoneForWhatsApp(product.sellerPhone)}?text=${encodeURIComponent(
        generateWhatsAppMessage(product.storeName, product.name, product.price)
      )}`
    : null;
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
          {/* Left Column: Product Image Gallery */}
          <ProductImageGallery 
            images={product.images} 
            productName={product.name} 
          />
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
                {renderStars(Math.round(averageRating))}
                <span className="font-semibold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({reviewCount} ulasan)
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
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
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
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{product.storeCity}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Action Buttons - WhatsApp */}
            {whatsappLink && (
              <div className="pt-4">
                <Link 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button 
                    size="lg" 
                    className="w-full text-base font-semibold bg-[#25D366] hover:bg-[#20BA5A] text-white"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat via WhatsApp
                  </Button>
                </Link>
              </div>
            )}
            {/* Info Note */}
            <p className="text-sm text-gray-500 pt-2">
              💡 <span className="font-medium">Tips:</span> Chat penjual untuk nego harga atau tanya stok sebelum membeli.
            </p>
          </div>
        </div>
      </section>
      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 border-t border-gray-200">
        <ProductReviews 
          productId={id} 
          reviews={reviews} 
          reviewCount={reviewCount} 
        />
      </section>
    </main>
  );
}
