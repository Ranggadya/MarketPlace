"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import UploadFile from "@/components/UploadFile";

export default function SellerRegisterForm() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter(); 

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/sellers/register", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      setMsg("❌ " + json.message);
      setLoading(false);
      return;
    }

    setMsg("✅ Registrasi berhasil! Mengarahkan ke halaman login...");
    setTimeout(() => {
      router.push("/seller/login");
    }, 2000);

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {msg && (
        <div className="md:col-span-2 p-3 rounded-lg bg-purple-100 text-purple-700 border border-purple-300">
          {msg}
        </div>
      )}

      {/* Informasi Toko */}
      <span className="md:col-span-2 text-xl text-gray-900 font-bold">
        Informasi Toko
      </span>

      <Input label="Nama Toko" name="storeName" required />
      <TextArea label="Deskripsi Toko" name="storeDescription" />

      {/* Informasi PIC */}
      <span className="md:col-span-2 text-xl text-gray-900 font-bold mt-4">
        Informasi PIC
      </span>

      <Input label="Nama PIC" name="picName" required />
      <Input label="Nomor HP PIC" name="picPhone" required />
      <Input label="Email PIC" name="picEmail" type="email" required />

      {/* Alamat */}
      <span className="md:col-span-2 text-xl text-gray-900 font-bold mt-4">
        Alamat PIC
      </span>

      <Input label="Jalan" name="picStreet" required />
      <Input label="RT" name="picRT" required />
      <Input label="RW" name="picRW" required />
      <Input label="Kelurahan" name="picVillage" required />
      <Input label="Kota/Kabupaten" name="picCity" required />
      <Input label="Provinsi" name="picProvince" required />

      {/* Identitas */}
      <span className="md:col-span-2 text-xl text-gray-900 font-bold mt-4">
        Berkas Identitas
      </span>

      <UploadFile label="Upload Foto Penjual" name="picPhotoPath" />
      <UploadFile label="Upload Foto KTP" name="picKtpFilePath" />

      <Input label="Nomor KTP" name="picKtpNumber" required />

      <div className="md:col-span-2 flex justify-end mt-6">
        <button
          disabled={loading}
          className="
            px-6 py-3 rounded-xl font-semibold text-white 
            bg-gradient-to-r from-purple-600 to-indigo-600 
            hover:from-purple-700 hover:to-indigo-700
            transition-all shadow-xl
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loading ? "Menyimpan..." : "Daftar Sekarang"}
        </button>
      </div>
    </form>
  );
}
