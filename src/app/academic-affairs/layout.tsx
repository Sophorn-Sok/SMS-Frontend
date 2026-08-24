import { RoleShell } from "@/components/role-shell";
import { roleFeatures } from "@/lib/features";

export default function AcademicAffairsLayout({
  children,
}: LayoutProps<"/academic-affairs">) {
  return (
    <RoleShell
      roleLabel="Academic Affairs"
      features={roleFeatures["academic-affairs"]}
    >
      {children}
    </RoleShell>
  );
}
