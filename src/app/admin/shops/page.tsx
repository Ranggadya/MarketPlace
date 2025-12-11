"use client";

import { useEffect, useState } from "react";
import { Loader2, MapPin, Store } from "lucide-react";

interface Shop {
  store_name: string;
  province: string;
  city: string;
}

const SMALL_WORDS = ["dan", "di", "ke", "dari", "yang", "atau"];
const UNKNOWN_PROVINCE_KEY = "__UNKNOWN_PROVINCE__";

function toTitleCase(value: string | undefined | null): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (index !== 0 && SMALL_WORDS.includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export default function AdminShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch("/api/admin/reports?type=SELLERS_LOCATION");
        const data = await res.json();
        if (Array.isArray(data)) {
          setShops(data);
        }
      } catch (error) {
        console.error("Failed to fetch shops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  // group berdasarkan province yang sudah dinormalisasi (lowercase + trim)
  const groupedShops = shops.reduce((acc, shop) => {
    const raw = shop.province?.trim();
    const key = raw ? raw.toLowerCase() : UNKNOWN_PROVINCE_KEY;

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(shop);
    return acc;
  }, {} as Record<string, Shop[]>);

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
          Detail Toko per Lokasi
        </h1>
        <p className="text-gray-500">
          Sebaran toko penjual berdasarkan provinsi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedShops).map(([provinceKey, items]) => {
          const displayProvince =
            provinceKey === UNKNOWN_PROVINCE_KEY
              ? "Lokasi Tidak Diketahui"
              : toTitleCase(provinceKey);

          return (
            <div
              key={provinceKey}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
            >
              <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-3">
                <div className="p-2 bg-white rounded-full text-red-600 shadow-sm">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">
                    {displayProvince}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {items.length} Toko Terdaftar
                  </p>
                </div>
              </div>

              <div className="p-4">
                <ul className="space-y-3">
                  {items.map((shop, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                    >
                      <Store className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {toTitleCase(shop.store_name)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {shop.city
                            ? toTitleCase(shop.city)
                            : "Kota Tidak Diketahui"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}

        {Object.keys(groupedShops).length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed">
            <p className="text-gray-500">Tidak ada data toko tersedia.</p>
          </div>
        )}
      </div>
    </div>
  );
}
