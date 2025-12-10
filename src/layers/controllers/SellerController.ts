import { SellerService } from "@/layers/services/SellerService";
import type { SellerInput } from "@/layers/validators/SellerValidator";

export class SellerController {
  private service = new SellerService();

  async register(body: SellerInput) {
    try {
      const seller = await this.service.register(body);
      return { success: true, data: seller };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
      return { success: false, message };
    }
  }

  async login(payload: { email: string; password: string }) {
    try {
      const seller = await this.service.login(payload.email, payload.password);
      return { success: true, data: seller };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
      return { success: false, message };
    }
  }

  async verify(payload: { id: string; action: "ACCEPT" | "REJECT"; reason?: string }) {
    try {
      const seller = await this.service.verify(payload);
      return { success: true, data: seller };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
      return { success: false, message };
    }
  }

  async list() {
    try {
      const sellers = await this.service.getAll();
      return { success: true, data: sellers };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
      return { success: false, message };
    }
  }

  async detail(id: string) {
    try {
      const seller = await this.service.getDetail(id);
      return { success: true, data: seller };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
      return { success: false, message };
    }
  }
}
