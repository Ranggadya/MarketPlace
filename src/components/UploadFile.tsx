"use client";
import { useState } from "react";
import { Upload } from "lucide-react";
interface UploadFileProps {
  label: string;
  name: string;
  error?: string;
}
export default function UploadFile({ label, name, error }: UploadFileProps) {
  const [fileName, setFileName] = useState<string>("");
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };
  return (
    <div className="flex flex-col">
      <label className="font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type="file"
          name={name}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id={name}
        />
        <label
          htmlFor={name}
          className={`
            flex items-center justify-center gap-3
            w-full px-4 py-3 rounded-lg
            bg-gray-50 border-2 border-dashed
            ${error ? "border-red-500" : "border-gray-300 hover:border-red-400"}
            cursor-pointer transition-all duration-200
            hover:bg-red-50
            group
          `}
        >
          <Upload className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
          <span className="text-sm text-gray-600 group-hover:text-red-600 font-medium transition-colors">
            {fileName || "Pilih file gambar"}
          </span>
        </label>
      </div>
      {fileName && (
        <p className="mt-2 text-xs text-green-600 font-medium">✓ {fileName}</p>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
