"use client";

import { usePathname } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { ClipboardIcon, GridIcon } from "@/components/icons";

function isDashboardActive(pathname: string) {
  return (
    pathname === "/academic-affairs" ||
    pathname.startsWith("/academic-affairs/program-setup")
  );
}

function isSchedulingActive(pathname: string) {
  return pathname.startsWith("/academic-affairs/course-registration");
}

export function AcademicAffairsShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/academic-affairs",
      label: "Dashboard",
      icon: GridIcon,
      active: isDashboardActive(pathname),
    },
    {
      href: "/academic-affairs/course-registration",
      label: "Course and Scheduling",
      icon: ClipboardIcon,
      active: isSchedulingActive(pathname),
    },
  ];

  return (
    <DashboardShell
      homeHref="/academic-affairs"
      navItems={navItems}
      userInitials="AAO"
      userRole="Academic Affair"
    >
      {children}
    </DashboardShell>
  );
}
