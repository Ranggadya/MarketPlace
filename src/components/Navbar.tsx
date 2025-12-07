"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide Navbar on Admin and Seller dashboards
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/seller")) {
    return null;
  }

  // Detect scroll untuk sticky shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      className={`sticky top-0 z-50 bg-white border-b transition-shadow duration-200 ${
        isScrolled ? "shadow-md" : "border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary rounded-lg group-hover:bg-primary/90 transition-colors">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Marketplace <span className="text-primary">PPL</span>
            </span>
          </Link>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Produk
            </Link>
            <Link
              href="/categories"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Kategori
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Tentang
            </Link>
          </div>
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/wishlist">
                <Heart className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">
                <User className="w-4 h-4 mr-2" />
                Masuk
              </Link>
            </Button>
            <Button asChild>
              <Link href="/register">Daftar</Link>
            </Button>
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 space-y-4">
            <Link
              href="/"
              className="block text-gray-700 hover:text-primary font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link
              href="/products"
              className="block text-gray-700 hover:text-primary font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Produk
            </Link>
            <Link
              href="/categories"
              className="block text-gray-700 hover:text-primary font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kategori
            </Link>
            <Link
              href="/about"
              className="block text-gray-700 hover:text-primary font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tentang
            </Link>
            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login">
                  <User className="w-4 h-4 mr-2" />
                  Masuk
                </Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/register">Daftar</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
