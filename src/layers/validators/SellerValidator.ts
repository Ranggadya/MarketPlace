import { z } from "zod";

export const SellerValidator = z.object({
  storeName: z.string().min(1),
  storeDescription: z.string().optional(),

  picName: z.string().min(1),
  picPhone: z.string().min(1),
  picEmail: z.string().email(),

  picStreet: z.string().min(1),
  picRT: z.string().min(1),
  picRW: z.string().min(1),
  picVillage: z.string().min(1),
  picCity: z.string().min(1),
  picProvince: z.string().min(1),

  picKtpNumber: z.string().min(1),

  picPhotoPath: z.string().optional(),
  picKtpFilePath: z.string().optional(),

  password: z.string().min(6)
});

export type SellerInput = z.infer<typeof SellerValidator>;
