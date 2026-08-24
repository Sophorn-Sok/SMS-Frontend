"use client";

import { usePathname } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { FileTextIcon, GraduationCapIcon, StarIcon } from "@/components/icons";

function isExamSetupActive(pathname: string) {
  return (
    pathname === "/controller-of-examination" ||
    pathname.startsWith("/controller-of-examination/exam-setup")
  );
}

function isGradingActive(pathname: string) {
  return pathname.startsWith("/controller-of-examination/grading-oversight");
}

function isGraduationActive(pathname: string) {
  return pathname.startsWith("/controller-of-examination/transcript-graduation");
}

export function ControllerOfExaminationShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/controller-of-examination/exam-setup",
      label: "Exam Setup",
      icon: FileTextIcon,
      active: isExamSetupActive(pathname),
    },
    {
      href: "/controller-of-examination/grading-oversight",
      label: "Grading Oversight",
      icon: StarIcon,
      active: isGradingActive(pathname),
    },
    {
      href: "/controller-of-examination/transcript-graduation",
      label: "Graduation Reports",
      icon: GraduationCapIcon,
      active: isGraduationActive(pathname),
    },
  ];

  return (
    <DashboardShell
      homeHref="/controller-of-examination/exam-setup"
      navItems={navItems}
      userName="COE"
      userRole="Controller of Examination"
    >
      {children}
    </DashboardShell>
  );
}
