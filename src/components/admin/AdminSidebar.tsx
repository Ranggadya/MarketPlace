"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Store,
  Users,
  Star,
  MessageSquare,
  ShieldCheck,
  FileText,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

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

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo Area - Matches Seller Sidebar Style */}
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

      {/* Footer / User Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold text-red-600">
            AD
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Administrator</p>
            <p className="text-xs text-gray-500">Platform Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
