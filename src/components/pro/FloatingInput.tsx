import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FloatingInput({ label, className, ...props }: Props) {
  return (
    <div className="relative w-full">
      <Input
        {...props}
        className={cn(
          "peer p-4 pt-6 border rounded-xl focus-visible:ring-2",
          className
        )}
      />
      <Label
        className="
          absolute left-4 top-2 text-gray-500 text-sm
          transition-all peer-placeholder-shown:top-4
          peer-placeholder-shown:text-base
          peer-placeholder-shown:text-gray-400
          peer-focus:top-2 peer-focus:text-sm peer-focus:text-primary
        "
      >
        {label}
      </Label>
    </div>
  );
}
