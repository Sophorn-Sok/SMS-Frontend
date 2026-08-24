export const examStats = {
  gpa: "3.82",
  creditsEarned: 94,
  creditsTotal: 120,
  upcomingExams: 2,
};

export interface GradeBand {
  id: string;
  label: string;
  percent: number;
  colorClassName: string;
}

export const gradeDistribution: GradeBand[] = [
  { id: "gb1", label: "A / A+ (Distinction)", percent: 45, colorClassName: "bg-rose-900" },
  { id: "gb2", label: "B / B+ (Merit)", percent: 35, colorClassName: "bg-red-500" },
  { id: "gb3", label: "C (Pass)", percent: 15, colorClassName: "bg-teal-700" },
  { id: "gb4", label: "D/F (Incomplete)", percent: 5, colorClassName: "bg-stone-700" },
];

export interface ExamRow {
  id: string;
  subject: string;
  code: string;
  date: string;
  timeLabel: string;
  isActiveNow: boolean;
  duration: string;
  type: string;
  typeColorClassName: string;
  locked: boolean;
}

export const upcomingExams: ExamRow[] = [
  {
    id: "ex1",
    subject: "Advanced Microeconomics",
    code: "ECON-402",
    date: "Oct 24, 2024",
    timeLabel: "09:00 AM (Active Now)",
    isActiveNow: true,
    duration: "120 Mins",
    type: "Online Proctored",
    typeColorClassName: "bg-sky-50 text-sky-700",
    locked: false,
  },
  {
    id: "ex2",
    subject: "Statistical Modeling II",
    code: "STAT-305",
    date: "Oct 26, 2024",
    timeLabel: "02:00 PM",
    isActiveNow: false,
    duration: "180 Mins",
    type: "On-Campus (Room 402)",
    typeColorClassName: "bg-rose-50 text-rose-700",
    locked: true,
  },
];

export interface SemesterResult {
  id: string;
  semester: string;
  completedDate: string;
  gpa: string;
  courses: { id: string; name: string; grade: string }[];
}

export const resultsHistory: SemesterResult[] = [
  {
    id: "sr1",
    semester: "Spring Semester 2024",
    completedDate: "Completed on June 15, 2024",
    gpa: "3.90",
    courses: [
      { id: "c1", name: "Corporate Finance", grade: "A" },
      { id: "c2", name: "Marketing Analytics", grade: "A-" },
      { id: "c3", name: "Digital Strategy", grade: "A+" },
    ],
  },
  {
    id: "sr2",
    semester: "Winter Semester 2023",
    completedDate: "Completed on Dec 20, 2023",
    gpa: "3.75",
    courses: [
      { id: "c4", name: "Macroeconomics", grade: "B+" },
      { id: "c5", name: "Business Law", grade: "A" },
      { id: "c6", name: "Supply Chain Mgmt", grade: "A-" },
    ],
  },
];
