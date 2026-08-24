import { StudentAffairsShell } from "@/components/student-affairs/shell";

export default function StudentAffairsLayout({
  children,
}: LayoutProps<"/student-affairs">) {
  return <StudentAffairsShell>{children}</StudentAffairsShell>;
}
