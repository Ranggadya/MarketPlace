import Link from "next/link";
import { Star, MapPin, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  location: string;
  imageUrl: string;
  sold?: number;
  storeName?: string;
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
  // Format sold count dengan thousand separator
  const formatSold = (count: number) => {
    return new Intl.NumberFormat("id-ID").format(count);
  };
  // Determine if product is "Terlaris" (rating > 4.7 OR sold > 100)
  const isBestSeller = rating > 4.7 || sold > 100;
  return (
    <Link href={`/product/${id}`} className="h-full">
      <Card className="h-full flex flex-col group cursor-pointer overflow-hidden border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200 p-0 gap-0">
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
            {/* Terlaris Badge */}
            {isBestSeller && (
              <Badge className="bg-primary text-white shadow-sm">
                <TrendingUp className="w-3 h-3 mr-1" />
                Terlaris
              </Badge>
            )}
          </div>
        </div>
        {/* ✅ CardContent - flex-1 untuk mengisi ruang kosong */}
        <CardContent className="flex-1 p-3 px-6 space-y-2">
          {/* Nama Produk - Truncate 2 lines dengan min-height fixed */}
          <h3 className="font-semibold text-sm md:text-base line-clamp-2 text-gray-900 min-h-[2.5rem] md:min-h-[3rem]">
            {name}
          </h3>
          {/* Harga */}
          <p className="text-primary font-bold text-base md:text-lg">
            {formatPrice(price)}
          </p>
        </CardContent>
        {/* ✅ CardFooter - mt-auto untuk push ke bawah mentok */}
        <CardFooter className="flex-col items-stretch p-3 px-6 pt-0 gap-2 mt-auto">
          {/* Rating & Terjual - Satu Baris (justify-between) */}
          <div className="flex items-center justify-between text-xs md:text-sm min-h-[20px]">
            {/* Kiri: Rating */}
            {rating > 0 ? (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-gray-900">{rating.toFixed(1)}</span>
              </div>
            ) : (
              <div className="text-xs text-gray-400">Belum ada rating</div>
            )}
            {/* Kanan: Terjual (jika > 0, jika 0 kosong tapi space tetap) */}
            <div className="text-xs text-gray-500">
              {sold > 0 && <span>{formatSold(sold)} Terjual</span>}
            </div>
          </div>
          {/* Lokasi - Baris Terpisah dengan Border Top */}
          <div className="flex items-center gap-1 pt-2 border-t border-gray-100 text-xs md:text-sm text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
