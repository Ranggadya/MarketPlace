interface TextAreaProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
}
export default function TextArea({ label, name, required, error, placeholder }: TextAreaProps) {
  return (
    <div className="flex flex-col md:col-span-2">
      <label className="font-semibold text-gray-700 mb-2">{label}</label>
      <textarea
        name={name}
        required={required}
        rows={3}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 rounded-lg
          bg-gray-50 text-gray-800
          border-2 transition-all duration-200
          ${error ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:border-red-500 focus:ring-red-100"}
          focus:outline-none focus:ring-2
          hover:border-gray-300
        `}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
