"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Menu, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBarMini from "@/components/SearchBarMini";
import { CATEGORY_OPTIONS } from "@/lib/constants";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const closeCategoryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // dropdown lokasi
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const currentLocation = searchParams.get("location") || "";
  const [locationInput, setLocationInput] = useState(() => currentLocation);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (closeCategoryTimeoutRef.current) {
        clearTimeout(closeCategoryTimeoutRef.current);
      }
    };
  }, []);

  // hide navbar di halaman admin & dashboard seller
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/seller/dashboard")
  ) {
    return null;
  }

  const pushWithParams = (params: URLSearchParams) => {
    router.push(`/product?${params.toString()}`);
  };

  // search dari navbar (keyword + location + category)
  const handleNavSearch = (
    keyword: string,
    location: string,
    category: string
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (keyword) params.set("keyword", keyword);
    else params.delete("keyword");

    if (location) params.set("location", location);
    else params.delete("location");

    if (category && category !== "all") params.set("category", category);
    else params.delete("category");

    pushWithParams(params);
  };

  // khusus ubah lokasi dari dropdown lokasi
  const handleLocationOnlySearch = (location: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (location) params.set("location", location);
    else params.delete("location");

    pushWithParams(params);
  };

  // klik kategori di mega dropdown
  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category && category !== "all") params.set("category", category);
    else params.delete("category");

    setIsCategoryOpen(false);
    pushWithParams(params);
  };

  const handleCategoryMouseEnter = () => {
    if (closeCategoryTimeoutRef.current) {
      clearTimeout(closeCategoryTimeoutRef.current);
      closeCategoryTimeoutRef.current = null;
    }
    setIsCategoryOpen(true);
  };

  const handleCategoryMouseLeave = () => {
    closeCategoryTimeoutRef.current = setTimeout(() => {
      setIsCategoryOpen(false);
    }, 120);
  };

  const handleOpenLocationDropdown = () => {
    // setiap buka dropdown, sync input dengan lokasi sekarang di URL
    setLocationInput(currentLocation);
    setIsLocationOpen((prev) => !prev);
  };

  const handleLocationSubmit = () => {
    handleLocationOnlySearch(locationInput.trim());
    setIsLocationOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 bg-white border-b transition-shadow duration-200 ${
        isScrolled ? "shadow-md" : "border-gray-200"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex h-20 items-center gap-5">
          {/* KIRI: Logo + Kategori */}
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center group">
              <Image
                src="/image/logo.png"
                alt="Marketplace PPL Logo"
                width={200}
                height={56}
                className="h-12 w-auto md:h-14 hover:opacity-90 transition-opacity"
                priority
              />
            </Link>

            {/* Kategori + mega dropdown (desktop, hover dengan delay) */}
            <div
              className="relative hidden md:block"
              onMouseEnter={handleCategoryMouseEnter}
              onMouseLeave={handleCategoryMouseLeave}
            >
              <button
                type="button"
                className="text-base font-medium text-gray-700 hover:text-primary-dark flex items-center gap-1"
              >
                Kategori
              </button>

              {isCategoryOpen && (
                <div
                  className="absolute left-0 top-full mt-4
                             w-[520px] bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-40"
                >
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">
                    Semua Kategori
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[360px] overflow-y-auto">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleCategoryClick(cat.value)}
                        className="text-left text-sm text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md px-2 py-1"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TENGAH: Search bar (desktop) */}
          <SearchBarMini
            onSearch={handleNavSearch}
            initialKeyword={searchParams.get("keyword") || ""}
            initialLocation={searchParams.get("location") || ""}
          />

          {/* LOKASI: dropdown kecil antara searchbar & tombol Masuk */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <button
                type="button"
                onClick={handleOpenLocationDropdown}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                <MapPin className="h-4 w-4" />
                <span className="max-w-[120px] truncate">
                  {currentLocation || "Lokasi"}
                </span>
              </button>

              {isLocationOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-lg z-40 p-3">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Pilih Lokasi Toko
                  </p>
                  <input
                    type="text"
                    value={locationInput}
                    placeholder="Contoh: Semarang"
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleLocationSubmit();
                      }
                    }}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary"
                  />
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      className="text-xs text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        setIsLocationOpen(false);
                      }}
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      className="text-xs font-semibold text-primary hover:text-primary/80"
                      onClick={handleLocationSubmit}
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* KANAN: Tombol desktop */}
          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant="ghost"
              asChild
              className="text-sm md:text-base px-4"
            >
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild className="text-sm md:text-base px-5">
              <Link href="/seller/register">Mulai Jualan</Link>
            </Button>
          </div>

          {/* MENU MOBILE */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="ml-auto p-2 text-gray-700 transition-colors hover:text-primary md:hidden">
                <Menu className="h-7 w-7" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>LokalIN</SheetTitle>
              </SheetHeader>

              {/* Search bar versi mobile (keyword saja) */}
              <div className="mt-6">
                <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
                  <Search className="mr-2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari di LokalIN"
                    className="w-full bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const target = e.target as HTMLInputElement;
                        handleNavSearch(target.value, "", "all");
                        setIsMobileMenuOpen(false);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Kategori versi mobile (chips sederhana) */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Kategori
                </h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        handleCategoryClick(cat.value);
                        setIsMobileMenuOpen(false);
                      }}
                      className="px-3 py-1 text-xs rounded-full border border-gray-200 text-gray-700 hover:bg-primary hover:text-white transition-colors"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu tombol */}
              <div className="mt-8 flex flex-col gap-4">
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
