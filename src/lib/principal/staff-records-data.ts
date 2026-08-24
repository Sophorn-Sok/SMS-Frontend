export interface DepartmentRow {
  id: string;
  name: string;
  dotColorClassName: string;
  facultyCount: number;
  recruitmentLabel: string;
  recruitmentColorClassName: string;
  ratio: string;
  ratioConcern: boolean;
}

export const departments: DepartmentRow[] = [
  {
    id: "d1",
    name: "Computer Science",
    dotColorClassName: "bg-rose-600",
    facultyCount: 42,
    recruitmentLabel: "4 OPEN SLOTS",
    recruitmentColorClassName: "bg-rose-50 text-rose-700",
    ratio: "1:24",
    ratioConcern: true,
  },
  {
    id: "d2",
    name: "Business Admin",
    dotColorClassName: "bg-teal-600",
    facultyCount: 58,
    recruitmentLabel: "STABLE",
    recruitmentColorClassName: "bg-stone-100 text-stone-600",
    ratio: "1:16",
    ratioConcern: false,
  },
  {
    id: "d3",
    name: "Engineering",
    dotColorClassName: "bg-rose-600",
    facultyCount: 36,
    recruitmentLabel: "HIRING (2)",
    recruitmentColorClassName: "bg-emerald-50 text-emerald-700",
    ratio: "1:14",
    ratioConcern: false,
  },
  {
    id: "d4",
    name: "Life Sciences",
    dotColorClassName: "bg-stone-400",
    facultyCount: 45,
    recruitmentLabel: "STABLE",
    recruitmentColorClassName: "bg-stone-100 text-stone-600",
    ratio: "1:19",
    ratioConcern: false,
  },
];

export interface HiringStage {
  id: string;
  label: string;
  count: number;
  percent: number;
}

export const hiringPipeline: HiringStage[] = [
  { id: "h1", label: "New Applications", count: 124, percent: 100 },
  { id: "h2", label: "Interviews Scheduled", count: 18, percent: 40 },
  { id: "h3", label: "Offer Pending", count: 4, percent: 15 },
];

export interface TenureReview {
  id: string;
  name: string;
  department: string;
  dueDate: string;
  initials: string;
  colorClassName: string;
}

export const tenureReviews: TenureReview[] = [
  {
    id: "tr1",
    name: "Dr. Elena Rostova",
    department: "Life Sciences",
    dueDate: "DUE OCT 12",
    initials: "ER",
    colorClassName: "bg-rose-100 text-rose-700",
  },
  {
    id: "tr2",
    name: "Prof. Marcus Sterling",
    department: "Engineering",
    dueDate: "DUE OCT 28",
    initials: "MS",
    colorClassName: "bg-sky-100 text-sky-700",
  },
];

export interface Milestone {
  id: string;
  day: string;
  month: string;
  title: string;
  description: string;
}

export const milestones: Milestone[] = [
  {
    id: "ms1",
    day: "22",
    month: "SEP",
    title: "15th Work Anniversary",
    description: "Dr. Sarah Jenkins, Dean of Humanities",
  },
  {
    id: "ms2",
    day: "25",
    month: "SEP",
    title: "Grant Achievement",
    description: "Physics Lab Team - $1.2M Research Grant",
  },
];

export interface RecordChange {
  id: string;
  kind: "check" | "edit" | "profile";
  text: string;
  meta: string;
}

export const recentChanges: RecordChange[] = [
  { id: "rc1", kind: "check", text: "HR updated contract for Prof. Li", meta: "2h ago" },
  { id: "rc2", kind: "edit", text: "Address change: Mark T.", meta: "5h ago" },
  { id: "rc3", kind: "profile", text: "New faculty profile created (Physics)", meta: "Yesterday" },
];
