import { supabase } from "@/lib/supabase";
import { ReviewDB, CreateReviewData, mapReviewDBToGuestReview, GuestReview } from "@/lib/models/Review";
export class ReviewRepository {
  /**
   * Get all reviews untuk product tertentu (sorted by newest first)
   * @param productId - UUID dari product
   * @returns Array of GuestReview
   */
  async getByProductId(productId: string): Promise<GuestReview[]> {
    try {
      const { data, error } = await supabase
        .from("guest_reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching reviews:", error);
        throw new Error(`Database error: ${error.message}`);
      }
      // Map DB response ke Frontend interface
      return (data as ReviewDB[]).map(mapReviewDBToGuestReview);
    } catch (error) {
      console.error("ReviewRepository.getByProductId error:", error);
      throw error;
    }
  }
  /**
   * Create new guest review
   * @param reviewData - Data review dari form
   * @returns Created review object
   */
  async create(reviewData: CreateReviewData): Promise<GuestReview> {
    try {
      // Prepare data untuk insert (convert camelCase ke snake_case)
      const insertData = {
        product_id: reviewData.productId,
        guest_name: reviewData.guestName,
        guest_email: reviewData.guestEmail,
        guest_phone: reviewData.guestPhone,
        rating: reviewData.rating,
        comment: reviewData.comment,
      };
      const { data, error } = await supabase
        .from("guest_reviews")
        .insert([insertData])
        .select()
        .single();
      if (error) {
        console.error("Error creating review:", error);
        throw new Error(`Database error: ${error.message}`);
      }
      // Map response ke Frontend interface
      return mapReviewDBToGuestReview(data as ReviewDB);
    } catch (error) {
      console.error("ReviewRepository.create error:", error);
      throw error;
    }
  }
  /**
   * Get total review count untuk product tertentu
   * @param productId - UUID dari product
   * @returns Total count
   */
  async getCountByProductId(productId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("guest_reviews")
        .select("*", { count: "exact", head: true })
        .eq("product_id", productId);
      if (error) {
        console.error("Error counting reviews:", error);
        throw new Error(`Database error: ${error.message}`);
      }
      return count || 0;
    } catch (error) {
      console.error("ReviewRepository.getCountByProductId error:", error);
      return 0;
    }
  }
  /**
   * Get average rating untuk product tertentu
   * @param productId - UUID dari product
   * @returns Average rating (0-5)
   */
  async getAverageRating(productId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from("guest_reviews")
        .select("rating")
        .eq("product_id", productId);
      if (error) {
        console.error("Error calculating average rating:", error);
        return 0;
      }
      if (!data || data.length === 0) {
        return 0;
      }
      const total = data.reduce((sum, review) => sum + review.rating, 0);
      return parseFloat((total / data.length).toFixed(1));
    } catch (error) {
      console.error("ReviewRepository.getAverageRating error:", error);
      return 0;
    }
  }
}
