import { TeacherShell } from "@/components/teacher/shell";

export default function TeacherLayout({
  children,
}: LayoutProps<"/teacher">) {
  return <TeacherShell>{children}</TeacherShell>;
}
