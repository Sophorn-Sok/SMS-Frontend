export const PROGRAM_OPTIONS = [
  "B.Sc. Computer Science (2024/25)",
  "B.Sc. Information Technology (2024/25)",
  "B.A. Business Administration (2024/25)",
  "B.Eng. Civil Engineering (2024/25)",
];

export const MAJOR_OPTIONS = [
  "Software Engineering",
  "Data Science",
  "Cybersecurity",
  "Network Engineering",
];

export interface RegistrationMonitorRow {
  id: string;
  code: string;
  title: string;
  instructor: string;
  enrolled: number;
  capacity: number;
  status: "OPEN" | "FULL";
}

export const registrationMonitoring: RegistrationMonitorRow[] = [
  {
    id: "1",
    code: "CSC-401",
    title: "Artificial Intelligence Systems",
    instructor: "Prof. Elena K.",
    enrolled: 85,
    capacity: 100,
    status: "OPEN",
  },
  {
    id: "2",
    code: "CSC-412",
    title: "Advanced Algorithms",
    instructor: "Dr. Marcus Thorne",
    enrolled: 60,
    capacity: 60,
    status: "FULL",
  },
  {
    id: "3",
    code: "MAT-301",
    title: "Complex Analysis",
    instructor: "Dr. Sarah Li",
    enrolled: 32,
    capacity: 75,
    status: "OPEN",
  },
];

export interface Deadline {
  id: number;
  day: string;
  month: string;
  title: string;
  description: string;
  accentClassName: string;
}

export const upcomingDeadlines: Deadline[] = [
  {
    id: 1,
    day: "24",
    month: "OCT",
    title: "Late Registration Close",
    description: "All faculty portals must sync by 5PM",
    accentClassName: "border-rose-600 bg-rose-50 text-rose-700",
  },
  {
    id: 2,
    day: "02",
    month: "NOV",
    title: "Mid-Term Roster Freeze",
    description: "Final validation of student credit loads",
    accentClassName: "border-amber-500 bg-amber-50 text-amber-700",
  },
];

export interface CourseRegistryItem {
  id: string;
  code: string;
  title: string;
  department: string;
  instructorName: string;
  instructorInitials: string;
  instructorColorClassName: string;
}

export const courseRegistry: CourseRegistryItem[] = [
  {
    id: "1",
    code: "CS101",
    title: "Intro to Computer Science",
    department: "Engineering",
    instructorName: "Dr. Robert Chen",
    instructorInitials: "DR",
    instructorColorClassName: "bg-sky-100 text-sky-700",
  },
  {
    id: "2",
    code: "MAT204",
    title: "Advanced Calculus II",
    department: "Mathematics",
    instructorName: "Sarah Miller",
    instructorInitials: "SM",
    instructorColorClassName: "bg-rose-100 text-rose-700",
  },
  {
    id: "3",
    code: "BIO301",
    title: "Molecular Genetics",
    department: "Life Sciences",
    instructorName: "John Patel",
    instructorInitials: "JP",
    instructorColorClassName: "bg-rose-100 text-rose-700",
  },
];

export const TIMETABLE_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
] as const;

export const TIMETABLE_TIME_SLOTS = ["08:00", "10:00", "12:00", "14:00"];

export interface TimetableEvent {
  id: string;
  day: (typeof TIMETABLE_DAYS)[number];
  time: string;
  title: string;
  location: string;
  colorClassName: string;
}

export const timetableEvents: TimetableEvent[] = [
  {
    id: "1",
    day: "MONDAY",
    time: "08:00",
    title: "CS101 - Lab A",
    location: "Room 302",
    colorClassName: "border-rose-600 bg-rose-50 text-rose-700",
  },
  {
    id: "2",
    day: "WEDNESDAY",
    time: "08:00",
    title: "CS101 - Lab B",
    location: "Room 302",
    colorClassName: "border-rose-600 bg-rose-50 text-rose-700",
  },
  {
    id: "3",
    day: "TUESDAY",
    time: "10:00",
    title: "MAT204 - Lecture",
    location: "Hall 01",
    colorClassName: "border-rose-600 bg-rose-50 text-rose-700",
  },
  {
    id: "4",
    day: "THURSDAY",
    time: "10:00",
    title: "MAT204 - Lecture",
    location: "Hall 01",
    colorClassName: "border-rose-600 bg-rose-50 text-rose-700",
  },
  {
    id: "5",
    day: "MONDAY",
    time: "12:00",
    title: "BIO301 - Lab",
    location: "Lab 4C",
    colorClassName: "border-teal-600 bg-teal-50 text-teal-800",
  },
];

export interface RoomUtilization {
  id: number;
  label: string;
  value: number;
  colorClassName: string;
}

export const roomUtilization: RoomUtilization[] = [
  { id: 1, label: "Main Lecture Halls", value: 92, colorClassName: "bg-emerald-600" },
  { id: 2, label: "Computer Labs", value: 78, colorClassName: "bg-amber-500" },
  { id: 3, label: "Seminar Rooms", value: 45, colorClassName: "bg-rose-700" },
];

export interface ScheduleConflict {
  id: string;
  description: string;
}

export const initialScheduleConflicts: ScheduleConflict[] = [
  { id: "c1", description: "MAT204 and BIO301 overlap in Hall 01" },
];
