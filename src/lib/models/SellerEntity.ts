export type SellerStatus = "PENDING" | "ACTIVE" | "REJECTED";
export type SellerRecord = ReturnType<SellerEntity["toObject"]>;

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

  password: string;
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

  password!: string;

  status!: SellerStatus;
  created_at?: string;
  updated_at?: string;

  constructor(props: SellerProps) {
    Object.assign(this, props);

    this.status = "PENDING";

    const now = new Date().toISOString();
    this.created_at = now;
    this.updated_at = now;
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
      this.password,
    ];

    return required.every((i) => i && i.toString().trim().length > 0);
  }

  toObject() {
    return {
      store_name: this.storeName,
      store_description: this.storeDescription,

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
      pic_photo_path: this.picPhotoPath,
      pic_ktp_file_path: this.picKtpFilePath,

      status: this.status,
      password: this.password,

      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
