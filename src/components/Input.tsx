import { LucideIcon } from "lucide-react";
interface InputProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  icon?: LucideIcon;
  placeholder?: string;
}
export default function Input({
  label,
  name,
  type = "text",
  required,
  error,
  icon: Icon,
  placeholder,
}: InputProps) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 rounded-lg
            ${Icon ? "pl-11" : "pl-4"}
            bg-gray-50 text-gray-800
            border-2 transition-all duration-200
            ${error ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:border-red-500 focus:ring-red-100"}
            focus:outline-none focus:ring-2
            hover:border-gray-300
          `}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
