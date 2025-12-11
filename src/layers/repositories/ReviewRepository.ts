import { supabase } from "@/lib/supabase";
import { ReviewDB, CreateReviewData, mapReviewDBToGuestReview, GuestReview } from "@/lib/models/Review";
export class ReviewRepository {
  /**
   * ✅ NEW: Check apakah email sudah pernah review produk ini
   * Digunakan untuk validasi sebelum insert (defense in depth)
   * 
   * @param productId - UUID dari product
   * @param guestEmail - Email guest (case-insensitive)
   * @returns true jika sudah pernah review, false jika belum
   */
  async checkExistingReview(productId: string, guestEmail: string): Promise<boolean> {
    try {
      const normalizedEmail = guestEmail.trim().toLowerCase();
      
      const { data, error } = await supabase
        .from("guest_reviews")
        .select("id")
        .eq("product_id", productId)
        .ilike("guest_email", normalizedEmail) // Case-insensitive match
        .limit(1);
      if (error) {
        console.error("Error checking existing review:", error);
        // Jika error, asumsikan belum ada (fail-safe ke constraint)
        return false;
      }
      return data && data.length > 0;
    } catch (error) {
      console.error("ReviewRepository.checkExistingReview error:", error);
      // Jika error, asumsikan belum ada (fail-safe ke constraint)
      return false;
    }
  }
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
   * ✅ UPDATED: Enhanced error handling + auto-update product rating
   * 
   * @param reviewData - Data review dari form
   * @returns Created review object
   * @throws Error jika duplikasi terdeteksi atau database error
   */
  async create(reviewData: CreateReviewData): Promise<GuestReview> {
    try {
      // Prepare data untuk insert (convert camelCase ke snake_case)
      const insertData = {
        product_id: reviewData.productId,
        guest_name: reviewData.guestName.trim(),
        guest_email: reviewData.guestEmail.trim().toLowerCase(), // Normalize email
        guest_phone: reviewData.guestPhone.trim(),
        rating: reviewData.rating,
        comment: reviewData.comment.trim(),
      };
      const { data, error } = await supabase
        .from("guest_reviews")
        .insert([insertData])
        .select()
        .single();
      if (error) {
        console.error("Error creating review:", error);
        
        // ✅ ENHANCED: Check if error is duplicate constraint violation
        // PostgreSQL error code 23505 = unique_violation
        if (error.code === "23505") {
          if (error.message.includes("guest_reviews_product_email_unique")) {
            throw new Error(
              "Anda sudah pernah memberikan ulasan untuk produk ini. " +
              "Setiap email hanya dapat memberikan 1 ulasan per produk."
            );
          }
          // Fallback untuk unique violation lainnya
          throw new Error("Data duplikat terdeteksi. Silakan cek kembali.");
        }
        
        // Error lainnya
        throw new Error(`Database error: ${error.message}`);
      }
      if (!data) {
        throw new Error("Gagal membuat review: Tidak ada data dikembalikan.");
      }
      // ✅ NEW: Update product rating after successful insert (Fallback for RPC)
      try {
        await this.updateProductRating(reviewData.productId);
        console.log(`✅ Product rating updated for product ${reviewData.productId}`);
      } catch (ratingError) {
        console.error("⚠️ Warning: Failed to update product rating:", ratingError);
        // Don't throw - review was created successfully, rating update is secondary
      }
      // Map response ke Frontend interface
      return mapReviewDBToGuestReview(data as ReviewDB);
    } catch (error) {
      console.error("ReviewRepository.create error:", error);
      // Re-throw error agar bisa di-handle di layer atas
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
   * 
   * ⚠️ DEPRECATED: This method fetches all ratings to app memory which is slow
   * and prone to race conditions. Use RPC function submit_review_with_rating_sync
   * for new code that needs to calculate/update ratings.
   * 
   * This method is still used by ProductService.getProductDetail() to display
   * current ratings. Future optimization: read rating directly from products table.
   * 
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
  /**
   * ✅ NEW: Recalculate and update product rating
   * Called as fallback when RPC function is not available
   * 
   * @param productId - UUID dari product
   */
  async updateProductRating(productId: string): Promise<void> {
    try {
      // Step 1: Get all ratings for this product
      const { data, error } = await supabase
        .from("guest_reviews")
        .select("rating")
        .eq("product_id", productId);
      if (error) {
        console.error("Error fetching ratings:", error);
        throw new Error(`Database error: ${error.message}`);
      }
      // Step 2: Calculate average rating (rounded to 1 decimal)
      let avgRating = 0;
      if (data && data.length > 0) {
        const total = data.reduce((sum, review) => sum + review.rating, 0);
        avgRating = parseFloat((total / data.length).toFixed(1));
      }
      // Step 3: Update products table
      const { error: updateError } = await supabase
        .from("products")
        .update({ rating: avgRating })
        .eq("id", productId);
      if (updateError) {
        console.error("Error updating product rating:", updateError);
        throw new Error(`Failed to update rating: ${updateError.message}`);
      }
      console.log(`✅ Product ${productId} rating updated to ${avgRating} (${data?.length || 0} reviews)`);
    } catch (error) {
      console.error("ReviewRepository.updateProductRating error:", error);
      throw error;
    }
  }
}
