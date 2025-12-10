"use client";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import CategoryPills from "@/components/CategoryPills";
interface HomeClientWrapperProps {
  type?: "searchbar" | "pills" | "both";
}
export default function HomeClientWrapper({ type = "both" }: HomeClientWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Read current values dari URL
  const currentKeyword = searchParams.get("keyword") || "";
  const currentLocation = searchParams.get("location") || "";
  const currentCategory = searchParams.get("category") || "all";
  /**
   * Handle search submission dari SearchBar
   * REDIRECT ke /product page
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
    // CHANGED: Redirect to /product instead of homepage
    router.push(`/product?${params.toString()}`);
  };
  /**
   * Handle category change dari CategoryPills
   * REDIRECT ke /product page
   */
  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    // CHANGED: Redirect to /product
    router.push(`/product?${params.toString()}`);
  };
  return (
    <>
      {/* Conditional Rendering: SearchBar */}
      {(type === "searchbar" || type === "both") && (
        <SearchBar 
          onSearch={handleSearch}
          initialKeyword={currentKeyword}
          initialLocation={currentLocation}
          initialCategory={currentCategory}
        />
      )}
      {/* Conditional Rendering: CategoryPills */}
      {(type === "pills" || type === "both") && (
        <CategoryPills 
          onCategoryChange={handleCategoryChange}
          initialCategory={currentCategory}
        />
      )}
    </>
  );
}
