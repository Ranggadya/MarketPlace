import { Truck, Shield, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
const benefits = [
  {
    icon: Truck,
    title: "Gratis Ongkir",
    description: "Pengiriman gratis untuk pembelian di atas Rp 50.000",
  },
  {
    icon: Shield,
    title: "Pembayaran Aman",
    description: "Transaksi terjamin aman dengan sistem escrow terpercaya",
  },
  {
    icon: Award,
    title: "Barang Original",
    description: "Produk 100% original dengan garansi uang kembali",
  },
];
export default function TrustSection() {
  return (
    <section className="px-4 md:px-6 lg:px-8 py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Mengapa Pilih Kami?
          </h2>
          <p className="text-gray-600">
            Belanja dengan nyaman dan aman di Marketplace PPL
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={index}
                className="border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200"
              >
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
