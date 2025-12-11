"use client";
import { useState, useEffect } from "react";
import { Star, AlertCircle, CheckCircle } from "lucide-react";
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
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  const [checkingEmail, setCheckingEmail] = useState<boolean>(false);

  useEffect(() => {

    const savedEmail = localStorage.getItem("guest_review_email");
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      checkIfEmailReviewed(savedEmail);
    }
  }, [reviews, productId]);

  const checkIfEmailReviewed = (email: string) => {
    if (!email.trim()) {
      setHasReviewed(false);
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    const alreadyReviewed = reviews.some(
      review => review.guestEmail.toLowerCase() === normalizedEmail
    );
    
    setHasReviewed(alreadyReviewed);
    
    if (alreadyReviewed) {
      setSubmitMessage({
        type: "error",
        text: "Email ini sudah pernah memberikan ulasan untuk produk ini. Setiap email hanya dapat memberikan 1 ulasan per produk."
      });
    }
  };

  const handleEmailBlur = () => {
    if (formData.email.trim()) {
      setCheckingEmail(true);
      setTimeout(() => {
        checkIfEmailReviewed(formData.email);
        setCheckingEmail(false);
      }, 300);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (submitMessage?.type === "error" && name === "email") {
      setSubmitMessage(null);
      setHasReviewed(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    if (!hasReviewed) {
      setFormData((prev) => ({ ...prev, rating }));
    }
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    if (!formData.name || !formData.email || !formData.phone || formData.rating === 0 || !formData.comment) {
      setSubmitMessage({ type: "error", text: "Mohon lengkapi semua field!" });
      setIsSubmitting(false);
      return;
    }
 
    if (hasReviewed) {
      setSubmitMessage({ 
        type: "error", 
        text: "Email ini sudah pernah memberikan ulasan untuk produk ini." 
      });
      setIsSubmitting(false);
      return;
    }
    try {

      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("email", formData.email);
      formDataObj.append("phone", formData.phone);
      formDataObj.append("rating", formData.rating.toString());
      formDataObj.append("comment", formData.comment);

      const result = await submitReviewAction(productId, formDataObj);
      if (result.success) {
        setSubmitMessage({ type: "success", text: result.message });
        
        localStorage.setItem("guest_review_email", formData.email);
        
        setFormData({
          name: "",
          email: formData.email, 
          phone: "",
          rating: 0,
          comment: "",
        });
        
        setHasReviewed(true);
        
        setTimeout(() => {
          setSubmitMessage(null);
        }, 5000);

        setTimeout(() => {
          const reviewsSection = document.getElementById("reviews-list");
          if (reviewsSection) {
            reviewsSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 1000);
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
              onMouseEnter={() => !hasReviewed && setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              disabled={hasReviewed}
              className={`focus:outline-none transition-transform ${
                hasReviewed ? "cursor-not-allowed opacity-50" : "hover:scale-110 cursor-pointer"
              }`}
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

      <Card id="reviews-list">
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
              
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {review.guestName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">
                        {review.guestName}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  
                    {renderStars(review.rating)}
                  
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
     
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Berikan Ulasan
          </CardTitle>
        </CardHeader>
        <CardContent>
     
          {hasReviewed && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900">
                  Anda sudah memberikan ulasan untuk produk ini
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Setiap email hanya dapat memberikan 1 ulasan per produk. 
                  Terima kasih atas feedback Anda!
                </p>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
           
            {submitMessage && (
              <div
                className={`p-4 rounded-lg flex items-start gap-3 ${
                  submitMessage.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {submitMessage.type === "success" ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm flex-1">{submitMessage.text}</p>
              </div>
            )}
        
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
                  disabled={isSubmitting || hasReviewed}
                  className={hasReviewed ? "bg-gray-50 cursor-not-allowed" : ""}
                />
              </div>
           
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleEmailBlur}
                    required
                    disabled={isSubmitting || hasReviewed}
                    className={hasReviewed ? "bg-gray-50 cursor-not-allowed" : ""}
                  />
                  {checkingEmail && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                {hasReviewed && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Email ini sudah pernah review produk ini
                  </p>
                )}
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
                  disabled={isSubmitting || hasReviewed}
                  className={hasReviewed ? "bg-gray-50 cursor-not-allowed" : ""}
                />
              </div>
            </div>
          
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
       
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium text-gray-700">
                Ulasan Anda <span className="text-primary">*</span>
              </label>
              <Textarea
                id="comment"
                name="comment"
                placeholder="Tulis pengalaman Anda dengan produk ini... (minimal 10 karakter)"
                value={formData.comment}
                onChange={handleInputChange}
                rows={5}
                required
                disabled={isSubmitting || hasReviewed}
                className={`resize-none ${hasReviewed ? "bg-gray-50 cursor-not-allowed" : ""}`}
              />
              <p className="text-xs text-gray-500">
                {formData.comment.length}/10 karakter minimum
              </p>
            </div>
  
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting || hasReviewed || formData.comment.length < 10}
              className="w-full md:w-auto"
            >
              {hasReviewed 
                ? "✓ Sudah Memberikan Ulasan" 
                : isSubmitting 
                ? "Mengirim Ulasan..." 
                : "Kirim Ulasan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
