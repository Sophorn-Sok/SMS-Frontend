import type { RoleSlug } from "./roles";

export interface Feature {
  id: string;
  name: string;
  covers: string;
  path: string;
}

export const authFeatures: Feature[] = [
  { id: "2.4", name: "Sign In", covers: "Sign in", path: "/sign-in" },
  { id: "2.4", name: "Sign Up", covers: "Sign up", path: "/sign-up" },
  {
    id: "2.4",
    name: "Forgot Password",
    covers: "Forget password",
    path: "/forgot-password",
  },
];

export const roleFeatures: Record<RoleSlug, Feature[]> = {
  "student-affairs": [
    {
      id: "3.1.1",
      name: "Student Management",
      covers: "List, search, view/create student records",
      path: "/student-affairs/students",
    },
    {
      id: "3.1.2",
      name: "Student Enrollment",
      covers:
        "Add student form, bulk document upload, assign student ID & save",
      path: "/student-affairs/enrollment",
    },
    {
      id: "3.1.3",
      name: "Enrollment Reporting",
      covers: "Generate & send enrollment report to Principal",
      path: "/student-affairs/enrollment-reports",
    },
  ],
  "academic-affairs": [
    {
      id: "3.2.1",
      name: "Academic Program Setup",
      covers: "Assign program by academic year, assign major, assign semester",
      path: "/academic-affairs/program-setup",
    },
    {
      id: "3.2.2",
      name: "Course Registration & Scheduling",
      covers: "Register courses, generate timetable, publish schedule",
      path: "/academic-affairs/course-registration",
    },
  ],
  teacher: [
    {
      id: "4.1",
      name: "Teacher Classroom",
      covers: "Dashboard, assigned courses, today's classes, take attendance",
      path: "/teacher",
    },
    {
      id: "4.2",
      name: "Assignment & Grading",
      covers: "Create assignment, enter & submit grades",
      path: "/teacher/assignments",
    },
    {
      id: "4.3",
      name: "Teacher Exam Paper",
      covers:
        "Create/submit/correct exam paper, submit score, calculate final score",
      path: "/teacher/exam-papers",
    },
  ],
  "controller-of-examination": [
    {
      id: "5.1",
      name: "Exam Setup",
      covers:
        "Create exam, receive exam paper, assign room & invigilator, publish exam schedule",
      path: "/controller-of-examination/exam-setup",
    },
    {
      id: "5.2",
      name: "Grading Oversight",
      covers: "Receive & approve grades, publish results",
      path: "/controller-of-examination/grading-oversight",
    },
    {
      id: "5.3",
      name: "Transcript & Graduation Reporting",
      covers: "Generate transcript, generate & send graduation report",
      path: "/controller-of-examination/transcript-graduation",
    },
  ],
  student: [
    {
      id: "6.1",
      name: "Student Self-Service",
      covers: "View timetable, attendance, assigned coursework",
      path: "/student",
    },
    {
      id: "6.2",
      name: "Student Exam & Results",
      covers: "Take exam, view grades, request transcript",
      path: "/student/exams-results",
    },
    {
      id: "6.3",
      name: "Student Graduation Status",
      covers: "View graduation status",
      path: "/student/graduation-status",
    },
  ],
  principal: [
    {
      id: "7.1",
      name: "Principal Analytics Dashboard",
      covers:
        "University analytics, enrollment/graduation reports, performance dashboard, download report",
      path: "/principal",
    },
  ],
  admin: [
    {
      id: "8.1",
      name: "Manage User Accounts",
      covers: "Manage user accounts",
      path: "/admin/accounts",
    },
    {
      id: "8.1",
      name: "Audit Log",
      covers: "View audit log",
      path: "/admin/audit-log",
    },
  ],
};
