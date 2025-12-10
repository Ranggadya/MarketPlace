export interface SellerProps {
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
  picPhotoPath?: string;  // Maps to pic_photo_url in DB
  picKtpFilePath?: string; // Maps to pic_ktp_url in DB
  status: string;
  createdAt: string;
}
export type SellerCreateProps = Omit<SellerProps, "status" | "createdAt">;
export class Seller {
  private props: SellerProps;
  constructor(data: SellerCreateProps) {
    this.props = {
      ...data,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
  }
  validate(): boolean {
    return !!(
      this.props.storeName &&
      this.props.picName &&
      this.props.picPhone &&
      this.props.picEmail &&
      this.props.picStreet &&
      this.props.picRT &&
      this.props.picRW &&
      this.props.picVillage &&
      this.props.picCity &&
      this.props.picProvince &&
      this.props.picKtpNumber
    );
  }
  toObject() {
    return this.props;
  }
}
