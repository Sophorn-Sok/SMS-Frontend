import { RoleShell } from "@/components/role-shell";
import { roleFeatures } from "@/lib/features";

export default function PrincipalLayout({
  children,
}: LayoutProps<"/principal">) {
  return (
    <RoleShell roleLabel="Principal" features={roleFeatures["principal"]}>
      {children}
    </RoleShell>
  );
}
