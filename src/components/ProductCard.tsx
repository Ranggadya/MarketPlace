import Link from "next/link";
import { Star, MapPin, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  location: string;
  imageUrl: string;
  sold?: number; // NEW: Jumlah terjual
}
export default function ProductCard({
  id,
  name,
  price,
  category,
  rating,
  location,
  imageUrl,
  sold = 0,
}: ProductCardProps) {
  // Format harga ke Rupiah Indonesia
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };
  // Determine if product is "Terlaris" (rating > 4.7 OR sold > 100)
  const isBestSeller = rating > 4.7 || sold > 100;
  return (
    <Link href={`/product/${id}`}>
      <Card className="group cursor-pointer overflow-hidden border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200 p-0 gap-0">
        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {/* Badges - Positioned absolute */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-sm">
              {category}
            </Badge>
            {/* NEW: Terlaris Badge */}
            {isBestSeller && (
              <Badge className="bg-primary text-white shadow-sm">
                <TrendingUp className="w-3 h-3 mr-1" />
                Terlaris
              </Badge>
            )}
          </div>
        </div>
        {/* Content */}
        <div className="p-3 space-y-2">
          {/* Nama Produk - Truncate 2 lines */}
          <h3 className="font-semibold text-sm md:text-base line-clamp-2 text-gray-900 min-h-[2.5rem] md:min-h-[3rem]">
            {name}
          </h3>
          {/* Harga */}
          <p className="text-primary font-bold text-base md:text-lg">
            {formatPrice(price)}
          </p>
          {/* Rating & Location */}
          <div className="flex items-center justify-between text-xs md:text-sm text-gray-600">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-gray-900">{rating.toFixed(1)}</span>
            </div>
            {/* Location - WAJIB ADA */}
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-500" />
              <span className="truncate max-w-[100px]">{location}</span>
            </div>
          </div>
          {/* NEW: Sold Count */}
          {sold > 0 && (
            <p className="text-xs text-gray-500">
              {sold} Terjual
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
