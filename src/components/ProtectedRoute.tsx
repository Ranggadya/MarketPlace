"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("seller" | "admin")[];
}
export default function ProtectedRoute({ 
  children, 
  allowedRoles = ["seller", "admin"] 
}: ProtectedRouteProps) {
  const { isAuthenticated, role, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      // Not authenticated → redirect to login
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      // Authenticated but wrong role → redirect to home
      if (role && !allowedRoles.includes(role)) {
        router.push("/");
        return;
      }
    }
  }, [isAuthenticated, role, loading, router, allowedRoles]);
  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }
  // Not authenticated or wrong role → show nothing (will redirect)
  if (!isAuthenticated || (role && !allowedRoles.includes(role))) {
    return null;
  }
  // Authenticated and correct role → show content
  return <>{children}</>;
}
