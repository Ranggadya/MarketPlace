import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area - HAPUS SEMUA PADDING */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}