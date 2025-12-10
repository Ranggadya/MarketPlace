"use server";
import { revalidatePath } from "next/cache";
import { ProductService } from "@/layers/services/ProductService";
import { CreateReviewData } from "@/lib/models/Review";
/**
 * Server Action: Submit Guest Review
 * Called dari ProductReviews component via form action
 */
export async function submitReviewAction(
  productId: string,
  formData: FormData
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    // Extract form data
    const guestName = formData.get("name") as string;
    const guestEmail = formData.get("email") as string;
    const guestPhone = formData.get("phone") as string;
    const rating = parseInt(formData.get("rating") as string, 10);
    const comment = formData.get("comment") as string;
    // Validate required fields
    if (!guestName || !guestEmail || !guestPhone || !rating || !comment) {
      return {
        success: false,
        message: "Semua field wajib diisi!",
        error: "VALIDATION_ERROR",
      };
    }
    // Prepare review data
    const reviewData: CreateReviewData = {
      productId,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim().toLowerCase(),
      guestPhone: guestPhone.trim(),
      rating,
      comment: comment.trim(),
    };
    // Submit review via service
    const productService = new ProductService();
    await productService.submitReview(reviewData);
    // Revalidate product detail page untuk refresh data
    revalidatePath(`/product/${productId}`);
    return {
      success: true,
      message: "✅ Ulasan berhasil dikirim! Terima kasih atas feedback Anda.",
    };
  } catch (error: any) {
    console.error("submitReviewAction error:", error);
    
    return {
      success: false,
      message: error.message || "Gagal mengirim ulasan. Silakan coba lagi.",
      error: "SERVER_ERROR",
    };
  }
}
