import { z } from "zod";

export const SellerValidator = z.object({
  storeName: z.string().min(1, "Nama toko wajib diisi"),
  storeDescription: z.string().optional(),

  picName: z.string().min(1, "Nama PIC wajib diisi"),
  picPhone: z.string().min(1, "Nomor HP wajib diisi"),
  picEmail: z.string().email("Email PIC tidak valid"),

  picStreet: z.string().min(1, "Jalan wajib diisi"),
  picRT: z.string().min(1, "RT wajib diisi"),
  picRW: z.string().min(1, "RW wajib diisi"),
  picVillage: z.string().min(1, "Kelurahan wajib diisi"),
  picCity: z.string().min(1, "Kota wajib diisi"),
  picProvince: z.string().min(1, "Provinsi wajib diisi"),

  picKtpNumber: z.string().min(1, "Nomor KTP wajib diisi"),

  picPhotoPath: z.string().optional(),
  picKtpFilePath: z.string().optional(),
});

export type SellerInput = z.infer<typeof SellerValidator>;
