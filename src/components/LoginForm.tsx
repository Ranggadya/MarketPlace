"use client";

import { useState } from "react";
import Input from "@/components/Input";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData.entries());

    const res = await fetch("/api/sellers/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      setMsg("❌ " + json.message);
    } else {
      setMsg("✅ Login berhasil! Redirect...");
      // kamu bisa redirect di sini
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {msg && (
        <div className="p-3 rounded-lg bg-purple-100 text-purple-700 border border-purple-300">
          {msg}
        </div>
      )}

      <Input
        label="Email"
        name="picEmail"
        type="email"
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        required
      />

      <button
        disabled={loading}
        className="
          w-full px-6 py-3 mt-4 
          rounded-xl font-semibold text-white 
          bg-gradient-to-r from-purple-600 to-indigo-600 
          hover:from-purple-700 hover:to-indigo-700
          transition-all shadow-xl
          disabled:opacity-50 
          disabled:cursor-not-allowed
        "
      >
        {loading ? "Memproses..." : "Login"}
      </button>
    </form>
  );
}
