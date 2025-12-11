import ProductRepository from "../repositories/ProductRepository";
import { ProductFilters } from "../repositories/ProductRepository";
import { ReviewRepository } from "@/layers/repositories/ReviewRepository";
import { Product, ProductDB, ProductDetail } from "@/lib/models/Product";
import { CreateReviewData, GuestReview, isValidRating, isValidEmail, isValidPhone } from "@/lib/models/Review";
import { supabase } from "@/lib/supabase";
// Placeholder image jika array images kosong
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";
export class ProductService {
  private repo: ProductRepository;
  private reviewRepository: ReviewRepository;
  constructor() {
    this.repo = new ProductRepository();
    this.reviewRepository = new ReviewRepository();
  }
  // ========== SELLER OPERATIONS (from main) ==========
  /**
   * Get all products by seller ID (for seller dashboard)
   */
  async getProductsBySeller(sellerId: string) {
    return await this.repo.getBySellerId(sellerId);
  }
  /**
   * Get product by ID (basic version)
   */
  async getProductById(id: string) {
    return await this.repo.findById(id);
  }
  /**
   * Create new product
   */
  async createProduct(sellerId: string, input: unknown) {
    const payload = {
      ...input,
      seller_id: sellerId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return await this.repo.create(payload);
  }
  /**
   * Update product
   */
  async updateProduct(id: string, input: unknown) {
    const payload = {
      ...input,
      updated_at: new Date().toISOString(),
    };
    return await this.repo.update(id, payload);
  }
  /**
   * Delete product
   */
  async deleteProduct(id: string) {
    return await this.repo.delete(id);
  }
  /**
   * Get all categories
   */
  async getCategories() {
    return await this.repo.getCategories();
  }
  /**
   * Get product statistics for seller dashboard
   */
  async getProductStats(sellerId: string) {
    return await this.repo.getProductStats(sellerId);
  }
  // ========== CATALOG & REVIEW OPERATIONS (from rajwaa) ==========
  /**
   * Get product catalog dengan optional filters
   * @param filters - Object dengan keyword, location, category
   * @returns Array of Product (Frontend-ready)
   */
  async getCatalog(filters: ProductFilters = {}): Promise<Product[]> {
    try {
      const rawData = await this.repo.findAll(filters);
      return rawData.map((item) => this.mapToProduct(item));
    } catch (error) {
      console.error("Error fetching product catalog:", error);
      throw error;
    }
  }
  /**
   * Get product detail by ID (enhanced version with reviews)
   * @param productId - UUID dari product
   * @returns ProductDetail dengan reviews
   */
  async getProductDetail(productId: string): Promise<{
    product: ProductDetail;
    reviews: GuestReview[];
    reviewCount: number;
    averageRating: number;
  } | null> {
    try {
      // Fetch product data dengan JOIN
      const rawData = await this.repo.findById(productId);
      
      if (!rawData) {
        return null; // Product not found
      }
      // Fetch reviews untuk product ini
      const reviews = await this.reviewRepository.getByProductId(productId);
      const reviewCount = await this.reviewRepository.getCountByProductId(productId);
      const averageRating = await this.reviewRepository.getAverageRating(productId);
      // ✅ FIXED: Format location as "City, Province"
      const locationParts = [
        rawData.sellers?.pic_city,
        rawData.sellers?.pic_province
      ].filter(Boolean);
      const formattedLocation = locationParts.length > 0 
        ? locationParts.join(", ") 
        : "Unknown";
      // Map ke ProductDetail interface
      const product: ProductDetail = {
        id: rawData.id,
        name: rawData.name,
        price: rawData.price,
        description: rawData.description || "Deskripsi tidak tersedia.",
        imageUrl: rawData.images?.[0] || PLACEHOLDER_IMAGE,
        images: rawData.images || [PLACEHOLDER_IMAGE],
        category: rawData.categories?.name || "Uncategorized",
        rating: averageRating > 0 ? averageRating : rawData.rating,
        sold: rawData.sold_count || 0,
        location: formattedLocation, 
        storeName: rawData.sellers?.store_name || "Unknown Store",
        sellerId: rawData.seller_id,
        categoryId: rawData.category_id,
        storeCity: rawData.sellers?.pic_city || "Unknown",
        sellerPhone: rawData.sellers?.pic_phone || null,
      };
      return {
        product,
        reviews,
        reviewCount,
        averageRating,
      };
    } catch (error) {
      console.error("Error fetching product detail:", error);
      throw error;
    }
  }
  /**
   * Submit guest review dengan validasi duplikasi email per produk
   * ✅ UPDATED: Added duplicate email validation (1 email = 1 review per product)
   * 
   * Defense in Depth Strategy:
   * - Layer 1: Application-level check (user-friendly error)
   * - Layer 2: Database unique constraint (guarantees consistency)
   * 
   * @param reviewData - Data dari form review
   * @returns Created review object dengan metadata
   * @throws Error jika validation gagal atau database error
   */
  async submitReview(reviewData: CreateReviewData): Promise<GuestReview> {
    try {
      // ============================================================
      // STEP 1: Server-side validation (CRITICAL - don't skip!)
      // ============================================================
      if (!reviewData.guestName || reviewData.guestName.trim().length < 2) {
        throw new Error("Nama harus diisi minimal 2 karakter.");
      }
      if (!isValidEmail(reviewData.guestEmail)) {
        throw new Error("Format email tidak valid.");
      }
      if (!isValidPhone(reviewData.guestPhone)) {
        throw new Error("Nomor HP harus format Indonesia (08xxxxxxxxxx).");
      }
      if (!isValidRating(reviewData.rating)) {
        throw new Error("Rating harus antara 1-5.");
      }
      if (!reviewData.comment || reviewData.comment.trim().length < 10) {
        throw new Error("Ulasan harus diisi minimal 10 karakter.");
      }
      // Validate product ID format (prevent SQL injection attempts)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(reviewData.productId)) {
        throw new Error("Invalid product ID format.");
      }
      // ============================================================
      // ✅ STEP 1.5: NEW - Check if email already reviewed this product
      // Defense Layer 1: Application-level check (user-friendly error)
      // ============================================================
      console.log(`🔍 Checking if email ${reviewData.guestEmail} already reviewed product ${reviewData.productId}`);
      
      const alreadyReviewed = await this.reviewRepository.checkExistingReview(
        reviewData.productId,
        reviewData.guestEmail.trim()
      );
      if (alreadyReviewed) {
        console.warn(`❌ Duplicate review attempt blocked: ${reviewData.guestEmail} for product ${reviewData.productId}`);
        throw new Error(
          "Anda sudah pernah memberikan ulasan untuk produk ini. " +
          "Setiap email hanya dapat memberikan 1 ulasan per produk."
        );
      }
      console.log(`✅ Email check passed, proceeding to insert review`);
      // ============================================================
      // STEP 2: Try RPC function first (if exists), fallback to direct insert
      // ============================================================
      
      // Attempt RPC function call (atomic rating sync)
      const { data: rpcData, error: rpcError } = await supabase.rpc('submit_review_with_rating_sync', {
        p_product_id: reviewData.productId,
        p_guest_name: reviewData.guestName.trim(),
        p_guest_email: reviewData.guestEmail.trim().toLowerCase(),
        p_guest_phone: reviewData.guestPhone.trim(),
        p_rating: reviewData.rating,
        p_comment: reviewData.comment.trim()
      });
      // ============================================================
      // STEP 3: Handle RPC success or fallback to repository
      // ============================================================
      
      // RPC function does not exist (error code 42883)
      if (rpcError && rpcError.code === '42883') {
        console.warn("⚠️ RPC function 'submit_review_with_rating_sync' not found, using direct repository insert");
        
        // Fallback: Direct insert via repository
        // Repository.create() has its own duplicate check via DB constraint (Defense Layer 2)
        const createdReview = await this.reviewRepository.create(reviewData);
        
        console.log(`✅ Review submitted via repository (fallback):`, {
          reviewId: createdReview.id,
          productId: createdReview.productId,
          guestEmail: createdReview.guestEmail,
          rating: createdReview.rating,
        });
        
        return createdReview;
      }
      // Other RPC errors
      if (rpcError) {
        console.error("❌ RPC submit_review_with_rating_sync error:", {
          code: rpcError.code,
          message: rpcError.message,
          details: rpcError.details,
          hint: rpcError.hint,
          productId: reviewData.productId
        });
        // User-friendly error messages
        if (rpcError.message.includes('not found')) {
          throw new Error("Produk tidak ditemukan. Mungkin sudah dihapus.");
        }
        throw new Error(`Gagal menyimpan ulasan: ${rpcError.message}`);
      }
      // RPC success but no data returned
      if (!rpcData || !rpcData.success) {
        throw new Error("Gagal membuat review: Tidak ada data dikembalikan dari server.");
      }
      // ============================================================
      // STEP 4: Log success dengan metadata (untuk monitoring)
      // ============================================================
      console.log(`✅ Review submitted atomically via RPC:`, {
        reviewId: rpcData.review_id,
        productId: rpcData.product_id,
        guestName: rpcData.guest_name,
        rating: rpcData.rating,
        newProductRating: rpcData.new_product_rating,
        totalReviews: rpcData.total_reviews,
        timestamp: rpcData.created_at
      });
      // ============================================================
      // STEP 5: Map RPC response ke GuestReview interface
      // ============================================================
      const createdReview: GuestReview = {
        id: rpcData.review_id,
        productId: rpcData.product_id,
        guestName: rpcData.guest_name,
        guestEmail: rpcData.guest_email,
        guestPhone: rpcData.guest_phone,
        rating: rpcData.rating,
        comment: rpcData.comment,
        createdAt: rpcData.created_at,
      };
      return createdReview;
    } catch (error) {
      console.error("❌ Error in submitReview:", error);
      
      // Re-throw dengan context untuk debugging
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error("Terjadi kesalahan saat mengirim ulasan. Silakan coba lagi.");
    }
  }
  /**
   * Map raw DB data ke Frontend interface
   * ✅ FIXED: Location now shows "City, Province" format
   * @private
   */
  private mapToProduct(data: ProductDB): Product {
    // ✅ FIXED: Format location as "City, Province"
    const locationParts = [
      data.sellers?.pic_city,
      data.sellers?.pic_province
    ].filter(Boolean);
    const formattedLocation = locationParts.length > 0 
      ? locationParts.join(", ") 
      : "Unknown";
    return {
      id: data.id,
      name: data.name,
      price: data.price,
      description: data.description || "",
      rating: data.rating || 0,
      imageUrl: data.images?.[0] || PLACEHOLDER_IMAGE,
      images: data.images || [PLACEHOLDER_IMAGE],
      category: data.categories?.name || "Uncategorized",
      location: formattedLocation, // ✅ FIXED: "City, Province" format
      storeName: data.sellers?.store_name || "Unknown Seller",
      sold: data.sold_count || 0,
    };
  }
}
