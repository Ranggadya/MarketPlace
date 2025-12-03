"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, FileText, LogOut, Store } from "lucide-react";

const menuItems = [
  { title: "Dashboard", href: "/seller/dashboard", icon: LayoutDashboard },
  { title: "Produk Saya", href: "/seller/dashboard/products", icon: Package },
  { title: "Pesanan", href: "/seller/dashboard/orders", icon: ShoppingCart },
  { title: "Laporan", href: "/seller/dashboard/reports", icon: FileText }
];

// Export Default Function
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 hidden lg:block fixed left-0 top-0 bottom-0 z-10">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-2 text-red-600 font-bold text-xl">
          <Store className="w-6 h-6" />
          <span>MarketPlace</span>
        </div>
      </div>

      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive ? "bg-red-50 text-red-700" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-red-600" : "text-gray-400"}`} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg w-full">
          <LogOut className="w-5 h-5" />
          Keluar
        </button>
      </div>
    </aside>
  );
}