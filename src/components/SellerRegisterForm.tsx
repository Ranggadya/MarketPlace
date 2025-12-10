"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import UploadFile from "@/components/UploadFile";
import FormSectionHeader from "@/components/FormSectionHeader";
import AnimatedIconRow from "./AnimatedIconRow";
import { Store, User, MapPin, FileText, Loader2, CheckCircle, Package, Star } from "lucide-react";
import Swal from "sweetalert2";
export default function SellerRegisterForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/sellers/register", {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: json.message || "Terjadi kesalahan, silakan coba lagi",
        confirmButtonColor: "#DB4444",
      });
      setLoading(false);
      return;
    }
    Swal.fire({
      icon: "success",
      title: "Registrasi Berhasil!",
      html: `
        <p class="text-gray-600">
          Data Anda sedang diverifikasi oleh admin.<br/>
          Anda akan menerima email berisi kredensial login jika disetujui.
        </p>
      `,
      confirmButtonText: "Mengerti",
      confirmButtonColor: "#10B981",
    });
    setTimeout(() => {
      router.push("/");
    }, 3000);
  }
  return (
    <div>
      <AnimatedIconRow icons={[Store, Package, Star]} />
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          ℹ️ <strong>Catatan:</strong> Setelah registrasi, data Anda akan diverifikasi oleh admin. 
          Kredensial login akan dikirim via email jika akun disetujui.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <FormSectionHeader icon={Store} title="Informasi Toko" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Nama Toko" name="storeName" required placeholder="Contoh: Toko Elektronik Jaya" />
            <TextArea label="Deskripsi Toko" name="storeDescription" placeholder="Deskripsikan toko Anda..." />
          </div>
        </div>
        <div>
          <FormSectionHeader icon={User} title="Informasi PIC (Penanggung Jawab)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Nama PIC" name="picName" required placeholder="Nama lengkap" />
            <Input label="Nomor HP PIC" name="picPhone" required placeholder="08xxxxxxxxxx" />
            <Input label="Email PIC" name="picEmail" type="email" required placeholder="email@example.com" />
          </div>
        </div>
        <div>
          <FormSectionHeader icon={MapPin} title="Alamat Lengkap PIC" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Jalan" name="picStreet" required placeholder="Nama jalan" />
            <Input label="RT" name="picRT" required placeholder="001" />
            <Input label="RW" name="picRW" required placeholder="002" />
            <Input label="Kelurahan" name="picVillage" required placeholder="Nama kelurahan" />
            <Input label="Kota/Kabupaten" name="picCity" required placeholder="Nama kota" />
            <Input label="Provinsi" name="picProvince" required placeholder="Nama provinsi" />
          </div>
        </div>
        <div>
          <FormSectionHeader icon={FileText} title="Berkas Identitas" subtitle="Upload foto KTP dan foto diri" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <UploadFile label="Foto Penjual" name="picPhotoPath" />
            <UploadFile label="Foto KTP" name="picKtpFilePath" />
            <Input label="Nomor KTP" name="picKtpNumber" required placeholder="16 digit nomor KTP" />
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button
            disabled={loading}
            className="
              px-8 py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-red-500 to-red-600
              hover:from-red-600 hover:to-red-700
              hover:shadow-2xl hover:scale-[1.02]
              active:scale-[0.98]
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2
            "
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Daftar Sekarang
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
