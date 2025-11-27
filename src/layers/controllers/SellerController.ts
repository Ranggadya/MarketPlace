import { SellerService } from "@/layers/services/SellerService";
import type { SellerInput } from "@/layers/validators/SellerValidator";

export class SellerController {
  private service = new SellerService();

  register(body: SellerInput) {
    return this.service.register(body);
  }

  login(email: string, password: string) {
    return this.service.login(email, password);
  }
}
