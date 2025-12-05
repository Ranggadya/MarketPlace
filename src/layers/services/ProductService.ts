import { ProductRepository, ProductFilters } from "@/layers/repositories/ProductRepository";
import { Product, ProductDB } from "@/lib/models/Product";

// Placeholder image jika array images kosong
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";
export class ProductService {
  private repository: ProductRepository;
  constructor() {
    this.repository = new ProductRepository();
  }

  /**
   * Get product catalog dengan optional filters
   * @param filters - Object dengan keyword, location, category
   * @returns Array of Product (Frontend-ready)
   */

  async getCatalog(filters: ProductFilters = {}): Promise<Product[]> {
    try {
      const rawData = await this.repository.findAll(filters);
      
      return rawData.map((item) => this.mapToProduct(item));
    } catch (error) {
      console.error("Error fetching product catalog:", error);
      throw error; // Re-throw untuk error handling di page level
    }
  }

  /**
   * Map raw DB data ke Frontend interface
   * @private
   */
  private mapToProduct(data: ProductDB): Product {
    return {
      id: data.id,
      name: data.name,
      price: data.price,
      rating: data.rating || 0,
      imageUrl: data.images?.[0] || PLACEHOLDER_IMAGE,
      category: data.categories?.name || "Uncategorized",
      location: data.sellers?.pic_city || "Unknown",
      sellerName: data.sellers?.store_name || "Unknown Seller",
      sold: 0, // Default 0 (bisa diupdate jika ada kolom sold di DB nanti)
    };
  }
}
