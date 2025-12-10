import { ShoppingBag, Users, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import TrustSection from "@/components/TrustSection";
import TestimonialSection from "@/components/TestimonialSection";
import Footer from "@/components/Footer";
import HomeClientWrapper from "@/components/HomeClientWrapper";
import { ProductService } from "@/layers/services/ProductService";
export default async function Home() {
  // Fetch ALL products (no filter applied at homepage)
  const productService = new ProductService();
  const products = await productService.getCatalog();
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/image/background.jpg')",
          }}
        />
        
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Content (positioned above background) */}
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center space-y-8">
            {/* Icons Row */}
            <div className="flex justify-center gap-4 md:gap-6 mb-6">
              <div className="p-3 bg-white rounded-full shadow-md animate-bounce">
                <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <div className="p-3 bg-white rounded-full shadow-md animate-bounce delay-100">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <div className="p-3 bg-white rounded-full shadow-md animate-bounce delay-200">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
            </div>
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Temukan Barang Impianmu
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto">
                Marketplace Terpercaya dengan Harga Terbaik
              </p>
            </div>
            {/* Statistics */}
            <div className="flex justify-center gap-8 md:gap-12 pt-4">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">
                  {products.length}+
                </p>
                <p className="text-sm md:text-base text-white/80">Produk</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">50K+</p>
                <p className="text-sm md:text-base text-white/80">Pengguna</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">4.8</p>
                <p className="text-sm md:text-base text-white/80">Rating</p>
              </div>
            </div>
            {/* CTA Button */}
            <div className="pt-6">
              <a href="#catalog">
                <Button
                  size="lg"
                  className="px-8 py-6 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Jelajahi Produk
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Sticky Search Bar Container */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-4">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <HomeClientWrapper type="searchbar" />
        </div>
      </div>
      {/* Category Pills Container (Normal Flow - Non Sticky) */}
      <section className="px-4 md:px-6 lg:px-8 py-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <HomeClientWrapper type="pills" />
        </div>
      </section>
      {/* Product Catalog Section */}
      <section id="catalog" className="px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-8 md:mb-12 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Produk Terpopuler
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Jelajahi koleksi produk terlengkap dari berbagai kategori
            </p>
          </div>
          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-500 text-lg">Belum ada produk tersedia</p>
              </div>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))
            )}
          </div>
        </div>
      </section>
      {/* Trust Section */}
      <TrustSection />
      {/* Testimonial Section */}
      <TestimonialSection />
      {/* Footer */}
      <Footer />
    </main>
  );
}
