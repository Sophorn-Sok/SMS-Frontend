"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  EditIcon,
  FlaskIcon,
  QuizIcon,
} from "@/components/icons";
import {
  academicStanding,
  attendance,
  coursework,
  facultyContacts,
  noticeBoard,
  timetableDays,
  timetableEvents,
  timetableSlots,
  todayIndex,
  type CourseworkItem,
} from "@/lib/student/dashboard-data";
import { resultsHistory } from "@/lib/student/exams-data";

const courseworkIcons: Record<CourseworkItem["icon"], typeof FlaskIcon> = {
  flask: FlaskIcon,
  quiz: QuizIcon,
  edit: EditIcon,
};

function downloadTranscript() {
  const lines = ["Unofficial Transcript Summary", ""];
  for (const semester of resultsHistory) {
    lines.push(`${semester.semester} (${semester.completedDate}) — GPA ${semester.gpa}`);
    for (const course of semester.courses) {
      lines.push(`  ${course.name}: ${course.grade}`);
    }
    lines.push("");
  }
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "unofficial-transcript.txt";
  link.click();
  URL.revokeObjectURL(url);
}

export default function StudentDashboard() {
  const [week, setWeek] = useState(0);
  const weekLabels = ["Oct 23 - Oct 29", "Oct 30 - Nov 5"];

  const ringDegrees = (attendance.percent / 100) * 360;

  return (
    <div>
      <PageHeader
        title="Student Dashboard"
        description="Welcome back, Alex. You have 3 assignments due this week."
        actions={
          <>
            <button
              type="button"
              className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
            >
              View Full Profile
            </button>
            <button
              type="button"
              onClick={downloadTranscript}
              className="rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
            >
              Download Transcript
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500">
              Attendance Tracking
            </h2>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
              <CheckCircleIcon className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-6 flex flex-col items-center">
            <div
              className="flex h-40 w-40 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#9f1239 ${ringDegrees}deg, #f3d9de ${ringDegrees}deg)`,
              }}
            >
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-3xl font-extrabold text-stone-900">
                  {attendance.percent}%
                </span>
                <span className="text-xs font-semibold text-stone-400">PRESENT</span>
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-stone-900">{attendance.label}</p>
            <p className="text-sm text-stone-500">
              {attendance.attended}/{attendance.total} Lectures attended
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-4 text-sm">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              On Track
            </span>
            <span className="font-semibold text-emerald-600">{attendance.trend}</span>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500">
              Assigned Coursework
            </h2>
            <Link href="#" className="text-sm font-semibold text-rose-700 hover:underline">
              View All →
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-stone-100">
            {coursework.map((item) => {
              const Icon = courseworkIcons[item.icon];
              return (
                <li key={item.id} className="flex items-center gap-4 py-4">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconColorClassName}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-stone-900">{item.title}</p>
                    <p className="text-sm text-stone-500">{item.courseLabel}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-rose-700">{item.dueLabel}</p>
                    <p className="text-xs text-stone-400">{item.dueDate}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${item.badgeColorClassName}`}
                  >
                    {item.badge}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500">
            Weekly Timetable
          </h2>
          <div className="flex items-center gap-3 text-sm font-semibold text-stone-600">
            <button
              type="button"
              onClick={() => setWeek((w) => Math.max(0, w - 1))}
              aria-label="Previous week"
              className="text-stone-400 hover:text-stone-600"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            {weekLabels[week]}
            <button
              type="button"
              onClick={() => setWeek((w) => Math.min(weekLabels.length - 1, w + 1))}
              aria-label="Next week"
              className="text-stone-400 hover:text-stone-600"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="w-24 border-b border-stone-200 py-3" />
                {timetableDays.map((day, i) => (
                  <th
                    key={day}
                    className={`border-b border-l border-stone-200 px-3 py-3 text-sm font-semibold ${
                      i === todayIndex ? "bg-rose-50 text-rose-800" : "text-stone-700"
                    }`}
                  >
                    {day}
                    {i === todayIndex && " (Today)"}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timetableSlots.map((slot) => (
                <tr key={slot}>
                  <td className="border-b border-stone-200 px-2 py-4 align-top text-xs font-semibold text-stone-500">
                    {slot}
                  </td>
                  {timetableDays.map((day, i) => {
                    const event = timetableEvents.find(
                      (e) => e.day === day && e.slot === slot,
                    );
                    return (
                      <td
                        key={day}
                        className={`relative h-20 border-b border-l border-stone-200 p-1.5 align-top ${
                          i === todayIndex ? "bg-rose-50/40" : ""
                        }`}
                      >
                        {i === todayIndex && slot === "12:00 PM" && (
                          <div className="absolute left-0 right-0 top-1/2 z-10 flex items-center">
                            <span className="h-2.5 w-2.5 -translate-x-1 rounded-full bg-rose-700" />
                            <span className="h-px flex-1 bg-rose-700" />
                          </div>
                        )}
                        {event && (
                          <div
                            className={`h-full rounded-md border-l-4 px-2.5 py-2 text-xs ${event.colorClassName}`}
                          >
                            <p className="font-bold">{event.title}</p>
                            {event.location && (
                              <p className="mt-0.5 opacity-80">{event.location}</p>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500">
            Faculty Contacts
          </h2>
          <ul className="mt-4 space-y-3">
            {facultyContacts.map((contact) => (
              <li key={contact.id} className="flex items-center gap-3">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${contact.colorClassName}`}
                >
                  {contact.initials}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-stone-900">{contact.name}</p>
                  <p className="text-sm text-stone-500">{contact.role}</p>
                </div>
                <a
                  href={`mailto:${contact.email}`}
                  aria-label={`Email ${contact.name}`}
                  className="text-rose-700 hover:text-rose-900"
                >
                  <EnvelopeIcon className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl bg-rose-50 p-4">
            <p className="text-sm font-bold text-rose-700">Notice Board</p>
            <p className="mt-1 text-sm text-stone-600">{noticeBoard}</p>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl bg-rose-800 p-6 text-white">
          <p className="text-sm font-bold uppercase tracking-wide text-rose-100">
            Academic Standing
          </p>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-5xl font-extrabold">{academicStanding.gpa}</span>
            <span className="rounded-full bg-rose-700 px-4 py-1.5 text-sm font-semibold">
              Cumulative GPA
            </span>
          </div>
          <div className="mt-14 flex items-center justify-between text-sm font-bold uppercase tracking-wide text-rose-200">
            {academicStanding.yearMarkers.map((marker, i) => (
              <span
                key={marker}
                className={
                  i === academicStanding.currentYearIndex
                    ? "text-white"
                    : "text-rose-300"
                }
              >
                {marker}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
