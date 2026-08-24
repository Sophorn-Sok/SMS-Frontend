export const attendance = {
  percent: 90,
  label: "Excellent",
  attended: 45,
  total: 50,
  trend: "+2.4% vs last week",
};

export interface CourseworkItem {
  id: string;
  icon: "flask" | "quiz" | "edit";
  iconColorClassName: string;
  title: string;
  courseLabel: string;
  dueLabel: string;
  dueDate: string;
  badge: "URGENT" | "IN PROGRESS" | "UPCOMING";
  badgeColorClassName: string;
}

export const coursework: CourseworkItem[] = [
  {
    id: "cw1",
    icon: "flask",
    iconColorClassName: "bg-rose-50 text-rose-700",
    title: "Molecular Biology Lab Report",
    courseLabel: "Advanced Bio (BIO-402)",
    dueLabel: "Due in 2 days",
    dueDate: "Oct 24, 11:59 PM",
    badge: "URGENT",
    badgeColorClassName: "bg-rose-700 text-white",
  },
  {
    id: "cw2",
    icon: "quiz",
    iconColorClassName: "bg-sky-50 text-sky-700",
    title: "Macroeconomics Weekly Quiz",
    courseLabel: "Economics (ECN-101)",
    dueLabel: "Due in 5 days",
    dueDate: "Oct 27, 09:00 AM",
    badge: "IN PROGRESS",
    badgeColorClassName: "bg-rose-100 text-rose-700",
  },
  {
    id: "cw3",
    icon: "edit",
    iconColorClassName: "bg-amber-50 text-amber-700",
    title: "Ethics in AI - Final Draft",
    courseLabel: "Computer Science (CS-302)",
    dueLabel: "Due next week",
    dueDate: "Nov 02, 11:59 PM",
    badge: "UPCOMING",
    badgeColorClassName: "bg-rose-100 text-rose-700",
  },
];

export const timetableDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
export const todayIndex = 2;
export const timetableSlots = [
  "09:00 AM",
  "10:30 AM",
  "12:00 PM",
  "01:30 PM",
  "03:00 PM",
  "04:30 PM",
];

export interface TimetableEvent {
  id: string;
  day: string;
  slot: string;
  title: string;
  location: string;
  colorClassName: string;
}

export const timetableEvents: TimetableEvent[] = [
  {
    id: "t1",
    day: "Monday",
    slot: "09:00 AM",
    title: "BIO-402 Mol. Biology",
    location: "Room 302A",
    colorClassName: "border-rose-600 bg-rose-50 text-rose-700",
  },
  {
    id: "t2",
    day: "Tuesday",
    slot: "12:00 PM",
    title: "ECN-101 Macroeconomics",
    location: "Hall B",
    colorClassName: "border-teal-600 bg-teal-50 text-teal-800",
  },
  {
    id: "t3",
    day: "Wednesday",
    slot: "09:00 AM",
    title: "CS-302 Ethics in AI",
    location: "Auditorium",
    colorClassName: "border-rose-600 bg-rose-50 text-rose-700",
  },
  {
    id: "t4",
    day: "Wednesday",
    slot: "12:00 PM",
    title: "LUNCH Academic Plaza",
    location: "",
    colorClassName: "border-emerald-600 bg-emerald-50 text-emerald-800",
  },
  {
    id: "t5",
    day: "Thursday",
    slot: "09:00 AM",
    title: "BIO-402 Biology Lab",
    location: "Lab 4C",
    colorClassName: "border-rose-600 bg-rose-50 text-rose-700",
  },
  {
    id: "t6",
    day: "Friday",
    slot: "09:00 AM",
    title: "ECN-101 Seminar",
    location: "Room 101",
    colorClassName: "border-teal-600 bg-teal-50 text-teal-800",
  },
];

export interface FacultyContact {
  id: string;
  name: string;
  role: string;
  email: string;
  initials: string;
  colorClassName: string;
}

export const facultyContacts: FacultyContact[] = [
  {
    id: "f1",
    name: "Dr. Sarah Jenkins",
    role: "Academic Advisor",
    email: "sarah.jenkins@kit.edu",
    initials: "SJ",
    colorClassName: "bg-rose-100 text-rose-700",
  },
  {
    id: "f2",
    name: "Prof. David Chen",
    role: "Bio-Molecular Head",
    email: "david.chen@kit.edu",
    initials: "DC",
    colorClassName: "bg-sky-100 text-sky-700",
  },
];

export const noticeBoard =
  "Registration for Winter Semester starts Nov 15th. Check your eligibility status.";

export const academicStanding = {
  gpa: "3.82",
  yearMarkers: ["FR", "SO", "JR", "SR (CURR)"],
  currentYearIndex: 3,
};
