interface InputProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}

export default function Input({ label, name, type = "text", required }: InputProps) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold text-gray-700 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="
          px-4 py-2 
          rounded-lg 
          bg-gray-100 
          text-gray-800 
          border border-gray-300 
          focus:outline-none 
          focus:ring-2 
          focus:ring-purple-500
        "
      />
    </div>
  );
}
