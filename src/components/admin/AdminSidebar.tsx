"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Store,
  Users,
  Star,
  MessageSquare,
  FileText,
  Clock,
  LogOut,        // ✅ NEW
  ChevronDown    // ✅ NEW
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";  // ✅ NEW
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";  // ✅ NEW
export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();  // ✅ NEW
  const [isLoggingOut, setIsLoggingOut] = useState(false);  // ✅ NEW
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Produk (Kategori)",
      path: "/admin/products",
      icon: <Package className="w-5 h-5" />,
    },
    {
      name: "Toko (Lokasi)",
      path: "/admin/shops",
      icon: <Store className="w-5 h-5" />,
    },
    {
      name: "Penjual (Status)",
      path: "/admin/sellers",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Persetujuan Penjual",
      path: "/admin/sellers/pending",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      name: "Rating Pengunjung",
      path: "/admin/reviews/ratings",
      icon: <Star className="w-5 h-5" />,
    },
    {
      name: "Komentar Pengunjung",
      path: "/admin/reviews/comments",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      name: "Pusat Laporan",
      path: "/admin/laporan",
      icon: <FileText className="w-5 h-5" />,
    },
  ];
  // ✅ NEW: Handle logout dengan loading state
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // Redirect handled by AuthContext
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-red-600">PLATFORM ADMIN</h1>
      </div>
      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-red-50 text-red-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* ✅ UPDATED Footer - User Info dengan Dropdown Logout */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <DropdownMenu>
          <DropdownMenuTrigger 
            className="w-full focus:outline-none"
            disabled={isLoggingOut}
          >
            <div className="flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold text-red-600 flex-shrink-0">
                AD
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Administrator
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Platform Manager
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
