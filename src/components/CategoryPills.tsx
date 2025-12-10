"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_OPTIONS } from "@/lib/constants";
// Remove "Semua Kategori" untuk pills (hanya untuk dropdown)
const PILL_CATEGORIES = CATEGORY_OPTIONS.filter(cat => cat.value !== "all");
interface CategoryPillsProps {
  onCategoryChange?: (category: string) => void;
  initialCategory?: string;
}
export default function CategoryPills({ 
  onCategoryChange,
  initialCategory = "all" 
}: CategoryPillsProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  // Sync dengan initial value dari URL
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {/* "Semua" pill untuk reset filter */}
      <button
        onClick={() => handleCategoryClick("all")}
        className="shrink-0"
      >
        <Badge
          variant={activeCategory === "all" ? "default" : "outline"}
          className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
            activeCategory === "all"
              ? "bg-primary text-white hover:bg-primary/90"
              : "hover:bg-gray-100"
          }`}
        >
          Semua
        </Badge>
      </button>
      {/* Category pills dari constants */}
      {PILL_CATEGORIES.map((category) => (
        <button
          key={category.value}
          onClick={() => handleCategoryClick(category.value)}
          className="shrink-0"
        >
          <Badge
            variant={activeCategory === category.value ? "default" : "outline"}
            className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === category.value
                ? "bg-primary text-white hover:bg-primary/90"
                : "hover:bg-gray-100"
            }`}
          >
            {category.label}
          </Badge>
        </button>
      ))}
    </div>
  );
}
