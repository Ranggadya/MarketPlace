import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
const testimonials = [
  {
    name: "Andi Pratama",
    role: "Pembeli",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    text: "Produk yang saya beli sesuai deskripsi, pengiriman cepat, dan penjualnya ramah. Sangat puas!",
  },
  {
    name: "Siti Nurhaliza",
    role: "Penjual",
    avatar: "https://i.pravatar.cc/150?img=45",
    rating: 5,
    text: "Platform yang mudah digunakan untuk berjualan. Fitur lengkap dan support team responsif!",
  },
  {
    name: "Budi Santoso",
    role: "Pembeli",
    avatar: "https://i.pravatar.cc/150?img=33",
    rating: 5,
    text: "Harga kompetitif, banyak pilihan produk, dan proses transaksi sangat aman. Recommended!",
  },
];
export default function TestimonialSection() {
  return (
    <section className="px-4 md:px-6 lg:px-8 py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Apa Kata Mereka?
          </h2>
          <p className="text-gray-600">
            Testimoni dari pengguna Marketplace PPL
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="p-6">
                {/* Avatar & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                {/* Rating */}
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                {/* Testimonial Text */}
                <p className="text-sm text-gray-700 leading-relaxed">
                  "{testimonial.text}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
