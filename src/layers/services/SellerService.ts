import { SellerValidator, SellerInput } from "@/layers/validators/SellerValidator";
import { SellerRepository } from "@/layers/repositories/SellerRepository";
import { SellerEntity } from "@/lib/models/SellerEntity";
import { Password } from "@/lib/security/password";

export class SellerService {
  private repo = new SellerRepository();

  async register(payload: SellerInput) {
    const parsed = SellerValidator.safeParse(payload);

    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(", ");
      throw new Error(msg);
    }

    const data = parsed.data;

    const exists = await this.repo.findByEmail(data.picEmail);
    if (exists) {
      throw new Error("Email sudah digunakan.");
    }

    const hashedPassword = await Password.hash(data.password);

    const entity = new SellerEntity({
      ...data,
      password: hashedPassword,
    });

    if (!entity.validate()) throw new Error("Validasi entity gagal.");

    return this.repo.create(entity.toObject());
  }

  async login(email: string, password: string) {
    const seller = await this.repo.findByEmail(email);
    if (!seller) throw new Error("Email tidak ditemukan.");

    const match = await Password.compare(password, seller.password);
    if (!match) throw new Error("Password salah.");

    return seller;
  }
}
