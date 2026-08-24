import { AcademicAffairsShell } from "@/components/academic-affairs/shell";

export default function AcademicAffairsLayout({
  children,
}: LayoutProps<"/academic-affairs">) {
  return <AcademicAffairsShell>{children}</AcademicAffairsShell>;
}
