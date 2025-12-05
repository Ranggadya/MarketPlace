"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
const categories = [
  { id: "all", label: "Semua", value: "all" },
  { id: "elektronik", label: "Elektronik", value: "elektronik" },
  { id: "fashion", label: "Fashion", value: "fashion" },
  { id: "makanan", label: "Makanan", value: "makanan" },
  { id: "buku", label: "Buku", value: "buku" },
  { id: "hobi", label: "Hobi", value: "hobi" },
];
interface CategoryPillsProps {
  onCategoryChange?: (category: string) => void;
}
export default function CategoryPills({ onCategoryChange }: CategoryPillsProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
    console.log("Category selected:", category);
  };
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
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
