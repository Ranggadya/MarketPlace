import { ProductRepository, ProductFilters } from "@/layers/repositories/ProductRepository";
import { ReviewRepository } from "@/layers/repositories/ReviewRepository";
import { Product, ProductDB, ProductDetail } from "@/lib/models/Product";
import { CreateReviewData, GuestReview, isValidRating, isValidEmail, isValidPhone } from "@/lib/models/Review";
// Placeholder image jika array images kosong
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";
export class ProductService {
  private productRepository: ProductRepository;
  private reviewRepository: ReviewRepository;
  constructor() {
    this.productRepository = new ProductRepository();
    this.reviewRepository = new ReviewRepository();
  }
  /**
   * Get product catalog dengan optional filters (EXISTING METHOD)
   * @param filters - Object dengan keyword, location, category
   * @returns Array of Product (Frontend-ready)
   */
  async getCatalog(filters: ProductFilters = {}): Promise<Product[]> {
    try {
      const rawData = await this.productRepository.findAll(filters);
      return rawData.map((item) => this.mapToProduct(item));
    } catch (error) {
      console.error("Error fetching product catalog:", error);
      throw error;
    }
  }
  /**
   * Get product detail by ID (NEW METHOD)
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
      const rawData = await this.productRepository.findById(productId);
      
      if (!rawData) {
        return null; // Product not found
      }
      // Fetch reviews untuk product ini
      const reviews = await this.reviewRepository.getByProductId(productId);
      const reviewCount = await this.reviewRepository.getCountByProductId(productId);
      const averageRating = await this.reviewRepository.getAverageRating(productId);
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
        location: rawData.sellers?.pic_city || "Unknown",
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
   * Submit guest review (NEW METHOD)
   * @param reviewData - Data dari form review
   * @returns Created review object
   */
  async submitReview(reviewData: CreateReviewData): Promise<GuestReview> {
    try {
      // Validasi input
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
      // Insert ke database
      const createdReview = await this.reviewRepository.create(reviewData);
      return createdReview;
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error;
    }
  }
  /**
   * Map raw DB data ke Frontend interface (EXISTING)
   * @private
   */
  private mapToProduct(data: ProductDB): Product {
    return {
      id: data.id,
      name: data.name,
      price: data.price,
      description: data.description || "",
      rating: data.rating || 0,
      imageUrl: data.images?.[0] || PLACEHOLDER_IMAGE,
      images: data.images || [PLACEHOLDER_IMAGE],
      category: data.categories?.name || "Uncategorized",
      location: data.sellers?.pic_city || "Unknown",
      storeName: data.sellers?.store_name || "Unknown Seller",
      sold: data.sold_count || 0,
    };
  }
}
