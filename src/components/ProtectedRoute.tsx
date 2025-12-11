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
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      if (role && !allowedRoles.includes(role)) {
        router.push("/");
        return;
      }
    }
  }, [isAuthenticated, role, loading, router, allowedRoles]);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }
  if (!isAuthenticated || (role && !allowedRoles.includes(role))) {
    return null;
  }
  return <>{children}</>;
}
