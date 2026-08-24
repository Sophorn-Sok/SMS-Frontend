export interface ScheduleItem {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  location: string;
  studentCount: number;
  status: "COMPLETED" | "IN PROGRESS" | "UPCOMING";
}

export const initialTodaysSchedule: ScheduleItem[] = [
  {
    id: "s1",
    startTime: "09:00 AM",
    endTime: "10:30 AM",
    title: "Advanced Thermodynamics",
    location: "Room 402B",
    studentCount: 42,
    status: "COMPLETED",
  },
  {
    id: "s2",
    startTime: "11:00 AM",
    endTime: "12:30 PM",
    title: "Fluid Mechanics Workshop",
    location: "Engineering Lab 1",
    studentCount: 25,
    status: "IN PROGRESS",
  },
  {
    id: "s3",
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    title: "Introduction to Robotics",
    location: "Auditorium Hall",
    studentCount: 120,
    status: "UPCOMING",
  },
];

export interface AttendanceStudent {
  id: string;
  name: string;
  present: boolean;
}

export const fluidMechanicsRoster: AttendanceStudent[] = [
  { id: "a1", name: "Marcus Holloway", present: true },
  { id: "a2", name: "Priya Nair", present: true },
  { id: "a3", name: "Daniel Kim", present: true },
  { id: "a4", name: "Sarah Jenkins", present: true },
  { id: "a5", name: "Tomas Alvarez", present: true },
  { id: "a6", name: "Grace Okafor", present: true },
];

export interface AssignedCourse {
  id: string;
  code: string;
  name: string;
  meta: string;
  iconColorClassName: string;
}

export const assignedCourses: AssignedCourse[] = [
  {
    id: "c1",
    code: "MECH-401",
    name: "Advanced Thermodynamics",
    meta: "Semester VII • Section A",
    iconColorClassName: "bg-rose-50 text-rose-700",
  },
  {
    id: "c2",
    code: "MECH-305",
    name: "Fluid Mechanics",
    meta: "Semester V • Section B",
    iconColorClassName: "bg-sky-50 text-sky-700",
  },
  {
    id: "c3",
    code: "ROB-202",
    name: "Introduction to Robotics",
    meta: "Semester III • Section C",
    iconColorClassName: "bg-amber-50 text-amber-700",
  },
];

export interface SubmissionAlert {
  id: string;
  kind: "late" | "grading" | "attendance";
  title: string;
  description: string;
  meta: string;
}

export const initialSubmissionAlerts: SubmissionAlert[] = [
  {
    id: "al1",
    kind: "late",
    title: "Late Submission: Lab Report 4",
    description: "Student: Marcus Holloway • MECH-305",
    meta: "2h ago",
  },
  {
    id: "al2",
    kind: "grading",
    title: "Grading Alert: Final Project Drafts",
    description:
      "15 new submissions ready for grading in Introduction to Robotics.",
    meta: "5h ago",
  },
  {
    id: "al3",
    kind: "attendance",
    title: "Attendance Threshold Reached",
    description:
      "Sarah Jenkins has dropped below 75% attendance in Thermodynamics.",
    meta: "Yesterday",
  },
];
