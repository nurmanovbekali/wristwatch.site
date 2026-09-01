import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen-safe bg-[#111112]">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
