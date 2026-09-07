import type { AuditActionDTO, AuditLogDTO } from "@/lib/api/types";

export type AuditAction = "Create" | "Update" | "Publish" | "Approve" | "Delete";

export interface AuditEvent {
  id: string;
  actorName: string;
  actorInitials: string;
  actorColorClassName: string;
  actorEmail: string;
  action: AuditAction;
  module: string;
  detail: string;
  entityRef: string;
  timestamp: string;
}

const ACTION_LABEL: Record<AuditActionDTO, AuditAction> = {
  CREATE: "Create",
  UPDATE: "Update",
  PUBLISH: "Publish",
  APPROVE: "Approve",
  DELETE: "Delete",
};

export const ACTION_VALUES: AuditActionDTO[] = [
  "CREATE",
  "UPDATE",
  "PUBLISH",
  "APPROVE",
  "DELETE",
];

export const ACTION_OPTIONS: { value: AuditActionDTO; label: AuditAction }[] =
  ACTION_VALUES.map((value) => ({ value, label: ACTION_LABEL[value] }));

const MODULE_LABEL: Record<string, string> = {
  STUDENT_AFFAIRS: "Student Affairs",
  ACADEMIC_AFFAIRS: "Academic Affairs",
  TEACHER: "Teacher",
  EXAM: "Examination",
  ADMIN: "Admin",
};

const AVATAR_COLORS = [
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
];

function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initialsOf(first: string, last: string): string {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "??";
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function fromApiAuditLog(dto: AuditLogDTO): AuditEvent {
  const actorName = dto.user
    ? `${dto.user.firstName} ${dto.user.lastName}`.trim()
    : "Unknown";
  return {
    id: dto.id,
    actorName,
    actorInitials: dto.user
      ? initialsOf(dto.user.firstName, dto.user.lastName)
      : "??",
    actorColorClassName: avatarColor(dto.userId),
    actorEmail: dto.user?.email ?? "",
    action: ACTION_LABEL[dto.action],
    module: MODULE_LABEL[dto.module] ?? dto.module,
    detail: dto.details ?? `${dto.action} ${dto.entityType}`,
    entityRef: `${dto.entityType} · ${dto.entityId.slice(0, 8)}`,
    timestamp: formatTimestamp(dto.createdAt),
  };
}
