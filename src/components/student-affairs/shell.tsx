"use client";

import { usePathname } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { BarChartIcon, GridIcon } from "@/components/icons";

function isDashboardActive(pathname: string) {
  return (
    pathname === "/student-affairs" ||
    pathname.startsWith("/student-affairs/students") ||
    pathname === "/student-affairs/enrollment" ||
    pathname.startsWith("/student-affairs/enrollment/")
  );
}

function isReportsActive(pathname: string) {
  return pathname.startsWith("/student-affairs/enrollment-reports");
}

export function StudentAffairsShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/student-affairs",
      label: "Dashboard",
      icon: GridIcon,
      active: isDashboardActive(pathname),
    },
    {
      href: "/student-affairs/enrollment-reports",
      label: "Reports",
      icon: BarChartIcon,
      active: isReportsActive(pathname),
    },
  ];

  return (
    <DashboardShell
      homeHref="/student-affairs"
      navItems={navItems}
      userName="SAO"
      userRole="Student Affair"
    >
      {children}
    </DashboardShell>
  );
}
