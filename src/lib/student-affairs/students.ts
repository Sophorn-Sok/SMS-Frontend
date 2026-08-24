export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  year: string;
  status: "Enrolled" | "Pending" | "Withdrawn";
}

export const students: StudentRecord[] = [
  {
    id: "1",
    name: "Johnathan Doe",
    email: "john.doe@educore.edu",
    studentId: "STU-2023-001",
    department: "Computer Science",
    year: "Year 2",
    status: "Enrolled",
  },
  {
    id: "2",
    name: "Alice Smith",
    email: "a.smith@educore.edu",
    studentId: "STU-2023-042",
    department: "Applied Sciences",
    year: "Year 1",
    status: "Pending",
  },
  {
    id: "3",
    name: "Marcus Rodriguez",
    email: "m.rodriguez@educore.edu",
    studentId: "STU-2022-118",
    department: "Business Admin",
    year: "Year 3",
    status: "Enrolled",
  },
  {
    id: "4",
    name: "Katelyn Lee",
    email: "k.lee@educore.edu",
    studentId: "STU-2023-089",
    department: "Civil Engineering",
    year: "Year 1",
    status: "Withdrawn",
  },
  {
    id: "5",
    name: "Priya Nair",
    email: "p.nair@educore.edu",
    studentId: "STU-2023-104",
    department: "Computer Science",
    year: "Year 2",
    status: "Enrolled",
  },
  {
    id: "6",
    name: "Tomas Alvarez",
    email: "t.alvarez@educore.edu",
    studentId: "STU-2021-233",
    department: "Mechanical Engineering",
    year: "Year 4",
    status: "Enrolled",
  },
];

export interface DirectoryChange {
  id: number;
  dotColorClassName: string;
  boldText: string;
  restText: string;
  meta: string;
}

export const recentDirectoryChanges: DirectoryChange[] = [
  {
    id: 1,
    dotColorClassName: "bg-rose-600",
    boldText: "Bulk Upload Completed:",
    restText:
      " 24 new records added to Department of Mechanical Engineering.",
    meta: "10 minutes ago • ID: 22910",
  },
  {
    id: 2,
    dotColorClassName: "bg-sky-500",
    boldText: "Status Update:",
    restText:
      " 12 students transitioned from 'Pending' to 'Enrolled' after fee verification.",
    meta: "2 hours ago • Automated Task",
  },
  {
    id: 3,
    dotColorClassName: "bg-rose-300",
    boldText: "Record Modified:",
    restText:
      " Aiden Thompson's scholarship details were updated by Admissions Head.",
    meta: "Yesterday at 4:30 PM • Admin: Janet S.",
  },
];
