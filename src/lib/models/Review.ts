export interface ReviewDB {
  id: string;
  product_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  rating: number; // 1-5
  comment: string;
  created_at: string; // ISO timestamp
}
/**
 * Interface untuk Frontend Display (ProductReviews component)
 */
export interface GuestReview {
  id: string;
  productId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  rating: number;
  comment: string;
  createdAt: string;
}
/**
 * Interface untuk Create Review Form Data
 */
export interface CreateReviewData {
  productId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  rating: number;
  comment: string;
}
/**
 * Validation helper: Check if rating is valid (1-5)
 */
export function isValidRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}
/**
 * Validation helper: Check if email format is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
/**
 * Validation helper: Check if phone format is valid (Indonesia)
 */
export function isValidPhone(phone: string): boolean {
  // Format: 08xxxxxxxxxx (min 10 digit, max 15 digit)
  const phoneRegex = /^08\d{8,13}$/;
  return phoneRegex.test(phone);
}
/**
 * Map ReviewDB (from Supabase) to GuestReview (for Frontend)
 */
export function mapReviewDBToGuestReview(data: ReviewDB): GuestReview {
  return {
    id: data.id,
    productId: data.product_id,
    guestName: data.guest_name,
    guestEmail: data.guest_email,
    guestPhone: data.guest_phone,
    rating: data.rating,
    comment: data.comment,
    createdAt: data.created_at,
  };
}
