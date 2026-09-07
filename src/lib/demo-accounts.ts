import type { RoleSlug } from "./roles";

export interface DemoAccount {
  role: RoleSlug;
  email: string;
  password: string;
}

/**
 * Seeded by `pnpm run db:seed:users` in SMS-Backend. Keep in sync with
 * `prisma/seed-users.ts` there and SMS/INTEGRATION.md.
 */
export const DEMO_PASSWORD = "Demo@123";

export const demoAccounts: DemoAccount[] = [
  { role: "student-affairs", email: "student-affairs@kit.test", password: DEMO_PASSWORD },
  { role: "academic-affairs", email: "academic-affairs@kit.test", password: DEMO_PASSWORD },
  { role: "teacher", email: "teacher@kit.test", password: DEMO_PASSWORD },
  { role: "controller-of-examination", email: "coe@kit.test", password: DEMO_PASSWORD },
  { role: "student", email: "student@kit.test", password: DEMO_PASSWORD },
  { role: "principal", email: "principal@kit.test", password: DEMO_PASSWORD },
  { role: "admin", email: "admin@kit.test", password: DEMO_PASSWORD },
];
