import { LucideIcon } from "lucide-react";
interface AnimatedIconRowProps {
  icons: LucideIcon[];
}
export default function AnimatedIconRow({ icons }: AnimatedIconRowProps) {
  return (
    <div className="flex justify-center gap-4 mb-8">
      {icons.map((Icon, index) => (
        <div
          key={index}
          className="p-4 bg-white rounded-full shadow-lg animate-bounce"
          style={{
            animationDelay: `${index * 100}ms`,
            animationDuration: "2s",
          }}
        >
          <Icon className="w-7 h-7 text-red-500" />
        </div>
      ))}
    </div>
  );
}
