"use client";
import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_OPTIONS } from "@/lib/constants";
interface SearchBarProps {
  onSearch?: (query: string, location: string, category: string) => void;
  initialKeyword?: string;
  initialLocation?: string;
  initialCategory?: string;
}
export default function SearchBar({ 
  onSearch,
  initialKeyword = "",
  initialLocation = "",
  initialCategory = "all",
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialKeyword);
  const [locationQuery, setLocationQuery] = useState(initialLocation);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  // Sync state dengan initial values saat props berubah (dari URL)
  useEffect(() => {
    setSearchQuery(initialKeyword);
    setLocationQuery(initialLocation);
    setSelectedCategory(initialCategory);
  }, [initialKeyword, initialLocation, initialCategory]);
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery, locationQuery, selectedCategory);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        {/* Input 1: Cari Produk */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 h-11"
          />
        </div>
        {/* Input 2: Lokasi (WAJIB - SRS Requirement) */}
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Lokasi (Kota)..."
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 h-11"
          />
        </div>
        {/* Select 3: Kategori */}
        <div className="w-full md:w-[200px]">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Tombol Cari */}
        <Button
          onClick={handleSearch}
          size="lg"
          className="w-full md:w-auto h-11 px-8 font-semibold"
        >
          <Search className="w-4 h-4 mr-2" />
          Cari
        </Button>
      </div>
    </div>
  );
}
