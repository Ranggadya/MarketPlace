"use client";

import { useState, KeyboardEvent, FormEvent } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarMiniProps {
  onSearch?: (keyword: string, location: string, category: string) => void;
  initialKeyword?: string;
  initialLocation?: string;
  initialCategory?: string;
}

export default function SearchBarMini({
  onSearch,
  initialKeyword = "",
  initialLocation = "",
  initialCategory = "all",
}: SearchBarMiniProps) {
  const [searchQuery, setSearchQuery] = useState(initialKeyword);
  const [locationQuery, setLocationQuery] = useState(initialLocation);

  const triggerSearch = () => {
    onSearch?.(searchQuery, locationQuery, initialCategory);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    triggerSearch();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      triggerSearch();
    }
  };

  return (
    <form
      className="hidden flex-1 items-center md:flex"
      onSubmit={handleSubmit}
    >
      <div
        className="flex w-full items-stretch rounded-full border border-gray-300 bg-gray-50 text-sm shadow-sm overflow-hidden
                   focus-within:border-primary-dark focus-within:bg-white focus-within:shadow-md transition"
      >
        {/* Input keyword */}
        <div className="flex flex-1 items-center gap-2 px-4 py-2.5">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari produk lokal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8 border-none bg-transparent px-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Divider */}
        <div className="hidden lg:block h-6 w-px self-center bg-gray-200" />
      </div>
    </form>
  );
}
