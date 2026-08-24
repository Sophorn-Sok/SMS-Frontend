export interface MonthlyEnrollment {
  month: string;
  lastYear: number;
  current: number;
}

export const enrollmentTrend: MonthlyEnrollment[] = [
  { month: "Jan", lastYear: 150, current: 210 },
  { month: "Feb", lastYear: 130, current: 180 },
  { month: "Mar", lastYear: 200, current: 230 },
  { month: "Apr", lastYear: 175, current: 120 },
  { month: "May", lastYear: 190, current: 255 },
];

export interface SentReport {
  id: string;
  title: string;
  status: "Delivered" | "Pending";
  meta: string;
}

export const initialSentReports: SentReport[] = [
  {
    id: "r1",
    title: "Weekly Enrollment Summary",
    status: "Delivered",
    meta: "Sent to Dr. Aris Thorne • Today, 09:15 AM",
  },
  {
    id: "r2",
    title: "May Admission Audit",
    status: "Delivered",
    meta: "Sent to Dr. Aris Thorne • Yesterday, 04:30 PM",
  },
  {
    id: "r3",
    title: "Freshman Intake Analysis",
    status: "Pending",
    meta: "Sent to Dr. Aris Thorne • 2 days ago",
  },
];

export interface EnrollmentRow {
  id: string;
  name: string;
  enrollmentId: string;
  department: string;
  date: string;
  status: "Verified" | "Pending Docs";
}

export const enrollmentRows: EnrollmentRow[] = [
  {
    id: "1",
    name: "Elena Rodriguez",
    enrollmentId: "ENR-2024-0891",
    department: "Computer Science",
    date: "Jun 12, 2024",
    status: "Verified",
  },
  {
    id: "2",
    name: "Marcus Sterling",
    enrollmentId: "ENR-2024-0902",
    department: "Applied Physics",
    date: "Jun 12, 2024",
    status: "Verified",
  },
  {
    id: "3",
    name: "Amina Al-Farsi",
    enrollmentId: "ENR-2024-0915",
    department: "Architecture",
    date: "Jun 11, 2024",
    status: "Pending Docs",
  },
  {
    id: "4",
    name: "Julian Chen",
    enrollmentId: "ENR-2024-0922",
    department: "Biotechnology",
    date: "Jun 10, 2024",
    status: "Verified",
  },
  {
    id: "5",
    name: "Sofia Petrova",
    enrollmentId: "ENR-2024-0931",
    department: "Mathematics",
    date: "Jun 9, 2024",
    status: "Verified",
  },
  {
    id: "6",
    name: "Daniel Kim",
    enrollmentId: "ENR-2024-0944",
    department: "Chemistry",
    date: "Jun 8, 2024",
    status: "Pending Docs",
  },
  {
    id: "7",
    name: "Grace Okafor",
    enrollmentId: "ENR-2024-0958",
    department: "Economics",
    date: "Jun 7, 2024",
    status: "Verified",
  },
  {
    id: "8",
    name: "Liam O'Connor",
    enrollmentId: "ENR-2024-0965",
    department: "Physics",
    date: "Jun 6, 2024",
    status: "Verified",
  },
  {
    id: "9",
    name: "Nadia Hassan",
    enrollmentId: "ENR-2024-0977",
    department: "Sociology",
    date: "Jun 5, 2024",
    status: "Pending Docs",
  },
];
