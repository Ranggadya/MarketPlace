import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { useCallback } from "react";

export default function FileDropzone({
  onFile,
  preview,
}: {
  onFile: (f: File) => void;
  preview?: string | null;
}) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) {
        onFile(accepted[0]);
      }
    },
    [onFile]  
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-5 cursor-pointer
        transition hover:border-primary hover:bg-primary/5
        ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"}
      `}
    >
      <input {...getInputProps()} />

      {preview ? (
        <img
          src={preview}
          className="w-full h-48 object-cover rounded-xl shadow-md"
        />
      ) : (
        <div className="flex flex-col items-center text-gray-500">
          <Upload className="h-10 w-10 mb-2" />
          <p className="font-medium">Drag & Drop or Click to Upload</p>
          <p className="text-sm">JPG, PNG – Max 5MB</p>
        </div>
      )}
    </div>
  );
}
