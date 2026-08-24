import { RoleShell } from "@/components/role-shell";
import { roleFeatures } from "@/lib/features";

export default function StudentLayout({
  children,
}: LayoutProps<"/student">) {
  return (
    <RoleShell roleLabel="Student" features={roleFeatures["student"]}>
      {children}
    </RoleShell>
  );
}
