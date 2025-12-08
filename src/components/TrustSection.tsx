import { UserCheck, MessageCircle, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: UserCheck,
    title: "Penjual Terverifikasi",
    description: "Setiap penjual melalui proses verifikasi ketat oleh admin kami untuk keamanan Anda.",
  },
  {
    icon: MessageCircle,
    title: "Nego Langsung",
    description: "Hubungi penjual via WhatsApp dan tawar harga terbaik tanpa biaya perantara.",
  },
  {
    icon: Star,
    title: "Ulasan Transparan",
    description: "Lihat rating dan ulasan asli dari komunitas mahasiswa sebelum memutuskan membeli.",
  },
];

export default function TrustSection() {
  return (
    <section className="px-4 md:px-6 lg:px-8 py-12 md:py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Mengapa Pilih Kami?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Marketplace PPL menyediakan wadah aman untuk transaksi jual beli di lingkungan kampus.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={index}
                className="border-gray-100 bg-gray-50/50 hover:bg-white hover:border-primary/20 hover:shadow-md transition-all duration-300 group"
              >
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-white border border-gray-200 rounded-full mb-4 shadow-sm group-hover:scale-110 group-hover:border-primary/20 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
