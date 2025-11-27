import { z } from "zod";

export const SellerValidator = z.object({
  // 🏪 Informasi Toko
  storeName: z.string().min(1, "Nama toko wajib diisi"),
  storeDescription: z.string().optional(),

  // 👤 PIC
  picName: z.string().min(1, "Nama PIC wajib diisi"),
  picPhone: z
    .string()
    .min(10, "Nomor HP tidak valid")
    .regex(/^[0-9+]+$/, "Nomor HP hanya boleh angka"),
  picEmail: z.string().email("Email tidak valid"),

  // 📍 Alamat PIC
  picStreet: z.string().min(1, "Nama jalan wajib diisi"),
  picRT: z.string().min(1, "RT wajib diisi"),
  picRW: z.string().min(1, "RW wajib diisi"),
  picVillage: z.string().min(1, "Kelurahan wajib diisi"),
  picCity: z.string().min(1, "Kota wajib diisi"),
  picProvince: z.string().min(1, "Provinsi wajib diisi"),

  // 🆔 KTP
  picKtpNumber: z
    .string()
    .min(10, "Nomor KTP terlalu pendek")
    .regex(/^[0-9]+$/, "Nomor KTP harus berupa angka"),

  // 📸 Upload File (file bukan string!)
  picPhotoPath: z.any().optional(),      // File foto penjual
  picKtpFilePath: z.any().optional(),    // File KTP

  // 🔐 Password Akun
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type SellerInput = z.infer<typeof SellerValidator>;
