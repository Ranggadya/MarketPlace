import { SellerValidator, SellerInput } from "@validators/SellerValidator";
import SellerRepository from "@repositories/SellerRepository";
import { Seller } from "@lib/models/Seller";

const repo = new SellerRepository();

const SellerService = {
  async register(payload: SellerInput) {
    const parsed = SellerValidator.safeParse(payload);

    if (!parsed.success) {
      throw new Error(parsed.error.issues.map(i => i.message).join(", "));
    }

    const seller = new Seller(parsed.data);

    if (!seller.validate()) {
      throw new Error("Validasi entity gagal.");
    }

    return repo.create(seller.toObject());
  },

  getAll() {
    return repo.findAll();
  },

  getById(id: string) {
    return repo.findById(id);
  }
};

export default SellerService;
