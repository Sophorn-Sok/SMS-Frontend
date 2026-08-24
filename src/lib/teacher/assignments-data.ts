export interface RosterStudent {
  id: string;
  rollNo: string;
  name: string;
  initials: string;
  avatarColorClassName: string;
  submissionStatus: "On Time" | "Late" | "Missing";
  score: number | null;
  feedback: string;
}

export interface AssignmentStats {
  average: string;
  high: string;
  low: string;
  pending: string;
}

export interface Assignment {
  id: string;
  code: string;
  title: string;
  badge: "GRADING IN PROGRESS" | "UPCOMING" | "GRADED";
  deadlineLabel: string;
  submissionsLabel: string;
  className: string;
  classMeta: string;
  stats: AssignmentStats;
  roster: RosterStudent[];
}

export const assignments: Assignment[] = [
  {
    id: "asg-1",
    code: "CS-402",
    title: "Advanced Algorithm Analysis",
    badge: "GRADING IN PROGRESS",
    deadlineLabel: "Deadline: Oct 24, 2023",
    submissionsLabel: "22/25 Submissions",
    className: "CS-402: ADVANCED ALGORITHM ANALYSIS",
    classMeta: "Class: 4th Year - Section B",
    stats: { average: "82.4%", high: "98/100", low: "45/100", pending: "03" },
    roster: [
      {
        id: "st1",
        rollNo: "2023-CS-01",
        name: "Adrian Bennett",
        initials: "AB",
        avatarColorClassName: "bg-sky-100 text-sky-700",
        submissionStatus: "On Time",
        score: 88,
        feedback: "Excellent logic implementation.",
      },
      {
        id: "st2",
        rollNo: "2023-CS-02",
        name: "Chloe Morrison",
        initials: "CM",
        avatarColorClassName: "bg-rose-100 text-rose-700",
        submissionStatus: "Late",
        score: 74,
        feedback: "Deducted 5 marks for late submission.",
      },
      {
        id: "st3",
        rollNo: "2023-CS-03",
        name: "David Goggins",
        initials: "DG",
        avatarColorClassName: "bg-rose-100 text-rose-700",
        submissionStatus: "On Time",
        score: null,
        feedback: "",
      },
      {
        id: "st4",
        rollNo: "2023-CS-04",
        name: "Elena Fisher",
        initials: "EF",
        avatarColorClassName: "bg-rose-100 text-rose-700",
        submissionStatus: "Missing",
        score: 0,
        feedback: "Student has not uploaded work.",
      },
    ],
  },
  {
    id: "asg-2",
    code: "MAT-101",
    title: "Linear Algebra Quiz 2",
    badge: "UPCOMING",
    deadlineLabel: "Deadline: Oct 28, 2023",
    submissionsLabel: "0/25 Submissions",
    className: "MAT-101: LINEAR ALGEBRA QUIZ 2",
    classMeta: "Class: 2nd Year - Section A",
    stats: { average: "—", high: "—", low: "—", pending: "00" },
    roster: [],
  },
  {
    id: "asg-3",
    code: "CS-402",
    title: "Graph Theory Project",
    badge: "GRADED",
    deadlineLabel: "Closed: Oct 15, 2023",
    submissionsLabel: "25/25 Graded",
    className: "CS-402: GRAPH THEORY PROJECT",
    classMeta: "Class: 4th Year - Section B",
    stats: { average: "88.0%", high: "97/100", low: "76/100", pending: "00" },
    roster: [
      {
        id: "st5",
        rollNo: "2023-CS-01",
        name: "Adrian Bennett",
        initials: "AB",
        avatarColorClassName: "bg-sky-100 text-sky-700",
        submissionStatus: "On Time",
        score: 91,
        feedback: "Strong grasp of graph traversal.",
      },
      {
        id: "st6",
        rollNo: "2023-CS-02",
        name: "Chloe Morrison",
        initials: "CM",
        avatarColorClassName: "bg-rose-100 text-rose-700",
        submissionStatus: "On Time",
        score: 85,
        feedback: "Good, minor edge-case bugs.",
      },
    ],
  },
];
