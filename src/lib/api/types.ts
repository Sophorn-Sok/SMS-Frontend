/**
 * Wire types for the SMS-Backend REST API.
 *
 * These are hand-written for the Admin slice. Once the backend's OpenAPI spec
 * (served at /docs.json) is stable, this file can be replaced by generated types.
 */

// ─── Response envelope ──────────────────────────────────────────────────────

export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
}

/** Success shape: `{ success: true, data, message?, pagination? }`. */
export interface ApiSuccess<T> {
  success: true;
  message?: string;
  data: T;
  pagination?: ApiPagination;
}

/** Error shape: `{ success: false, message, errors? }` (zod fieldErrors). */
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiError;

export interface Paginated<T> {
  items: T[];
  pagination: ApiPagination;
}

// ─── Roles ─────────────────────────────────────────────────────────────────

export const ROLES = [
  "STUDENT_AFFAIRS",
  "ACADEMIC_AFFAIRS",
  "TEACHER",
  "CONTROLLER_OF_EXAMINATION",
  "STUDENT",
  "PRINCIPAL",
  "ADMIN",
] as const;

export type BackendRole = (typeof ROLES)[number];

// ─── Auth / current user ───────────────────────────────────────────────────

export interface LoginResponse {
  accessToken: string;
}

export interface MeDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: BackendRole;
  isVerified: boolean;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Admin: accounts (list = GET /users -> SafeUser) ────────────────────────

/** Row shape from `GET /users`. `POST /admin/accounts` returns the same minus
 *  `lastLoginAt`, which the page ignores (it refetches the list). */
export interface AccountDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: BackendRole;
  isVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: BackendRole;
}

export interface UpdateAccountStatusBody {
  isActive: boolean;
}

/** `GET /users` query params (user.validation.ts paginationSchema). */
export interface UsersQuery {
  page?: number;
  limit?: number;
  role?: BackendRole;
  status?: "VERIFIED" | "UNVERIFIED";
  accountStatus?: "ACTIVE" | "DEACTIVATED";
  search?: string;
}

// ─── Admin: audit log ──────────────────────────────────────────────────────

export type AuditActionDTO = "CREATE" | "UPDATE" | "PUBLISH" | "APPROVE" | "DELETE";
export type AuditModuleDTO =
  | "STUDENT_AFFAIRS"
  | "ACADEMIC_AFFAIRS"
  | "TEACHER"
  | "EXAM"
  | "ADMIN";

export interface AuditLogDTO {
  id: string;
  userId: string;
  user: { id: string; firstName: string; lastName: string; email: string };
  action: AuditActionDTO;
  module: AuditModuleDTO;
  entityType: string;
  entityId: string;
  details: string | null;
  createdAt: string;
}
