import { ReactNode } from "react";

export default function GradientCard({ children }: { children: ReactNode }) {
  return (
    <div className="
      w-full max-w-4xl 
      bg-white 
      shadow-2xl 
      rounded-3xl 
      p-10 
      border border-gray-200
      transition-all 
      duration-300 
      hover:scale-[1.01]
    ">
      {children}
    </div>
  );
}
