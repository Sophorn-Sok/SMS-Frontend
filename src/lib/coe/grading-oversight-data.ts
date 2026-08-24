export interface GradeRow {
  id: string;
  name: string;
  initials: string;
  avatarColorClassName: string;
  studentId: string;
  internal: number;
  external: number;
  grade: string;
  status: "Verified" | "Flagged";
}

export interface PendingCourse {
  id: string;
  code: string;
  title: string;
  instructor: string;
  studentCount: number;
  reviewState: "In Review" | "Pending";
  meta: string;
  batch: string;
  meanScore: number;
  verifiedPercent: number;
  roster: GradeRow[];
}

export const pendingCourses: PendingCourse[] = [
  {
    id: "c1",
    code: "CS-402",
    title: "Advanced Algorithms",
    instructor: "Prof. Alan Turing",
    studentCount: 45,
    reviewState: "In Review",
    meta: "2h ago",
    batch: "2024-A",
    meanScore: 78.4,
    verifiedPercent: 98,
    roster: [
      {
        id: "s1",
        name: "Michael Jordan",
        initials: "MJ",
        avatarColorClassName: "bg-rose-100 text-rose-700",
        studentId: "20240188",
        internal: 38,
        external: 52,
        grade: "A+",
        status: "Verified",
      },
      {
        id: "s2",
        name: "Stephen Curry",
        initials: "SC",
        avatarColorClassName: "bg-rose-100 text-rose-700",
        studentId: "20240192",
        internal: 35,
        external: 48,
        grade: "A-",
        status: "Flagged",
      },
      {
        id: "s3",
        name: "LeBron James",
        initials: "LB",
        avatarColorClassName: "bg-sky-100 text-sky-700",
        studentId: "20240201",
        internal: 32,
        external: 44,
        grade: "B+",
        status: "Verified",
      },
      {
        id: "s4",
        name: "Kevin Durant",
        initials: "KD",
        avatarColorClassName: "bg-rose-100 text-rose-700",
        studentId: "20240215",
        internal: 34,
        external: 49,
        grade: "A-",
        status: "Verified",
      },
    ],
  },
  {
    id: "c2",
    code: "MAT-201",
    title: "Linear Algebra",
    instructor: "Dr. Emmy Noether",
    studentCount: 120,
    reviewState: "Pending",
    meta: "5h ago",
    batch: "2024-A",
    meanScore: 0,
    verifiedPercent: 0,
    roster: [],
  },
  {
    id: "c3",
    code: "PHY-101",
    title: "Quantum Mechanics",
    instructor: "Dr. Richard Feynman",
    studentCount: 32,
    reviewState: "Pending",
    meta: "Yesterday",
    batch: "2024-A",
    meanScore: 0,
    verifiedPercent: 0,
    roster: [],
  },
];
