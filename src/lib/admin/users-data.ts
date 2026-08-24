export type UserStatus = "Active" | "Deactivated";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColorClassName: string;
  role: string;
  status: UserStatus;
  lastLogin: string;
}

export const initialUsers: AppUser[] = [
  {
    id: "u1",
    name: "Dr. Emily Watson",
    email: "emily.watson@academicnexus.edu",
    initials: "EW",
    avatarColorClassName: "bg-rose-100 text-rose-700",
    role: "Registrar",
    status: "Active",
    lastLogin: "Today, 09:42 AM",
  },
  {
    id: "u2",
    name: "Marcus Sterling",
    email: "m.sterling@academicnexus.edu",
    initials: "MS",
    avatarColorClassName: "bg-sky-100 text-sky-700",
    role: "Principal",
    status: "Active",
    lastLogin: "Oct 24, 04:15 PM",
  },
  {
    id: "u3",
    name: "Linda Chido",
    email: "linda.c@academicnexus.edu",
    initials: "LC",
    avatarColorClassName: "bg-rose-100 text-rose-700",
    role: "COE",
    status: "Deactivated",
    lastLogin: "Sep 12, 11:20 AM",
  },
  {
    id: "u4",
    name: "James Aris",
    email: "j.aris@academicnexus.edu",
    initials: "JA",
    avatarColorClassName: "bg-amber-100 text-amber-700",
    role: "Teacher",
    status: "Active",
    lastLogin: "Yesterday, 02:30 PM",
  },
  {
    id: "u5",
    name: "David Chen",
    email: "d.chen@student.academicnexus.edu",
    initials: "DC",
    avatarColorClassName: "bg-sky-100 text-sky-700",
    role: "Student",
    status: "Active",
    lastLogin: "Today, 08:05 AM",
  },
];

export const ROLE_OPTIONS = [
  "Student Affairs",
  "Academic Affairs",
  "Teacher",
  "COE",
  "Student",
  "Principal",
  "Registrar",
  "Admin",
];
