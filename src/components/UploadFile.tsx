"use client";

interface UploadFileProps {
  label: string;
  name: string;
}

export default function UploadFile({ label, name }: UploadFileProps) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold text-gray-700 mb-1">{label}</label>

      <input
        type="file"
        name={name}
        accept="image/*"
        className="
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-white file:font-semibold
          file:bg-gradient-to-r file:from-purple-600 file:to-indigo-600
          hover:file:bg-gradient-to-r hover:file:from-purple-700 hover:file:to-indigo-700
          text-gray-700 bg-gray-100 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-purple-500
        "
      />
    </div>
  );
}
