"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import SellerApprovalCard from "@/components/admin/SellerApprovalCard";
import { Loader2, UserCheck, Clock } from "lucide-react";
interface PendingSeller {
  id: string;
  store_name: string;
  store_description: string | null;
  pic_name: string;
  pic_email: string;
  pic_phone: string;
  pic_street: string;
  pic_rt: string;
  pic_rw: string;
  pic_village: string;
  pic_city: string;
  pic_province: string;
  pic_ktp_number: string;
  pic_photo_url: string | null;
  pic_ktp_url: string | null;
  status: string;
  created_at: string;
}
export default function PendingSellersPage() {
  const [sellers, setSellers] = useState<PendingSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  async function fetchPendingSellers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("sellers")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching pending sellers:", error);
    } else {
      setSellers(data || []);
    }
    setLoading(false);
  }
  useEffect(() => {
    fetchPendingSellers();
  }, []);
  const handleApproved = () => {
    fetchPendingSellers();
  };
  const handleRejected = () => {
    fetchPendingSellers();
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-800">Pending Sellers</h1>
        </div>
        <p className="text-gray-600">
          Verifikasi dan setujui pendaftar penjual baru
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-orange-700">{sellers.length}</p>
            </div>
            <Clock className="w-10 h-10 text-orange-400" />
          </div>
        </div>
      </div>
      {sellers.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Tidak ada pending seller</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sellers.map((seller) => (
            <SellerApprovalCard
              key={seller.id}
              seller={seller}
              onApproved={handleApproved}
              onRejected={handleRejected}
            />
          ))}
        </div>
      )}
    </div>
  );
}
