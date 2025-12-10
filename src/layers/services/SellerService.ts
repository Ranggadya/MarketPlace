import { SellerValidator, SellerInput } from "@/layers/validators/SellerValidator";
import { SellerRepository } from "@/layers/repositories/SellerRepository";
import { SellerEntity } from "@/lib/models/SellerEntity";
import { Password } from "@/lib/security/password";
import { Mailer } from "@/lib/mailer/resend";

export class SellerService {
  private repo = new SellerRepository();

  async register(payload: SellerInput) {
    const parsed = SellerValidator.safeParse(payload);
    if (!parsed.success) {
      const message = parsed.error.issues.map(i => i.message).join(", ");
      throw new Error(message);
    }

    const data = parsed.data;

    const exists = await this.repo.findByEmail(data.picEmail);
    if (exists) throw new Error("Email sudah digunakan.");

    const hashedPassword = await Password.hashPassword(data.password);

    const entity = new SellerEntity({
      ...data,
      passwordHash: hashedPassword,
    });

    if (!entity.validate()) {
      throw new Error("Validasi entity gagal.");
    }

    const saveRecord = await this.repo.create(entity);
    const { password, ...safeRecord } = saveRecord;
    return safeRecord;
  }

  async login(email: string, password: string) {
    const seller = await this.repo.findByEmail(email);
    if (!seller) throw new Error("Email tidak ditemukan.");

    const match = await Password.comparePassword(password, seller.password);
    if (!match) throw new Error("Password salah.");

    if (seller.status !== "ACTIVE") {
      throw new Error("Akun belum aktif. Silakan menunggu verifikasi admin.");
    }

    const { password: pwd, ...safeRecord } = seller;
    return safeRecord;
  }

  async verify(payload: { id: string; action: "ACCEPT" | "REJECT"; reason?: string }) {
    const seller = await this.repo.findById(payload.id);
    if (!seller) throw new Error("Seller tidak ditemukan.");

    if (payload.action === "ACCEPT") {
      const updated = await this.repo.updateStatus(payload.id, "ACTIVE");
      await Mailer.sendSellerApproved({
        to: seller.pic_email,
        name: seller.pic_name,
      });

      const { password, ...safe } = updated;
      return safe;
    }

    if (payload.action === "REJECT") {
      if (!payload.reason || payload.reason.trim() === "") {
        throw new Error("Alasan penolakan wajib diisi.");
      }

      const updated = await this.repo.updateStatus(
        payload.id,
        "REJECTED",
        payload.reason
      );

      await Mailer.sendSellerRejected({
        to: seller.pic_email,
        name: seller.pic_name,
        reason: payload.reason,
      });

      const { password, ...safe } = updated;
      return safe;
    }

    throw new Error("Aksi verifikasi tidak valid.");
  }

  async getAll() {
    return this.repo.findAll();
  }

  async getDetail(id: string) {
    const seller = await this.repo.findById(id);
    if (!seller) throw new Error("Seller tidak ditemukan.");

    const { password, ...safe } = seller;
    return safe;
  }
}
