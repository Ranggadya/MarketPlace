interface TextAreaProps {
  label: string;
  name: string;
  required?: boolean;
}

export default function TextArea({ label, name, required }: TextAreaProps) {
  return (
    <div className="flex flex-col md:col-span-2">
      <label className="font-semibold text-gray-700 mb-1">{label}</label>
      <textarea
        name={name}
        required={required}
        rows={3}
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
