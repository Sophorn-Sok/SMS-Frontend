"use client";

import { usePathname } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { FileTextIcon, GraduationCapIcon, GridIcon } from "@/components/icons";

function isDashboardActive(pathname: string) {
  return pathname === "/teacher";
}

function isAcademicsActive(pathname: string) {
  return pathname.startsWith("/teacher/assignments");
}

function isExaminationActive(pathname: string) {
  return pathname.startsWith("/teacher/exam-papers");
}

export function TeacherShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/teacher",
      label: "Dashboard",
      icon: GridIcon,
      active: isDashboardActive(pathname),
    },
    {
      href: "/teacher/assignments",
      label: "Academics",
      icon: GraduationCapIcon,
      active: isAcademicsActive(pathname),
    },
    {
      href: "/teacher/exam-papers",
      label: "Examination",
      icon: FileTextIcon,
      active: isExaminationActive(pathname),
    },
  ];

  return (
    <DashboardShell
      homeHref="/teacher"
      navItems={navItems}
      userName="Teacher Name"
      userRole="Teacher"
    >
      {children}
    </DashboardShell>
  );
}
