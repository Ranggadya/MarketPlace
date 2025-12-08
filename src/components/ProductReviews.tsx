"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { submitReviewAction } from "@/layers/actions/review";
import { GuestReview } from "@/lib/models/Review";
interface ProductReviewsProps {
  productId: string;
  reviews: GuestReview[];
  reviewCount: number;
}
export default function ProductReviews({ productId, reviews, reviewCount }: ProductReviewsProps) {
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
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    // Client-side validation
    if (!formData.name || !formData.email || !formData.phone || formData.rating === 0 || !formData.comment) {
      setSubmitMessage({ type: "error", text: "Mohon lengkapi semua field!" });
      setIsSubmitting(false);
      return;
    }
    try {
      // Prepare FormData untuk server action
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("email", formData.email);
      formDataObj.append("phone", formData.phone);
      formDataObj.append("rating", formData.rating.toString());
      formDataObj.append("comment", formData.comment);
      // Call server action
      const result = await submitReviewAction(productId, formDataObj);
      if (result.success) {
        setSubmitMessage({ type: "success", text: result.message });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          rating: 0,
          comment: "",
        });
        // Auto-hide success message setelah 5 detik
        setTimeout(() => setSubmitMessage(null), 5000);
      } else {
        setSubmitMessage({ type: "error", text: result.message });
      }
    } catch (error: any) {
      console.error("Submit review error:", error);
      setSubmitMessage({ type: "error", text: "Terjadi kesalahan. Silakan coba lagi." });
    } finally {
      setIsSubmitting(false);
    }
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
  // Render interactive rating stars untuk form
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
            Ulasan Produk ({reviewCount})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">Belum ada ulasan untuk produk ini.</p>
              <p className="text-sm mt-2">Jadilah yang pertama memberikan ulasan!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="pb-6 border-b border-gray-200 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {review.guestName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Review Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">
                        {review.guestName}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
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
            ))
          )}
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
            {/* Submit Message */}
            {submitMessage && (
              <div
                className={`p-4 rounded-lg ${
                  submitMessage.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {submitMessage.text}
              </div>
            )}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
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
