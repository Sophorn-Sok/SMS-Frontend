import type { AccountDTO, BackendRole } from "@/lib/api/types";
import { ROLES } from "@/lib/api/types";
import { roleLabel } from "@/lib/auth/roles";

export type UserStatus = "Active" | "Deactivated";

/** View model rendered by the admin accounts table. */
export interface AppUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColorClassName: string;
  role: string;
  roleValue: BackendRole;
  status: UserStatus;
  lastLogin: string;
}

const AVATAR_COLORS = [
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
];

function initialsOf(first: string, last: string): string {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "??";
}

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatLastLogin(iso: string | null | undefined): string {
  if (!iso) return "Never";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Never";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Map a backend account/user record to the table view model. */
export function fromApiAccount(dto: AccountDTO): AppUser {
  return {
    id: dto.id,
    name: `${dto.firstName} ${dto.lastName}`.trim(),
    email: dto.email,
    initials: initialsOf(dto.firstName, dto.lastName),
    avatarColorClassName: avatarColor(dto.id),
    role: roleLabel(dto.role),
    roleValue: dto.role,
    status: dto.isActive ? "Active" : "Deactivated",
    lastLogin: formatLastLogin(dto.lastLoginAt),
  };
}

export interface RoleOption {
  value: BackendRole;
  label: string;
}

export const ROLE_OPTIONS: RoleOption[] = ROLES.map((value) => ({
  value,
  label: roleLabel(value),
}));
