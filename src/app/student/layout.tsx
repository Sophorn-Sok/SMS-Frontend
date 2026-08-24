import { StudentShell } from "@/components/student/shell";

export default function StudentLayout({ children }: LayoutProps<"/student">) {
  return <StudentShell>{children}</StudentShell>;
}
