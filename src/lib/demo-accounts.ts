import type { RoleSlug } from "./roles";

export interface DemoAccount {
  role: RoleSlug;
  username: string;
  password: string;
}

export const DEMO_PASSWORD = "Demo@123";

export const demoAccounts: DemoAccount[] = [
  { role: "student-affairs", username: "SAF-2024-001", password: DEMO_PASSWORD },
  { role: "academic-affairs", username: "ACA-2024-001", password: DEMO_PASSWORD },
  { role: "teacher", username: "TCH-2024-001", password: DEMO_PASSWORD },
  {
    role: "controller-of-examination",
    username: "COE-2024-001",
    password: DEMO_PASSWORD,
  },
  { role: "student", username: "STU-2024-001", password: DEMO_PASSWORD },
  { role: "principal", username: "PRN-2024-001", password: DEMO_PASSWORD },
  { role: "admin", username: "ADM-2024-001", password: DEMO_PASSWORD },
];
