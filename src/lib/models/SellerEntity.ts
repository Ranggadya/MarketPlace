export type SellerStatus = "PENDING" | "ACTIVE" | "REJECTED";
export type SellerRecord = ReturnType<SellerEntity["toObject"]>;

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

  constructor(props: {
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
  }) {
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

    return required.every((i) => !!i && i.trim().length > 0);
  }

  toObject() {
    return {
      storeName: this.storeName,
      storeDescription: this.storeDescription,
      picName: this.picName,
      picPhone: this.picPhone,
      picEmail: this.picEmail,

      picStreet: this.picStreet,
      picRT: this.picRT,
      picRW: this.picRW,
      picVillage: this.picVillage,
      picCity: this.picCity,
      picProvince: this.picProvince,

      picKtpNumber: this.picKtpNumber,
      picPhotoPath: this.picPhotoPath,
      picKtpFilePath: this.picKtpFilePath,

      status: this.status,
      password: this.password,

      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
