export type AuditAction = "Create" | "Update" | "Delete" | "Login" | "Permission Change";

export interface AuditEvent {
  id: string;
  actorName: string;
  actorInitials: string;
  actorColorClassName: string;
  actorRole: string;
  action: AuditAction;
  detail: string;
  ipAddress: string;
  timestamp: string;
}

export const initialAuditEvents: AuditEvent[] = [
  {
    id: "a1",
    actorName: "Dr. Emily Watson",
    actorInitials: "EW",
    actorColorClassName: "bg-rose-100 text-rose-700",
    actorRole: "Registrar",
    action: "Update",
    detail: "Updated grade record for STU-2023-089",
    ipAddress: "192.168.1.24",
    timestamp: "Today, 09:44 AM",
  },
  {
    id: "a2",
    actorName: "Admin",
    actorInitials: "AD",
    actorColorClassName: "bg-stone-200 text-stone-700",
    actorRole: "Super Admin",
    action: "Create",
    detail: "Created user account for James Aris",
    ipAddress: "10.0.0.5",
    timestamp: "Today, 08:12 AM",
  },
  {
    id: "a3",
    actorName: "Marcus Sterling",
    actorInitials: "MS",
    actorColorClassName: "bg-sky-100 text-sky-700",
    actorRole: "Principal",
    action: "Login",
    detail: "Signed in from a new device",
    ipAddress: "172.16.4.11",
    timestamp: "Oct 24, 04:15 PM",
  },
  {
    id: "a4",
    actorName: "Admin",
    actorInitials: "AD",
    actorColorClassName: "bg-stone-200 text-stone-700",
    actorRole: "Super Admin",
    action: "Delete",
    detail: "Removed deactivated account: linda.c@academicnexus.edu",
    ipAddress: "10.0.0.5",
    timestamp: "Sep 12, 11:25 AM",
  },
  {
    id: "a5",
    actorName: "James Aris",
    actorInitials: "JA",
    actorColorClassName: "bg-amber-100 text-amber-700",
    actorRole: "Teacher",
    action: "Permission Change",
    detail: "Granted grading access for CS-402",
    ipAddress: "192.168.1.87",
    timestamp: "Yesterday, 02:31 PM",
  },
];

export const ACTION_OPTIONS: AuditAction[] = [
  "Create",
  "Update",
  "Delete",
  "Login",
  "Permission Change",
];
