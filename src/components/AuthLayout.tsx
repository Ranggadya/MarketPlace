import { ReactNode } from "react";
import { ShoppingBag, Store, Shield, Star, Package, TrendingUp } from "lucide-react";
interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}
export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT: Form Section */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-red-50 via-white to-red-50/30 relative overflow-hidden">
        {/* Pattern Background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #DB4444 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Form Content */}
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-8 lg:p-10 border border-red-100">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">
                {title}
              </h1>
              <p className="text-gray-600">{subtitle}</p>
            </div>
            {/* Form Content */}
            {children}
          </div>
        </div>
      </div>
      {/* RIGHT: Illustration Section (Hidden on mobile) */}
      <div className="hidden lg:flex relative bg-gradient-to-br from-red-500 to-red-600 overflow-hidden">
        {/* Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Icon Grid */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          {/* Main Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3">Marketplace PPL</h2>
            <p className="text-red-100 text-lg">Terpercaya • Aman • Transparan</p>
          </div>
          {/* Animated Icon Grid */}
          <div className="grid grid-cols-3 gap-8">
            <IconBox icon={ShoppingBag} label="Belanja" delay="0ms" />
            <IconBox icon={Store} label="Toko" delay="100ms" />
            <IconBox icon={Shield} label="Aman" delay="200ms" />
            <IconBox icon={Star} label="Rating" delay="300ms" />
            <IconBox icon={Package} label="Produk" delay="400ms" />
            <IconBox icon={TrendingUp} label="Terbaik" delay="500ms" />
          </div>
          {/* Stats */}
          <div className="flex gap-12 mt-12">
            <StatBox value="1000+" label="Produk" />
            <StatBox value="50K+" label="Pengguna" />
            <StatBox value="4.8★" label="Rating" />
          </div>
        </div>
      </div>
    </div>
  );
}
// Icon Box Component
function IconBox({ icon: Icon, label, delay }: { icon: any; label: string; delay: string }) {
  return (
    <div
      className="flex flex-col items-center gap-3 animate-bounce"
      style={{ animationDelay: delay, animationDuration: "2s" }}
    >
      <div className="p-5 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg hover:bg-white/30 hover:scale-110 transition-all duration-300">
        <Icon className="w-8 h-8" />
      </div>
      <span className="text-sm font-medium text-white/90">{label}</span>
    </div>
  );
}
// Stat Box Component
function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-red-100">{label}</p>
    </div>
  );
}
