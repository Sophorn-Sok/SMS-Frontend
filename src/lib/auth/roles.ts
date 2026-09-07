/**
 * Mapping between the backend `Role` enum (SCREAMING_SNAKE) and the frontend
 * `RoleSlug` (kebab-case route segments in src/lib/roles.ts).
 */

import type { RoleSlug } from "@/lib/roles";
import type { BackendRole } from "@/lib/api/types";

const ROLE_TO_SLUG: Record<BackendRole, RoleSlug> = {
  STUDENT_AFFAIRS: "student-affairs",
  ACADEMIC_AFFAIRS: "academic-affairs",
  TEACHER: "teacher",
  CONTROLLER_OF_EXAMINATION: "controller-of-examination",
  STUDENT: "student",
  PRINCIPAL: "principal",
  ADMIN: "admin",
};

const SLUG_TO_ROLE = Object.fromEntries(
  Object.entries(ROLE_TO_SLUG).map(([role, slug]) => [slug, role]),
) as Record<RoleSlug, BackendRole>;

export function roleToSlug(role: BackendRole): RoleSlug {
  return ROLE_TO_SLUG[role];
}

export function slugToRole(slug: RoleSlug): BackendRole {
  return SLUG_TO_ROLE[slug];
}

/** Landing route for a role after sign-in. */
export function roleHome(role: BackendRole): string {
  return `/${roleToSlug(role)}`;
}

const ROLE_LABELS: Record<BackendRole, string> = {
  STUDENT_AFFAIRS: "Student Affairs",
  ACADEMIC_AFFAIRS: "Academic Affairs",
  TEACHER: "Teacher",
  CONTROLLER_OF_EXAMINATION: "Controller of Examination",
  STUDENT: "Student",
  PRINCIPAL: "Principal",
  ADMIN: "Admin",
};

export function roleLabel(role: BackendRole): string {
  return ROLE_LABELS[role] ?? role;
}
