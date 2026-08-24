import { RoleShell } from "@/components/role-shell";
import { roleFeatures } from "@/lib/features";

export default function ControllerOfExaminationLayout({
  children,
}: LayoutProps<"/controller-of-examination">) {
  return (
    <RoleShell
      roleLabel="Controller of Examination"
      features={roleFeatures["controller-of-examination"]}
    >
      {children}
    </RoleShell>
  );
}
