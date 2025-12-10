
export type SellerStatus = "PENDING" | "ACTIVE" | "REJECTED";

export type SellerProps = {
  storeName: string;
  storeDescription?: string;

  picName: string;
  picPhone: string;
  picEmail: string;

  picStreet: string;
  picRT: string;
  picRW: string;
  picVillage: string;
  picCity: string;
  picProvince: string;

  picKtpNumber: string;
  picPhotoPath?: string;
  picKtpFilePath?: string;

  passwordHash: string;
};

export type SellerRecord = {
  id: string;

  store_name: string;
  store_description: string | null;

  pic_name: string;
  pic_phone: string;
  pic_email: string;

  pic_street: string;
  pic_rt: string;
  pic_rw: string;
  pic_village: string;
  pic_city: string;
  pic_province: string;

  pic_ktp_number: string;
  pic_photo_path: string | null;
  pic_ktp_file_path: string | null;

  password: string;
  status: SellerStatus;

  created_at: string;
  updated_at: string;
};

export class SellerEntity {
  id?: string;

  storeName!: string;
  storeDescription?: string;

  picName!: string;
  picPhone!: string;
  picEmail!: string;

  picStreet!: string;
  picRT!: string;
  picRW!: string;
  picVillage!: string;
  picCity!: string;
  picProvince!: string;

  picKtpNumber!: string;
  picPhotoPath?: string;
  picKtpFilePath?: string;

  passwordHash!: string;

  status!: SellerStatus;

  created_at?: string;
  updated_at?: string;

  constructor(props: SellerProps) {
    Object.assign(this, props);
    this.status = "PENDING";
  }

  validate(): boolean {
    const required = [
      this.storeName,
      this.picName,
      this.picPhone,
      this.picEmail,
      this.picStreet,
      this.picRT,
      this.picRW,
      this.picVillage,
      this.picCity,
      this.picProvince,
      this.picKtpNumber,
      this.passwordHash,
    ];

    return required.every((r) => r && r.toString().trim().length > 0);
  }

  toObject() {
    return {
      store_name: this.storeName,
      store_description: this.storeDescription || null,

      pic_name: this.picName,
      pic_phone: this.picPhone,
      pic_email: this.picEmail,

      pic_street: this.picStreet,
      pic_rt: this.picRT,
      pic_rw: this.picRW,
      pic_village: this.picVillage,
      pic_city: this.picCity,
      pic_province: this.picProvince,

      pic_ktp_number: this.picKtpNumber,
      pic_photo_path: this.picPhotoPath || null,
      pic_ktp_file_path: this.picKtpFilePath || null,

      password: this.passwordHash,
      status: this.status,
    };
  }
}
