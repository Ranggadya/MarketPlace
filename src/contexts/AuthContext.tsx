"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
// ===================================
// TYPES
// ===================================
interface SellerAccount {
  id: string;
  email: string;
  name: string;
  store_name: string;
  store_description: string | null;
  status: string;
}
interface AuthContextType {
  user: SellerAccount | null;
  role: "seller" | "admin" | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isSeller: boolean;
  isAdmin: boolean;
}
// ===================================
// CREATE CONTEXT
// ===================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);
// ===================================
// PROVIDER COMPONENT
// ===================================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SellerAccount | null>(null);
  const [role, setRole] = useState<"seller" | "admin" | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  // ===================================
  // LOAD SESSION ON MOUNT
  // ===================================
  useEffect(() => {
    loadSession();
  }, []);
  async function loadSession() {
    try {
      // ⭐ FIX: ONLY read from localStorage, DON'T verify with Supabase
      // Reason: httpOnly cookies can't be read by client-side JS
      // Middleware already verifies session on server-side
      
      const storedUser = localStorage.getItem("user");
      const storedRole = localStorage.getItem("role");
      if (storedUser && storedRole) {
        setUser(JSON.parse(storedUser));
        setRole(storedRole as "seller" | "admin");
        console.log("✅ Session loaded from localStorage:", storedRole);
      } else {
        console.log("ℹ️ No session in localStorage");
      }
      // ❌ REMOVED: Supabase session verification (causes auto-logout)
      // Client can't read httpOnly cookies, so getSession() always returns null
      // This caused the logout() call on line 82-88 in old code
      
    } catch (error) {
      console.error("Error loading session:", error);
    } finally {
      setLoading(false);
    }
  }
  // ===================================
  // LOGIN FUNCTION
  // ===================================
  async function login(email: string, password: string) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, message: json.message };
      }
      // Store in state and localStorage
      const account = json.account;
      const userRole = json.role;
      setUser(account);
      setRole(userRole);
      localStorage.setItem("user", JSON.stringify(account));
      localStorage.setItem("role", userRole);
      console.log("✅ Login successful, user stored:", userRole);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Terjadi kesalahan saat login" };
    }
  }
  // ===================================
  // LOGOUT FUNCTION
  // ===================================
  async function logout() {
    try {
      console.log("🚪 Logout called");
      
      // Sign out from Supabase if seller
      if (role === "seller") {
        await supabase.auth.signOut();
      }
      // Clear cookies by calling logout API
      if (typeof window !== 'undefined') {
        await fetch('/api/auth/logout', { method: 'POST' });
      }
      // Clear state and localStorage
      setUser(null);
      setRole(null);
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      console.log("✅ Logout complete, redirecting to home");
      // Redirect to home
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
  // ===================================
  // COMPUTED VALUES
  // ===================================
  const isAuthenticated = !!user;
  const isSeller = role === "seller";
  const isAdmin = role === "admin";
  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        login,
        logout,
        isAuthenticated,
        isSeller,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
// ===================================
// CUSTOM HOOK
// ===================================
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
