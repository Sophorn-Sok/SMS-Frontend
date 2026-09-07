import { AdminShell } from "@/components/admin/shell";
import { PortalGuard } from "@/components/portal-guard";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <PortalGuard role="ADMIN">
      <AdminShell>{children}</AdminShell>
    </PortalGuard>
  );
}
