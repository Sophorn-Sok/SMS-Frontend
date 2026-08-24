"use client";

import { usePathname } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { HistoryIcon, UsersIcon } from "@/components/icons";

function isUsersActive(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/accounts");
}

function isAuditActive(pathname: string) {
  return pathname.startsWith("/admin/audit-log");
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/admin/accounts",
      label: "User Management",
      icon: UsersIcon,
      active: isUsersActive(pathname),
    },
    {
      href: "/admin/audit-log",
      label: "System Audit Log",
      icon: HistoryIcon,
      active: isAuditActive(pathname),
    },
  ];

  return (
    <DashboardShell
      homeHref="/admin/accounts"
      navItems={navItems}
      userName="Admin"
      userRole="Super Admin"
    >
      {children}
    </DashboardShell>
  );
}
