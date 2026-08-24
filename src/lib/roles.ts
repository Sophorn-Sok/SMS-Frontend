export type RoleSlug =
  | "student-affairs"
  | "academic-affairs"
  | "teacher"
  | "controller-of-examination"
  | "student"
  | "principal"
  | "admin";

export interface Role {
  slug: RoleSlug;
  label: string;
  description: string;
}

export const roles: Role[] = [
  {
    slug: "student-affairs",
    label: "Student Affairs",
    description: "Student record creation, bulk upload, enrollment reporting",
  },
  {
    slug: "academic-affairs",
    label: "Academic Affairs",
    description: "Programs, majors, semesters, course registration, timetables",
  },
  {
    slug: "teacher",
    label: "Teacher",
    description: "Attendance, assignments, grading, exam papers",
  },
  {
    slug: "controller-of-examination",
    label: "Controller of Examination",
    description: "Exam scheduling, grade approval, results, transcripts, graduation",
  },
  {
    slug: "student",
    label: "Student",
    description: "Timetable, attendance, grades, exams, transcript requests",
  },
  {
    slug: "principal",
    label: "Principal",
    description: "Institutional analytics and reporting dashboards",
  },
  {
    slug: "admin",
    label: "Admin",
    description: "Account management, audit log",
  },
];
