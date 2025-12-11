import { cookies } from "next/headers";
import { OrderService } from "@/layers/services/OrderService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getSellerIdFromSession(): Promise<string> {
  const cookieStore = await cookies(); // <- wajib di-await

  const sellerId = cookieStore.get("seller_id")?.value;

  if (!sellerId) {
    throw new Error("Seller ID tidak ditemukan dalam session.");
  }

  return sellerId;
}

export default async function SellerOrdersSummaryPage() {
  const sellerId = await getSellerIdFromSession();

  const orderService = new OrderService();
  const summary = await orderService.getSummaryBySeller(sellerId);

  return (
    <main className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Jumlah Pesanan</h1>
        <p className="text-gray-500">
          Rekap pesanan yang berhasil terjual pada toko Anda.
        </p>
      </div>

      {/* Kartu ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Pesanan Berhasil"
          value={summary.total}
          highlight
        />
        <StatsCard label="Terjual Hari Ini" value={summary.today} />
      </div>
    </main>
  );
}

function StatsCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-primary shadow" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  );
}
