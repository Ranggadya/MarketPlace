import AdminDashboardCharts from "@/components/admin/DashboardChartsAdmin";

export default function AdminDashboardPage() {
  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Platform Dashboard
          </h2>
          <p className="text-muted-foreground">
            System-wide overview and health monitoring for Platform
            Administrators.
          </p>
        </div>
      </div>

      <AdminDashboardCharts />
    </div>
  );
}
