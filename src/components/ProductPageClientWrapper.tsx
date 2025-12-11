"use client";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBarMini";
import CategoryPills from "@/components/CategoryPills";
export default function ProductPageClientWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Read current values dari URL
  const currentKeyword = searchParams.get("keyword") || "";
  const currentLocation = searchParams.get("location") || "";
  const currentCategory = searchParams.get("category") || "all";
  /**
   * Handle search di product page
   * STAY di /product, hanya update params
   */
  const handleSearch = (keyword: string, location: string, category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (keyword) {
      params.set("keyword", keyword);
    } else {
      params.delete("keyword");
    }
    if (location) {
      params.set("location", location);
    } else {
      params.delete("location");
    }
    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    // Stay di /product page
    router.push(`/product?${params.toString()}`);
  };
  /**
   * Handle category change di product page
   */
  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/product?${params.toString()}`);
  };
  return (
    <div className="space-y-4">
      <SearchBar
        onSearch={handleSearch}
        initialKeyword={currentKeyword}
        initialLocation={currentLocation}
        initialCategory={currentCategory}
      />
      <CategoryPills
        onCategoryChange={handleCategoryChange}
        initialCategory={currentCategory}
      />
    </div>
  );
}
