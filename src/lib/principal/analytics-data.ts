import type { ComponentType } from "react";
import { DollarIcon, GraduationCapIcon, StarIcon, UsersIcon, type IconProps } from "@/components/icons";

export interface OverviewStat {
  id: string;
  icon: ComponentType<IconProps>;
  iconColorClassName: string;
  trend?: string;
  trendNote?: string;
  label: string;
  value: string;
  progress: number;
  progressColorClassName: string;
}

export const overviewStats: OverviewStat[] = [
  {
    id: "os1",
    icon: UsersIcon,
    iconColorClassName: "bg-rose-50 text-rose-700",
    trend: "↗ +2.4%",
    label: "Total Student Population",
    value: "24,582",
    progress: 62,
    progressColorClassName: "bg-rose-700",
  },
  {
    id: "os2",
    icon: GraduationCapIcon,
    iconColorClassName: "bg-sky-50 text-sky-700",
    trend: "↗ +0.8%",
    label: "Active Faculty",
    value: "1,142",
    progress: 45,
    progressColorClassName: "bg-sky-600",
  },
  {
    id: "os3",
    icon: DollarIcon,
    iconColorClassName: "bg-emerald-50 text-emerald-700",
    trend: "↗ +12.5%",
    label: "Research Funding",
    value: "$42.8M",
    progress: 78,
    progressColorClassName: "bg-emerald-600",
  },
  {
    id: "os4",
    icon: StarIcon,
    iconColorClassName: "bg-amber-50 text-amber-500",
    trendNote: "Target: 3.5",
    label: "Average Institutional GPA",
    value: "3.38",
    progress: 90,
    progressColorClassName: "bg-amber-500",
  },
];

export const trendYears = ["2019", "2020", "2021", "2022", "2023"];
export const enrollmentTrend = [58, 64, 70, 78, 88];
export const graduationTrend = [50, 54, 58, 63, 70];

export interface ReportItem {
  id: string;
  name: string;
  type: string;
  size: string;
  colorClassName: string;
}

export const reports: ReportItem[] = [
  {
    id: "r1",
    name: "Enrollment Audit Q3",
    type: "PDF",
    size: "12.4 MB",
    colorClassName: "bg-rose-50 text-rose-700",
  },
  {
    id: "r2",
    name: "Financial Summary 2024",
    type: "XLSX",
    size: "4.8 MB",
    colorClassName: "bg-emerald-50 text-emerald-700",
  },
  {
    id: "r3",
    name: "Graduation Forecast",
    type: "PDF",
    size: "8.2 MB",
    colorClassName: "bg-rose-50 text-rose-700",
  },
];

export interface FacultyPerformanceRow {
  id: string;
  name: string;
  initials: string;
  avatarColorClassName: string;
  department: string;
  publicationIndex: number;
  maxPublicationIndex: number;
  studentRating: number;
  status: "Exceptional" | "Achieved";
}

export const facultyPerformance: FacultyPerformanceRow[] = [
  {
    id: "fp1",
    name: "Dr. Elena Rodriguez",
    initials: "ER",
    avatarColorClassName: "bg-rose-100 text-rose-700",
    department: "Science & Research",
    publicationIndex: 8.5,
    maxPublicationIndex: 10,
    studentRating: 4.8,
    status: "Exceptional",
  },
  {
    id: "fp2",
    name: "Prof. Marcus Chen",
    initials: "MC",
    avatarColorClassName: "bg-sky-100 text-sky-700",
    department: "Engineering",
    publicationIndex: 7.2,
    maxPublicationIndex: 10,
    studentRating: 4.2,
    status: "Achieved",
  },
];
