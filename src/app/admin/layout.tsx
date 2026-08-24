import { RoleShell } from "@/components/role-shell";
import { roleFeatures } from "@/lib/features";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <RoleShell roleLabel="Admin" features={roleFeatures["admin"]}>
      {children}
    </RoleShell>
  );
}
