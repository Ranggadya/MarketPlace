import { Card } from "@/components/ui/card";
export default function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-gray-200 p-0 gap-0 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-square bg-gray-200" />
      {/* Content Skeleton */}
      <div className="p-3 space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
        {/* Price */}
        <div className="h-5 bg-gray-200 rounded w-1/2" />
        {/* Rating & Location */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    </Card>
  );
}
