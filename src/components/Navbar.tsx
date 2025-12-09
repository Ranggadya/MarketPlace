"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild>
              <Link href="/seller/register">Mulai Jualan</Link>
            </Button>
          </div>
          {/* Mobile Menu - Sheet */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button
                  className="w-full"
                  asChild
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/seller/register">Mulai Jualan</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
