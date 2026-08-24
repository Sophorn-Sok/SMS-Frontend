export type ExamStatus =
  | "Paper Pending"
  | "Exam Paper Received"
  | "Room Assigned"
  | "Ready for Launch";

export interface ExamRow {
  id: string;
  subject: string;
  code: string;
  department: string;
  date: string;
  time: string;
  status: ExamStatus;
  room?: string;
  invigilator?: string;
}

export const initialExams: ExamRow[] = [
  {
    id: "e1",
    subject: "Advanced Algorithms",
    code: "CS402",
    department: "Dept. of CS",
    date: "Oct 12, 2023",
    time: "09:00 AM - 12:00 PM",
    status: "Exam Paper Received",
  },
  {
    id: "e2",
    subject: "Modern World History",
    code: "HIS201",
    department: "Dept. of History",
    date: "Oct 14, 2023",
    time: "02:00 PM - 05:00 PM",
    status: "Paper Pending",
  },
  {
    id: "e3",
    subject: "Quantum Physics II",
    code: "PHY505",
    department: "Dept. of Physics",
    date: "Oct 15, 2023",
    time: "09:00 AM - 12:00 PM",
    status: "Room Assigned",
    room: "Hall B-402",
  },
  {
    id: "e4",
    subject: "Microeconomics",
    code: "ECO101",
    department: "Dept. of Economics",
    date: "Oct 16, 2023",
    time: "09:00 AM - 12:00 PM",
    status: "Ready for Launch",
    room: "Hall A-101",
    invigilator: "Dr. Patel",
  },
];

export const ROOM_OPTIONS = ["Hall A-101", "Hall B-402", "Lab C-201", "Auditorium"];
export const INVIGILATOR_OPTIONS = [
  "Dr. Patel",
  "Prof. Diaz",
  "Dr. Kim",
  "Ms. Alvarez",
];

export interface ActivityItem {
  id: string;
  barColorClassName: string;
  title: string;
  description: string;
  meta: string;
}

export const initialActivity: ActivityItem[] = [
  {
    id: "a1",
    barColorClassName: "bg-emerald-500",
    title: "Schedule Updated",
    description: "Room B-402 assigned to CS101",
    meta: "2 mins ago",
  },
  {
    id: "a2",
    barColorClassName: "bg-rose-500",
    title: "New Paper Received",
    description: "Intro to Physics (PHY101) by Prof. Miller",
    meta: "1 hour ago",
  },
];
