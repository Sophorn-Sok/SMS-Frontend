import { RoleShell } from "@/components/role-shell";
import { roleFeatures } from "@/lib/features";

export default function TeacherLayout({
  children,
}: LayoutProps<"/teacher">) {
  return (
    <RoleShell roleLabel="Teacher" features={roleFeatures["teacher"]}>
      {children}
    </RoleShell>
  );
}
