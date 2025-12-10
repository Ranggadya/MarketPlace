import { LucideIcon } from "lucide-react";
interface FormSectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}
export default function FormSectionHeader({ icon: Icon, title, subtitle }: FormSectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
      <div className="p-2 bg-red-50 rounded-lg">
        <Icon className="w-5 h-5 text-red-500" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}
