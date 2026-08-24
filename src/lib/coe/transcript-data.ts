export interface TranscriptCourse {
  code: string;
  title: string;
  credits: number;
  grade: string;
}

export interface TranscriptRecord {
  rollNumber: string;
  studentName: string;
  program: string;
  gpa: string;
  courses: TranscriptCourse[];
}

export const transcripts: Record<string, TranscriptRecord> = {
  "AD-2024-8839": {
    rollNumber: "AD-2024-8839",
    studentName: "ALEXANDER DUPONT",
    program: "B.Sc. COMPUTER SCIENCE & AI",
    gpa: "3.92 / 4.00",
    courses: [
      { code: "CS-801", title: "Advanced Neural Networks", credits: 4.0, grade: "A+" },
      { code: "CS-805", title: "Cloud Architecture & Security", credits: 3.0, grade: "A" },
    ],
  },
  "BW-2024-1120": {
    rollNumber: "BW-2024-1120",
    studentName: "BRIANA WELLS",
    program: "B.A. ECONOMICS",
    gpa: "3.54 / 4.00",
    courses: [
      { code: "EC-701", title: "Macroeconomic Theory", credits: 3.0, grade: "A-" },
      { code: "EC-710", title: "Behavioral Economics", credits: 3.0, grade: "B+" },
    ],
  },
};

export interface DepartmentProgress {
  id: string;
  label: string;
  completed: number;
  total: number;
}

export const graduationDepartments: DepartmentProgress[] = [
  { id: "d1", label: "Computer Science", completed: 428, total: 450 },
  { id: "d2", label: "Business Admin", completed: 290, total: 310 },
  { id: "d3", label: "Engineering", completed: 185, total: 205 },
];

export type ClearanceState = "clear" | "hold" | "pending";

export interface EligibilityRow {
  id: string;
  name: string;
  initials: string;
  avatarColorClassName: string;
  program: string;
  rollNo: string;
  creditsEarned: number;
  creditsTotal: number;
  financialClearance: ClearanceState;
  libraryDues: ClearanceState;
  status: "ELIGIBLE" | "HOLD" | "VERIFYING";
}

export const eligibilityList: EligibilityRow[] = [
  {
    id: "g1",
    name: "Johnathan Doe",
    initials: "JD",
    avatarColorClassName: "bg-rose-100 text-rose-700",
    program: "B.Tech Mechanical",
    rollNo: "ME-2024-9912",
    creditsEarned: 160,
    creditsTotal: 160,
    financialClearance: "clear",
    libraryDues: "clear",
    status: "ELIGIBLE",
  },
  {
    id: "g2",
    name: "Sarah Williams",
    initials: "SW",
    avatarColorClassName: "bg-rose-100 text-rose-700",
    program: "B.A. Economics",
    rollNo: "EC-2024-4421",
    creditsEarned: 148,
    creditsTotal: 160,
    financialClearance: "clear",
    libraryDues: "hold",
    status: "HOLD",
  },
  {
    id: "g3",
    name: "Marcus Brown",
    initials: "MB",
    avatarColorClassName: "bg-rose-100 text-rose-700",
    program: "B.Sc Biology",
    rollNo: "BI-2024-1182",
    creditsEarned: 160,
    creditsTotal: 160,
    financialClearance: "pending",
    libraryDues: "clear",
    status: "VERIFYING",
  },
];
