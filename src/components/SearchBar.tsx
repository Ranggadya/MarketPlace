"use client";
import { useState } from "react";
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
interface SearchBarProps {
  onSearch?: (query: string, location: string, category: string) => void;
}
export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery, locationQuery, selectedCategory);
    }
    // Log untuk debugging
    console.log("Search:", { searchQuery, locationQuery, selectedCategory });
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
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="elektronik">Elektronik</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="makanan">Makanan & Minuman</SelectItem>
              <SelectItem value="buku">Buku & Alat Tulis</SelectItem>
              <SelectItem value="hobi">Hobi & Koleksi</SelectItem>
              <SelectItem value="lainnya">Lainnya</SelectItem>
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
