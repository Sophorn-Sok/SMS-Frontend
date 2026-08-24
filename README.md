# SMS-Frontend
# SMS Frontend

Frontend application for the **School Management System (SMS)** — a web platform covering the full academic lifecycle from student enrollment to graduation, across seven role-based portals: Student Affairs, Academic Affairs, Teacher, Controller of Examination, Student, Principal, and Admin.

> Status: fully frontend build in progress (no backend yet — mock data only). Tech stack below is finalized.

## Project Context

- **SRS (Software Requirements Specification):** _link here once shared with the team_
- **Database schema (Eraser ER diagram):** _link here_
- **User journey / flow diagrams:** _link here_
- **UI feature list:** _document to be added_

Refer to the SRS for the full functional requirements per role before building any screen — every dashboard is scoped to what its role is permitted to see and do (Attribute-Based Access Control).

## Tech Stack

- Framework: **Next.js 16** (App Router, TypeScript)
- Styling: **Tailwind CSS v4**
- State management: **In-memory client state** (mock JSON seed data, no persistence yet — no real backend)
- API client: _N/A for now — frontend-only, will be added once backend is available_

## Roles Covered

| Role | Portal Focus | Route |
|---|---|---|
| Student Affairs | Student record creation, bulk upload, enrollment reporting | `/student-affairs` |
| Academic Affairs | Programs, majors, semesters, course registration, timetables | `/academic-affairs` |
| Teacher | Attendance, assignments, grading, exam papers | `/teacher` |
| Controller of Examination | Exam scheduling, grade approval, results, transcripts, graduation | `/controller-of-examination` |
| Student | Self-service portal (timetable, attendance, grades, exams, transcript requests) | `/student` |
| Principal | Institutional analytics and reporting dashboards | `/principal` |
| Admin | Account management, audit log | `/admin` |

Each role is a separate top-level route with its own layout (no shared shell across roles).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

_Branching strategy, PR conventions, and code review process to be defined by the team._

## License

_TBD_
