export const graduationOverview = {
  eligibilityPercent: 88,
  currentGpa: "3.82",
  status: "Pending",
};

export interface CreditBreakdown {
  id: string;
  label: string;
  earned: number;
  total: number;
  colorClassName: string;
}

export const creditCompletion = {
  earned: 140,
  required: 160,
  breakdown: [
    { id: "b1", label: "Major Core Courses", earned: 92, total: 100, colorClassName: "bg-rose-700" },
    { id: "b2", label: "Electives", earned: 36, total: 40, colorClassName: "bg-rose-700" },
    { id: "b3", label: "General Education", earned: 12, total: 20, colorClassName: "bg-amber-500" },
  ] satisfies CreditBreakdown[],
};

export type ChecklistState = "done" | "pending" | "blocked";

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  state: ChecklistState;
  actionLabel?: string;
}

export const initialChecklist: ChecklistItem[] = [
  {
    id: "gc1",
    title: "Core Academic Requirements",
    description: "Completed on May 12, 2023",
    state: "done",
  },
  {
    id: "gc2",
    title: "Financial Clearance",
    description: "Account Balance: $0.00",
    state: "done",
  },
  {
    id: "gc3",
    title: "Library Dues & Returns",
    description: "1 item outstanding: \"The Art of Computation\"",
    state: "pending",
    actionLabel: "Resolve",
  },
  {
    id: "gc4",
    title: "Exit Interview / Career Survey",
    description: "Mandatory for all graduating seniors",
    state: "blocked",
    actionLabel: "Start",
  },
];

export const graduationForecast = {
  date: "June 2024",
  label: "Projected Convocation Date",
  milestones: [
    { id: "m1", label: "Final Thesis Submission", date: "Apr 15" },
    { id: "m2", label: "Application Deadline", date: "May 01" },
    { id: "m3", label: "Cap & Gown Pick-up", date: "May 20" },
  ],
  note: "You are on track to graduate with Summa Cum Laude honors if your GPA remains above 3.8.",
};
