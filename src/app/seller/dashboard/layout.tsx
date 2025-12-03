import Sidebar from "@/components/Sidebar";

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
