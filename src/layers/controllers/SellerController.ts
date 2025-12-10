import { SellerInput } from "@validators/SellerValidator";
import SellerService from "@services/SellerService";

export default class SellerController {
  async store(data: SellerInput) {
    return SellerService.register(data);
  }

  async list() {
    return SellerService.getAll();
  }

  async show(id: string) {
    return SellerService.getById(id);
  }
}
