"use client";
import { useState } from "react";
interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}
export default function ProductImageGallery({ 
  images, 
  productName 
}: ProductImageGalleryProps) {
  // State: Track index foto yang sedang aktif
  const [activeIndex, setActiveIndex] = useState(0);
  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Foto tidak tersedia</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {/* Main Image - Foto Besar */}
      <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 border border-gray-200 relative">
        <img
          src={images[activeIndex]}
          alt={`${productName} - Foto ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          key={activeIndex} // Force re-render untuk smooth fade effect
        />
        
        {/* Badge: Foto ke-X dari Y */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>
      {/* Thumbnails - Foto Kecil (Only show if more than 1 image) */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-2 md:gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => handleThumbnailClick(idx)}
              className={`
                aspect-square overflow-hidden rounded-lg
                transition-all duration-200
                ${
                  idx === activeIndex
                    ? "border-2 border-primary ring-2 ring-primary ring-offset-2"
                    : "border border-gray-200 hover:border-primary"
                }
              `}
              aria-label={`Lihat foto ${idx + 1}`}
              aria-pressed={idx === activeIndex}
            >
              <img
                src={img}
                alt={`${productName} - Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
