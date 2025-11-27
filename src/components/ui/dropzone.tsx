"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropzoneProps {
  label?: string;
  preview?: string | null;
  onFile: (file: File | null) => void;
  accept?: Record<string, string[]>;
}

export function Dropzone({ label, preview, onFile, accept }: DropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFile(acceptedFiles[0]);
      }
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  });

  return (
    <div className="space-y-2">
      {label && <p className="font-medium text-sm">{label}</p>}

      <div
        {...getRootProps()}
        className={cn(
          "border border-dashed rounded-xl px-6 py-8 cursor-pointer transition-all text-center group",
          "bg-white hover:bg-violet-50",
          isDragActive
            ? "border-violet-600 bg-violet-100"
            : "border-gray-400"
        )}
      >
        <input {...getInputProps()} />

        {/* Jika ada preview */}
        {preview ? (
          <div className="relative w-full">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto h-40 w-auto object-cover rounded-lg shadow-md"
            />

            {/* Tombol Remove */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFile(null);
              }}
              className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* State kosong (belum upload) */
          <div className="flex flex-col items-center text-gray-600">
            <UploadCloud className="h-10 w-10 mb-2 text-violet-600" />
            <p className="font-medium">Drop file here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF Accepted</p>
          </div>
        )}
      </div>
    </div>
  );
}
