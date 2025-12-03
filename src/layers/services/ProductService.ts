import ProductRepository from "../repositories/ProductRepository";

export default class ProductService {
  private repo: ProductRepository;

  constructor() {
    this.repo = new ProductRepository();
  }

  async getProductsBySeller(sellerId: string) {
    return await this.repo.getBySellerId(sellerId);
  }

  async getProductById(id: string) {
    return await this.repo.findById(id);
  }

  async createProduct(sellerId: string, input: unknown) {
    const payload = {
      ...input,
      seller_id: sellerId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return await this.repo.create(payload);
  }

  async updateProduct(id: string, input: unknown) {
    const payload = {
      ...input,
      updated_at: new Date().toISOString(),
    };
    return await this.repo.update(id, payload);
  }

  async deleteProduct(id: string) {
    return await this.repo.delete(id);
  }

  async getCategories() {
    return await this.repo.getCategories();
  }

  async getProductStats(sellerId: string) {
    return await this.repo.getProductStats(sellerId);
  }
}