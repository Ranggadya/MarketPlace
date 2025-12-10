"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const data = {
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
    };

    const response = await fetch("/api/seller/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      router.push("/seller/dashboard");
    } else {
      alert(result.message || "Login gagal.");
    }

    setLoading(false);
  };

  return (
    <div
      className="
        w-full max-w-md 
        bg-white/80 backdrop-blur-xl
        shadow-xl rounded-2xl 
        p-8 border border-primary/20
        animate-fade-in
      "
    >
      <h1 className="text-3xl font-semibold text-primary-dark text-center mb-6">
        Login Penjual
      </h1>

      <form onSubmit={handleLogin} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-primary-dark mb-1">
            Email PIC
          </label>
          <input
            name="email"
            type="email"
            required
            className="
              w-full px-4 py-2 rounded-lg
              border border-primary/30 
              bg-white/60 backdrop-blur-sm
              focus:ring-2 focus:ring-primary-dark 
              focus:outline-none
              transition
            "
            placeholder="example@gmail.com"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-primary-dark mb-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            className="
              w-full px-4 py-2 rounded-lg
              border border-primary/30 
              bg-white/60 backdrop-blur-sm
              focus:ring-2 focus:ring-primary-dark 
              focus:outline-none
              transition
            "
            placeholder="••••••••"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-2 rounded-lg font-medium text-white
            bg-primary hover:bg-primary-dark
            transition-all duration-200
            disabled:bg-primary-light
            shadow-md hover:shadow-lg
          "
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>

        {/* Register Link */}
        <p className="text-center text-sm mt-3">
          Belum punya akun?{" "}
          <a
            href="/seller/register"
            className="text-accent font-semibold hover:underline"
          >
            Daftar sekarang
          </a>
        </p>
      </form>
    </div>
  );
}
