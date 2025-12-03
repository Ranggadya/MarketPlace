"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// Dummy Reviews Data
const dummyReviews = [
  {
    id: "1",
    userName: "Ahmad Rizki",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    comment: "Produk sesuai deskripsi, kualitas bagus banget! Pengiriman cepat dan packing rapi. Highly recommended!",
    date: "2025-01-15",
  },
  {
    id: "2",
    userName: "Siti Nurhaliza",
    avatar: "https://i.pravatar.cc/150?img=45",
    rating: 4,
    comment: "Barang bagus, tapi pengiriman agak lama. Overall puas dengan produknya. Worth it dengan harganya.",
    date: "2025-01-10",
  },
  {
    id: "3",
    userName: "Budi Santoso",
    avatar: "https://i.pravatar.cc/150?img=33",
    rating: 5,
    comment: "Mantap! Seller responsif, barang original sesuai foto. Pasti beli lagi disini. Terima kasih!",
    date: "2025-01-08",
  },
  {
    id: "4",
    userName: "Dewi Lestari",
    avatar: "https://i.pravatar.cc/150?img=27",
    rating: 5,
    comment: "Bagus banget! Kualitas premium dengan harga terjangkau. Pelayanan seller juga ramah dan fast respon.",
    date: "2025-01-05",
  },
  {
    id: "5",
    userName: "Eko Prasetyo",
    avatar: "https://i.pravatar.cc/150?img=68",
    rating: 4,
    comment: "Produk sesuai ekspektasi. Pengalaman belanja yang menyenangkan. Akan rekomendasikan ke teman-teman.",
    date: "2024-12-28",
  },
];
interface ProductReviewsProps {
  productId: string;
}
export default function ProductReviews({ productId }: ProductReviewsProps) {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    rating: 0,
    comment: "",
  });
  
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Handle rating click
  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Validation
    if (!formData.name || !formData.email || !formData.phone || formData.rating === 0 || !formData.comment) {
      alert("Mohon lengkapi semua field!");
      setIsSubmitting(false);
      return;
    }
    // Dummy implementation: Console log + Success alert
    console.log("Review submitted for product:", productId);
    console.log("Form data:", formData);
    // Simulate API call
    setTimeout(() => {
      alert("✅ Ulasan berhasil dikirim! Terima kasih atas feedback Anda.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        rating: 0,
        comment: "",
      });
      
      setIsSubmitting(false);
    }, 1000);
  };
  // Render star rating (filled or empty)
  const renderStars = (rating: number, size: string = "w-4 h-4") => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => {
          const starValue = index + 1;
          return (
            <Star
              key={index}
              className={`${size} ${
                starValue <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          );
        })}
      </div>
    );
  };
  // Render interactive rating stars for form
  const renderInteractiveStars = () => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const starValue = index + 1;
          const isActive = starValue <= (hoverRating || formData.rating);
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleRatingClick(starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  isActive
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          );
        })}
      </div>
    );
  };
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div className="space-y-8">
      {/* Reviews List Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Ulasan Produk ({dummyReviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {dummyReviews.map((review) => (
            <div
              key={review.id}
              className="pb-6 border-b border-gray-200 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <Avatar className="w-12 h-12">
                  <AvatarImage src={review.avatar} alt={review.userName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {review.userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* Review Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">
                      {review.userName}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.date)}
                    </span>
                  </div>
                  {/* Rating Stars */}
                  {renderStars(review.rating)}
                  {/* Comment */}
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      {/* Review Form Section (SRS-06) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Berikan Ulasan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nama Lengkap <span className="text-primary">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Masukkan nama Anda"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email <span className="text-primary">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* No HP */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Nomor HP <span className="text-primary">*</span>
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="08123456789"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            {/* Rating Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Rating <span className="text-primary">*</span>
              </label>
              <div className="flex items-center gap-3">
                {renderInteractiveStars()}
                <span className="text-sm text-gray-600">
                  {formData.rating > 0
                    ? `${formData.rating} / 5`
                    : "Pilih rating"}
                </span>
              </div>
            </div>
            {/* Comment Textarea */}
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium text-gray-700">
                Ulasan Anda <span className="text-primary">*</span>
              </label>
              <Textarea
                id="comment"
                name="comment"
                placeholder="Tulis pengalaman Anda dengan produk ini..."
                value={formData.comment}
                onChange={handleInputChange}
                rows={5}
                required
                className="resize-none"
              />
            </div>
            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
