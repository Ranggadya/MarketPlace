import ProductRepository from "../repositories/ProductRepository";

export default class ReportService {
  private repo: ProductRepository;

  constructor() {
    this.repo = new ProductRepository();
  }

  // Helper: Ambil semua produk dulu
  private async getAllProducts(sellerId: string) {
    return await this.repo.getBySellerId(sellerId);
  }

  // SRS-12: Data Stok (Urutkan stok terbanyak -> sedikit)
  async getStockReport(sellerId: string) {
    const products = await this.getAllProducts(sellerId);
    // Sort descending by stock
    return products.sort((a, b) => b.stock - a.stock);
  }

  // SRS-13: Data Rating (Urutkan rating tertinggi -> terendah)
  async getRatingReport(sellerId: string) {
    const products = await this.getAllProducts(sellerId);
    // Sort descending by rating
    return products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // SRS-14: Data Warning (Filter stok < 2, Urutkan Nama)
  async getWarningReport(sellerId: string) {
    const products = await this.getAllProducts(sellerId);
    
    // Filter stok < 2
    const criticalStock = products.filter((p) => p.stock < 2);
    
    // Sort ascending by name (A-Z) biar rapi
    return criticalStock.sort((a, b) => a.name.localeCompare(b.name));
  }
}