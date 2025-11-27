"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function FormSlider() {
  const [active, setActive] = useState<"login" | "register">("login");

  return (
    <div className="
      relative 
      w-full 
      max-w-4xl 
      bg-white 
      shadow-2xl 
      rounded-2xl 
      overflow-hidden 
      flex
    ">
      {/* PANEL KIRI (Info + Tombol Switch) */}
      <div className="
        hidden 
        md:flex 
        flex-col 
        justify-center 
        items-center 
        w-1/2 
        bg-gradient-to-br 
        from-purple-700 
        via-purple-600 
        to-indigo-700 
        text-white 
        p-10
      ">
        <h2 className="text-3xl font-bold mb-2">
          {active === "login" ? "Selamat Datang!" : "Buat Akun Baru"}
        </h2>
        <p className="text-sm text-purple-200 mb-6 text-center">
          {active === "login"
            ? "Masuk dan mulai menjelajahi marketplace."
            : "Daftar untuk bergabung dan mulai menggunakan layanan kami."}
        </p>

        <button
          onClick={() =>
            setActive(active === "login" ? "register" : "login")
          }
          className="
            px-6 py-2 
            border border-white 
            rounded-full 
            hover:bg-white 
            hover:text-purple-700 
            transition
          "
        >
          {active === "login"
            ? "Daftar Sekarang"
            : "Sudah punya akun? Masuk"}
        </button>
      </div>

      {/* PANEL KANAN (Slide Content) */}
      <div className="relative w-full md:w-1/2 h-full overflow-hidden">
        <div
          className="
            flex 
            w-[200%] 
            h-full 
            transition-transform 
            duration-500 
            ease-in-out
          "
          style={{
            transform:
              active === "login" ? "translateX(0%)" : "translateX(-50%)",
          }}
        >
          {/* LOGIN */}
          <div className="w-1/2 p-10">
            <LoginForm onSwitch={() => setActive("register")} />
          </div>

          {/* REGISTER */}
          <div className="w-1/2 p-10">
            <RegisterForm onSwitch={() => setActive("login")} />
          </div>
        </div>
      </div>
    </div>
  );
}
