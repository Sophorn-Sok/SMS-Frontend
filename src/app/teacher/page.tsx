"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge, type StatusTone } from "@/components/status-badge";
import {
  AlertTriangleIcon,
  CalendarIcon,
  ClockIcon,
  CloudCheckIcon,
  EnvelopeIcon,
  GraduationCapIcon,
  MapPinIcon,
  UploadCloudIcon,
  UsersIcon,
} from "@/components/icons";
import {
  assignedCourses,
  fluidMechanicsRoster,
  initialSubmissionAlerts,
  initialTodaysSchedule,
  type AttendanceStudent,
  type ScheduleItem,
  type SubmissionAlert,
} from "@/lib/teacher/dashboard-data";

const scheduleStatusTone: Record<ScheduleItem["status"], StatusTone> = {
  COMPLETED: "green",
  "IN PROGRESS": "rose",
  UPCOMING: "rose",
};

const alertIconStyles: Record<
  SubmissionAlert["kind"],
  { icon: typeof AlertTriangleIcon; className: string }
> = {
  late: { icon: AlertTriangleIcon, className: "bg-rose-600 text-white" },
  grading: { icon: CloudCheckIcon, className: "bg-emerald-600 text-white" },
  attendance: {
    icon: AlertTriangleIcon,
    className: "bg-amber-400 text-white",
  },
};

