"use client";
import { useState } from "react";
import { 
  Store, User, Mail, Phone, MapPin, FileText, 
  CheckCircle, XCircle, Loader2, Calendar 
} from "lucide-react";
import Swal from "sweetalert2";
import Image from "next/image";
interface Seller {
  id: string | null; // ⭐ id is NULL for pending sellers
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
  created_at: string;
}
interface Props {
  seller: Seller;
  onApproved: () => void;
  onRejected: () => void;
}
export default function SellerApprovalCard({ seller, onApproved, onRejected }: Props) {
  const [loading, setLoading] = useState(false);
  async function handleApprove() {
    const result = await Swal.fire({
      title: "Setujui Penjual?",
      html: `
        <p class="text-gray-600">
          Akun untuk <strong>${seller.pic_name}</strong> akan dibuat dan<br/>
          kredensial login akan dikirim ke <strong>${seller.pic_email}</strong>
        </p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Setujui",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;
    setLoading(true);
    // ⭐ USE EMAIL instead of ID
    const encodedEmail = encodeURIComponent(seller.pic_email);
    const res = await fetch(`/api/admin/sellers/approve/${encodedEmail}`, {
      method: "POST",
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok || !json.success) {
      Swal.fire({
        icon: "error",
        title: "Gagal Approve",
        text: json.message || "Terjadi kesalahan",
        confirmButtonColor: "#DB4444",
      });
      return;
    }
    Swal.fire({
      icon: "success",
      title: "Berhasil Disetujui!",
      text: `Email telah dikirim ke ${seller.pic_email}`,
      confirmButtonColor: "#10B981",
    });
    onApproved();
  }
  async function handleReject() {
    const result = await Swal.fire({
      title: "Tolak Penjual?",
      html: `
        <p class="text-gray-600 mb-4">
          Berikan alasan penolakan untuk <strong>${seller.pic_name}</strong>
        </p>
      `,
      input: "textarea",
      inputPlaceholder: "Contoh: Dokumen KTP tidak jelas...",
      inputAttributes: {
        "aria-label": "Alasan penolakan",
      },
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Tolak",
      cancelButtonText: "Batal",
      inputValidator: (value) => {
        if (!value) {
          return "Alasan penolakan harus diisi!";
        }
      },
    });
    if (!result.isConfirmed) return;
    setLoading(true);
    // ⭐ USE EMAIL instead of ID
    const encodedEmail = encodeURIComponent(seller.pic_email);
    const res = await fetch(`/api/admin/sellers/reject/${encodedEmail}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: result.value }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok || !json.success) {
      Swal.fire({
        icon: "error",
        title: "Gagal Reject",
        text: json.message || "Terjadi kesalahan",
        confirmButtonColor: "#DB4444",
      });
      return;
    }
    Swal.fire({
      icon: "success",
      title: "Berhasil Ditolak",
      text: `Email penolakan telah dikirim ke ${seller.pic_email}`,
      confirmButtonColor: "#10B981",
    });
    onRejected();
  }
  const fullAddress = `${seller.pic_street}, RT ${seller.pic_rt}/RW ${seller.pic_rw}, ${seller.pic_village}, ${seller.pic_city}, ${seller.pic_province}`;
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-5 h-5 text-red-500" />
            <h3 className="text-xl font-bold text-gray-800">{seller.store_name}</h3>
          </div>
          {seller.store_description && (
            <p className="text-sm text-gray-600 ml-7">{seller.store_description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          {new Date(seller.created_at).toLocaleDateString("id-ID")}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Nama PIC</p>
              <p className="font-semibold text-gray-800">{seller.pic_name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-semibold text-gray-800">{seller.pic_email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">No. HP</p>
              <p className="font-semibold text-gray-800">{seller.pic_phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Alamat</p>
              <p className="font-semibold text-gray-800 text-sm">{fullAddress}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">No. KTP</p>
              <p className="font-semibold text-gray-800">{seller.pic_ktp_number}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {seller.pic_photo_url && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Foto Penjual</p>
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={seller.pic_photo_url}
                  alt="Foto Penjual"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
          {seller.pic_ktp_url && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Foto KTP</p>
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={seller.pic_ktp_url}
                  alt="Foto KTP"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleApprove}
          disabled={loading}
          className="
            flex-1 flex items-center justify-center gap-2
            px-6 py-3 rounded-lg font-semibold text-white
            bg-green-500 hover:bg-green-600
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          "
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Setujui
            </>
          )}
        </button>
        <button
          onClick={handleReject}
          disabled={loading}
          className="
            flex-1 flex items-center justify-center gap-2
            px-6 py-3 rounded-lg font-semibold text-white
            bg-red-500 hover:bg-red-600
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          "
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <XCircle className="w-5 h-5" />
              Tolak
            </>
          )}
        </button>
      </div>
    </div>
  );
}
