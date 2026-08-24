import { PrincipalShell } from "@/components/principal/shell";

export default function PrincipalLayout({
  children,
}: LayoutProps<"/principal">) {
  return <PrincipalShell>{children}</PrincipalShell>;
}
