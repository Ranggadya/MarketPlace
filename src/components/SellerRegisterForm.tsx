"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dropzone } from "@/components/ui/dropzone";

export default function SellerRegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // FILE STATES
  const [picFile, setPicFile] = useState<File | null>(null);
  const [ktpFile, setKtpFile] = useState<File | null>(null);

  const [picPreview, setPicPreview] = useState<string | null>(null);
  const [ktpPreview, setKtpPreview] = useState<string | null>(null);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.currentTarget);

    if (picFile) fd.append("picPhotoPath", picFile);
    if (ktpFile) fd.append("picKtpFilePath", ktpFile);

    const res = await fetch("/api/sellers/register", {
      method: "POST",
      body: fd,
    });

    setLoading(false);
    if (res.ok) {
      router.push("/seller/login");
    } else alert("Registrasi gagal.");
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 shadow-xl mt-10 border rounded-2xl">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-violet-700">
        Formulir Registrasi Penjual
      </h1>

      <form onSubmit={submitForm} className="space-y-10">

        {/* ============= TOKO ============= */}
        <SectionTitle title="Informasi Toko" />

        <div className="grid grid-cols-1 gap-4">
          <InputField label="Nama Toko*" name="storeName" required />

          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">
              Deskripsi Singkat
            </label>
            <textarea
              name="storeDescription"
              rows={3}
              className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-400 outline-none resize-none"
            />
          </div>
        </div>


        {/* ============= PIC ============= */}
        <SectionTitle title="Informasi PIC" />

        <div className="space-y-4">
          <InputField label="Nama PIC*" name="picName" required />
          <InputField label="Nomor HP*" name="picPhone" required />
          <InputField label="Email PIC*" name="picEmail" type="email" required />
        </div>

        {/* ============= ALAMAT ============= */}
        <SectionTitle title="Alamat PIC" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Jalan*" name="picStreet" required />
          <InputField label="RT*" name="picRT" required />
          <InputField label="RW*" name="picRW" required />
          <InputField label="Kelurahan*" name="picVillage" required />
          <InputField label="Kota/Kabupaten*" name="picCity" required />
          <InputField label="Provinsi*" name="picProvince" required />
        </div>

        {/* ============= DOKUMEN ============= */}
        <SectionTitle title="Dokumen Identitas" />

        <div className="space-y-4">
          <InputField label="Nomor KTP PIC*" name="picKtpNumber" required />

          <Dropzone
            label="Foto PIC"
            preview={picPreview}
            accept={{ "image/*": [] }}
            onFile={(file) => {
              if (!file) {
                setPicFile(null);
                setPicPreview(null);
                return;
              }
              setPicFile(file);
              setPicPreview(URL.createObjectURL(file));
            }}
          />

          <Dropzone
            label="Foto KTP"
            preview={ktpPreview}
            accept={{ "image/*": [], "application/pdf": [] }}
            onFile={(file) => {
              if (!file) {
                setKtpFile(null);
                setKtpPreview(null);
                return;
              }
              setKtpFile(file);
              setKtpPreview(URL.createObjectURL(file));
            }}
          />
        </div>

        {/* ============= BUTTON ============= */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 shadow-md disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Registrasi Penjual"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ===== COMPONENTS =====
function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-xl font-bold mb-2 border-b pb-2 text-gray-800">
      {title}
    </h2>
  );
}

function InputField({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <label className="font-medium text-gray-700 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-400 outline-none"
      />
    </div>
  );
}

function TextAreaField({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <label className="font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        name={name}
        className="border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-400 outline-none"
      />
    </div>
  );
}
