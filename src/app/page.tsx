"use client";
import { useState, useEffect } from "react";
import { ShoppingBag, Users, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import CategoryPills from "@/components/CategoryPills";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import TrustSection from "@/components/TrustSection";
import TestimonialSection from "@/components/TestimonialSection";
import Footer from "@/components/Footer";
import { dummyProducts } from "@/lib/productData";

// Dummy Products Data - 12 items (UPDATED dengan sold count)
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [productsCount, setProductsCount] = useState(0);
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  // Animated counter for statistics
  useEffect(() => {
    if (!isLoading) {
      let count = 0;
      const target = 10000;
      const increment = target / 50;
      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          setProductsCount(target);
          clearInterval(timer);
        } else {
          setProductsCount(Math.floor(count));
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isLoading]);
  const handleSearch = (query: string, location: string, category: string) => {
    console.log("Search triggered:", { query, location, category });
    // TODO: Implement filter logic
  };
  const handleCategoryChange = (category: string) => {
    console.log("Category filter:", category);
    // TODO: Implement category filter
  };
  const scrollToCatalog = () => {
    const catalogSection = document.getElementById("catalog");
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - ENHANCED */}
      <section className="relative bg-gradient-to-br from-red-50 via-white to-red-50/30 overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: 'radial-gradient(circle, #DB4444 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        
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
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Temukan Barang Impianmu
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto">
                Marketplace Terpercaya dengan Harga Terbaik
              </p>
            </div>
            {/* NEW: Animated Statistics */}
            <div className="flex justify-center gap-8 md:gap-12 pt-4">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  {productsCount.toLocaleString("id-ID")}+
                </p>
                <p className="text-sm md:text-base text-gray-600">Produk</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">50K+</p>
                <p className="text-sm md:text-base text-gray-600">Pengguna</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">4.8</p>
                <p className="text-sm md:text-base text-gray-600">Rating</p>
              </div>
            </div>
            {/* NEW: CTA Button */}
            <div className="pt-6">
              <Button
                size="lg"
                onClick={scrollToCatalog}
                className="px-8 py-6 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Jelajahi Produk
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Search Section - with Category Pills */}
      <section className="relative -mt-8 md:-mt-10 px-4 md:px-6 lg:px-8 pb-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <SearchBar onSearch={handleSearch} />
          {/* NEW: Category Pills */}
          <CategoryPills onCategoryChange={handleCategoryChange} />
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
              Temukan produk terbaik dari berbagai kategori
            </p>
          </div>
          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
            {isLoading
              ? Array.from({ length: 12 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))
              : dummyProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
          </div>
        </div>
      </section>
      {/* NEW: Trust Section */}
      <TrustSection />
      {/* NEW: Testimonial Section */}
      <TestimonialSection />
      {/* NEW: Footer */}
      <Footer />
    </main>
  );
}
