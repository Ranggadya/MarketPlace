"use client";

import { useState } from "react";
import { FileText, Download, Loader2, MapPin, Users, Star } from "lucide-react";
import generateAdminReportPDF from "@/lib/admin-pdf-generator";
import Swal from "sweetalert2";

export default function AdminReportsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleDownload = async (
    type: "SELLERS_STATUS" | "SELLERS_LOCATION" | "PRODUCTS_RATING"
  ) => {
    try {
      setLoading(type);

      // Fetch data from our new API
      const response = await fetch(`/api/admin/reports?type=${type}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengambil data laporan");
      }

      if (!Array.isArray(data) || data.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Data Kosong",
          text: "Tidak ada data untuk laporan ini.",
        });
        setLoading(null);
        return;
      }

      // Generate PDF
      generateAdminReportPDF(type, data, "Administrator");

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Laporan berhasil diunduh!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Terjadi kesalahan saat mengunduh laporan.",
      });
    } finally {
      setLoading(null);
    }
  };

  const reports = [
    {
      id: "SELLERS_STATUS",
      title: "Laporan Status Penjual",
      description:
        "Daftar akun penjual aktif dan tidak aktif (terverifikasi/belum).",
      icon: <Users className="w-8 h-8 text-blue-500" />,
      color: "bg-blue-50 border-blue-200",
      btnColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      id: "SELLERS_LOCATION",
      title: "Laporan Lokasi Penjual",
      description: "Daftar penjual dikelompokkan berdasarkan lokasi provinsi.",
      icon: <MapPin className="w-8 h-8 text-green-500" />,
      color: "bg-green-50 border-green-200",
      btnColor: "bg-green-600 hover:bg-green-700",
    },
    {
      id: "PRODUCTS_RATING",
      title: "Laporan Rating Produk",
      description:
        "Daftar produk diurutkan berdasarkan rating tertinggi, lengkap dengan info toko.",
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      color: "bg-yellow-50 border-yellow-200",
      btnColor: "bg-yellow-600 hover:bg-yellow-700",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pusat Laporan</h1>
        <p className="text-gray-500">
          Unduh laporan statistik platform dalam format PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className={`p-6 rounded-xl border ${report.color} transition-all hover:shadow-md`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                {report.icon}
              </div>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {report.title}
            </h3>
            <p className="text-sm text-gray-600 mb-6 min-h-[40px]">
              {report.description}
            </p>

            <button
              onClick={() => handleDownload(report.id as any)}
              disabled={loading === report.id}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white font-medium transition-colors ${report.btnColor} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading === report.id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Unduh PDF
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
