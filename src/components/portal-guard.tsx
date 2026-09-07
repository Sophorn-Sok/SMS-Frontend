"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { roleHome } from "@/lib/auth/roles";
import { ScreenMessage } from "@/components/query-states";
import type { BackendRole } from "@/lib/api/types";

/**
 * Client-side gate for a role portal. The `proxy.ts` cookie check already keeps
 * anonymous users out; this adds the identity/role check once the session is
 * hydrated.
 */
export function PortalGuard({
  role,
  children,
}: {
  role: BackendRole;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, status } = useAuth();

  useEffect(() => {
    if (status === "anon") {
      router.replace("/sign-in");
    } else if (status === "authed" && user && user.role !== role) {
      router.replace(roleHome(user.role));
    }
  }, [status, user, role, router]);

  if (status === "loading") {
    return <ScreenMessage>Loading your workspace…</ScreenMessage>;
  }
  if (status === "anon" || !user || user.role !== role) {
    return <ScreenMessage>Redirecting…</ScreenMessage>;
  }
  return <>{children}</>;
}
