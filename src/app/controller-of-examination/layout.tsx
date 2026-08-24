import { ControllerOfExaminationShell } from "@/components/coe/shell";

export default function ControllerOfExaminationLayout({
  children,
}: LayoutProps<"/controller-of-examination">) {
  return <ControllerOfExaminationShell>{children}</ControllerOfExaminationShell>;
}