export default function TeacherDashboard() {
  const [schedule, setSchedule] = useState(initialTodaysSchedule);
  const [alerts, setAlerts] = useState(initialSubmissionAlerts);
  const [attendanceFor, setAttendanceFor] = useState<ScheduleItem | null>(
    null,
  );
  const [roster, setRoster] = useState<AttendanceStudent[]>(
    fluidMechanicsRoster,
  );
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const dateInputRef = useRef<HTMLInputElement>(null);

  const formattedDate = useMemo(
    () =>
      selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    [selectedDate],
  );

  const dateInputValue = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [selectedDate]);

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) return;
    const [y, m, d] = e.target.value.split("-").map(Number);
    setSelectedDate(new Date(y, m - 1, d));
  }

  function openDatePicker() {
    const el = dateInputRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      el.showPicker();
    } else {
      el.focus();
    }
  }

  function toggleAttendance(id: string) {
    setRoster((prev) =>
      prev.map((s) => (s.id === id ? { ...s, present: !s.present } : s)),
    );
  }

  function submitAttendance() {
    if (!attendanceFor) return;
    const presentCount = roster.filter((s) => s.present).length;
    setSchedule((prev) =>
      prev.map((item) =>
        item.id === attendanceFor.id
          ? { ...item, status: "COMPLETED" }
          : item,
      ),
    );
    setConfirmation(
      `Attendance submitted for ${attendanceFor.title}: ${presentCount}/${roster.length} present.`,
    );
    setAttendanceFor(null);
    window.setTimeout(() => setConfirmation(null), 4000);
  }

  function handleAlertAction(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div>
      <PageHeader
        title="Teacher Dashboard"
        description="Welcome back, Elena. Here's what's happening in your classroom today."
        actions={
          <div className="relative">
            <button
              type="button"
              onClick={openDatePicker}
              className="flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
            >
              <CalendarIcon className="h-4 w-4 text-rose-700" />
              {formattedDate}
            </button>
            <input
              ref={dateInputRef}
              type="date"
              value={dateInputValue}
              onChange={handleDateChange}
              aria-label="Select date"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
        }
      />

      <section className="rounded-2xl border border-stone-200 bg-white">
        <div className="flex items-center justify-between border-b border-stone-200 p-6">
          <h2 className="text-xl font-bold text-stone-900">
            Today&apos;s Schedule
          </h2>
          <Link
            href="#"
            className="text-sm font-semibold text-rose-700 hover:underline"
          >
            View Timetable
          </Link>
        </div>

        {confirmation && (
          <p className="mx-6 mt-4 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
            {confirmation}
          </p>
        )}

        <ul className="divide-y divide-stone-100">
          {schedule.map((item) => (
            <li
              key={item.id}
              className={`flex flex-wrap items-center gap-5 p-6 ${
                item.status === "IN PROGRESS"
                  ? "rounded-xl border-2 border-rose-700 m-4"
                  : ""
              }`}
            >
              <div
                className={`w-24 shrink-0 rounded-lg px-3 py-2 text-center text-sm font-bold ${
                  item.status === "IN PROGRESS"
                    ? "bg-rose-800 text-white"
                    : "bg-rose-50 text-stone-700"
                }`}
              >
                <p>{item.startTime}</p>
                <div
                  className={`my-1 h-px ${
                    item.status === "IN PROGRESS"
                      ? "bg-rose-300"
                      : "bg-rose-200"
                  }`}
                />
                <p>{item.endTime}</p>
              </div>

              <div className="min-w-[220px] flex-1">
                <p className="text-lg font-semibold text-stone-900">
                  {item.title}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <MapPinIcon className="h-4 w-4" />
                    {item.location}
                  </span>
                  {item.status === "IN PROGRESS" ? (
                    <span className="flex items-center gap-1.5 font-semibold text-rose-700">
                      <ClockIcon className="h-4 w-4" />
                      IN PROGRESS
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <UsersIcon className="h-4 w-4" />
                      {item.studentCount} Students
                    </span>
                  )}
                </div>
              </div>

              {item.status === "IN PROGRESS" ? (
                <button
                  type="button"
                  onClick={() => {
                    setRoster(fluidMechanicsRoster);
                    setAttendanceFor(item);
                  }}
                  className="rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
                >
                  Take Attendance
                </button>
              ) : (
                <StatusBadge
                  label={item.status}
                  tone={scheduleStatusTone[item.status]}
                />
              )}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-xl font-bold text-stone-900">
            Assigned Courses
          </h2>
          <ul className="mt-4 divide-y divide-stone-100">
            {assignedCourses.map((course) => (
              <li key={course.id}>
                <Link
                  href="/teacher/assignments"
                  className="flex items-center gap-4 py-4 hover:bg-stone-50"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${course.iconColorClassName}`}
                  >
                    <GraduationCapIcon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-stone-800">
                      {course.code}: {course.name}
                    </p>
                    <p className="text-sm text-stone-500">{course.meta}</p>
                  </div>
                  <span className="text-stone-300">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900">
              Submissions &amp; Alerts
            </h2>
            {alerts.length > 0 && (
              <span className="rounded-full bg-rose-700 px-3 py-1 text-xs font-bold text-white">
                {alerts.length} New
              </span>
            )}
          </div>
          <ul className="mt-4 divide-y divide-stone-100">
            {alerts.map((alert) => {
              const { icon: Icon, className } = alertIconStyles[alert.kind];
              return (
                <li key={alert.id} className="flex items-start gap-3 py-4">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${className}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-stone-800">
                        {alert.title}
                      </p>
                      <span className="shrink-0 text-xs text-stone-400">
                        {alert.meta}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-stone-500">
                      {alert.description}
                    </p>
                    {alert.kind === "late" && (
                      <div className="mt-2 flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleAlertAction(alert.id)}
                          className="rounded-md bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-200"
                        >
                          Review
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAlertAction(alert.id)}
                          className="text-xs font-semibold text-stone-500 hover:text-stone-700"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
            {alerts.length === 0 && (
              <li className="py-6 text-center text-sm text-stone-400">
                You&apos;re all caught up.
              </li>
            )}
          </ul>
          <Link
            href="#"
            className="mt-2 block text-center text-sm font-semibold text-rose-700 hover:underline"
          >
            View All Activity
          </Link>
        </section>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          type="button"
          className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 text-left hover:border-stone-300"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-700 text-white">
            <UploadCloudIcon className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-semibold text-stone-800">
              Bulk Upload
            </span>
            <span className="block text-sm text-stone-500">
              Course materials &amp; files
            </span>
          </span>
        </button>
        <Link
          href="/teacher/assignments"
          className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 text-left hover:border-stone-300"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-700 text-white">
            <GraduationCapIcon className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-semibold text-stone-800">
              Quick Grade
            </span>
            <span className="block text-sm text-stone-500">
              Rapid assessment tool
            </span>
          </span>
        </Link>
        <button
          type="button"
          className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 text-left hover:border-stone-300"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white">
            <EnvelopeIcon className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-semibold text-stone-800">
              Announcements
            </span>
            <span className="block text-sm text-stone-500">
              Notify all students
            </span>
          </span>
        </button>
      </div>

      {attendanceFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-stone-900">
              Take Attendance
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              {attendanceFor.title}
            </p>
            <ul className="mt-4 max-h-72 space-y-2 overflow-y-auto">
              {roster.map((student) => (
                <li
                  key={student.id}
                  className="flex items-center justify-between rounded-lg border border-stone-200 px-3 py-2"
                >
                  <span className="text-sm font-medium text-stone-700">
                    {student.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleAttendance(student.id)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      student.present
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {student.present ? "Present" : "Absent"}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => setAttendanceFor(null)}
                className="text-sm font-semibold text-stone-500 hover:text-stone-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitAttendance}
                className="rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
              >
                Submit Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
