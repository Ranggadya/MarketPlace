"use client";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBarMini";
import CategoryPills from "@/components/CategoryPills";
interface HomeClientWrapperProps {
  type?: "searchbar" | "pills" | "both";
}
export default function HomeClientWrapper({ type = "both" }: HomeClientWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentKeyword = searchParams.get("keyword") || "";
  const currentLocation = searchParams.get("location") || "";
  const currentCategory = searchParams.get("category") || "all";

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
    router.push(`/product?${params.toString()}`);
  };

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
    <>
      {(type === "pills" || type === "both") && (
        <CategoryPills
          onCategoryChange={handleCategoryChange}
          initialCategory={currentCategory}
        />
      )}
    </>
  );
}
