"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import AnimatedIconRow from "./AnimatedIconRow";
import { ShoppingBag, User, Shield } from "lucide-react";
export default function UniversalLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData.entries());
    const newErrors: { email?: string; password?: string } = {};
    if (!body.email) newErrors.email = "Email wajib diisi";
    if (!body.password) newErrors.password = "Password wajib diisi";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {

      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: json.message || "Email atau password salah",
        confirmButtonColor: "#DB4444",
        confirmButtonText: "Coba Lagi",
      });
      setLoading(false);
      return;
    }
 
    Swal.fire({
      icon: "success",
      title: "Login Berhasil!",
      text: "Anda akan diarahkan...",
      timer: 1500,
      showConfirmButton: false,
      position: "top-end",
      toast: true,
      background: "#FEF2F2",
      iconColor: "#DB4444",
    });

    setTimeout(async () => {
      localStorage.setItem("user", JSON.stringify(json.account));
      localStorage.setItem("role", json.role);
      try {
        // Small delay to ensure cookies are fully set in browser
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(`🔐 Redirecting to ${json.role} dashboard`);
        // Redirect based on role
        if (json.role === "admin") {
          router.push("/admin/dashboard");
        } else if (json.role === "seller") {
          router.push("/seller/dashboard");
        } else {
          router.push("/user/home");
        }
        // Force hard navigation after a moment (fallback in case router.push doesn't work)
        setTimeout(() => {
          if (json.role === "admin") {
            window.location.href = "/admin/dashboard";
          } else if (json.role === "seller") {
            window.location.href = "/seller/dashboard";
          } else {
            window.location.href = "/user/home";
          }
        }, 1000);
      } catch (error) {
        console.error("❌ Session verification failed:", error);
        Swal.fire({
          icon: "error",
          title: "Terjadi Kesalahan",
          text: "Gagal memverifikasi sesi. Silakan login kembali.",
          confirmButtonColor: "#DB4444",
        });
        setLoading(false);
      }
    }, 1500);
  }
  return (
    <div>
      {/* Animated Icons */}
      <AnimatedIconRow icons={[ShoppingBag, User, Shield]} />
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Email"
          name="email"
          type="email"
          required
          icon={Mail}
          placeholder="email@example.com"
          error={errors.email}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          required
          icon={Lock}
          placeholder="Masukkan password"
          error={errors.password}
        />
        <button
          disabled={loading}
          className="
            w-full px-6 py-3 mt-4 rounded-xl font-semibold text-white
            bg-gradient-to-r from-red-500 to-red-600
            hover:from-red-600 hover:to-red-700
            hover:shadow-2xl hover:scale-[1.02]
            active:scale-[0.98]
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              Masuk
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
      {/* Footer Link */}
      <div className="mt-6 text-sm text-gray-600 text-center">
        <p>
          Belum punya akun?{" "}
          <a
            href="/seller/register"
            className="font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors"
          >
            Daftar sebagai penjual
          </a>
        </p>
      </div>
    </div>
  );
}
