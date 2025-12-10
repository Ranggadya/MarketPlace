"use client";

import { useEffect, useState } from "react";
import { Loader2, User, CheckCircle, XCircle, Clock } from "lucide-react";

interface Seller {
  store_name: string;
  status: string;
  created_at: string;
  is_verified: boolean;
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetch("/api/admin/reports?type=SELLERS_STATUS");
        const data = await res.json();
        if (Array.isArray(data)) {
          setSellers(data);
        }
      } catch (error) {
        console.error("Failed to fetch sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  // Group sellers by status
  const groupedSellers = sellers.reduce((acc, seller) => {
    const status = seller.status?.toUpperCase() || "UNKNOWN";
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(seller);
    return acc;
  }, {} as Record<string, Seller[]>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
      case "ACTIVE":
        return "bg-green-50 border-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-50 border-yellow-100 text-yellow-700";
      case "REJECTED":
      case "INACTIVE":
        return "bg-red-50 border-red-100 text-red-700";
      default:
        return "bg-gray-50 border-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
      case "ACTIVE":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "REJECTED":
      case "INACTIVE":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Detail Penjual per Status
        </h1>
        <p className="text-gray-500">
          Daftar akun penjual dikelompokkan berdasarkan status akun.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedSellers).map(([status, items]) => (
          <div
            key={status}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
          >
            <div
              className={`px-6 py-4 border-b flex items-center gap-3 ${getStatusColor(
                status
              )}`}
            >
              <div className="p-2 bg-white rounded-full shadow-sm">
                {getStatusIcon(status)}
              </div>
              <div>
                <h2 className="font-bold">{status}</h2>
                <p className="text-xs opacity-80">{items.length} Akun</p>
              </div>
            </div>

            <div className="p-4 max-h-[400px] overflow-y-auto">
              <ul className="space-y-3">
                {items.map((seller, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                        {seller.store_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {seller.store_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(seller.created_at).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {Object.keys(groupedSellers).length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed">
            <p className="text-gray-500">Tidak ada data penjual tersedia.</p>
          </div>
        )}
      </div>
    </div>
  );
}
