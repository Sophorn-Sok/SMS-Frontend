"use client";

import { useState } from "react";
import { StatusBadge, type StatusTone } from "@/components/status-badge";
import {
  DownloadIcon,
  FilterIcon,
  SendIcon,
  ShieldCheckIcon,
} from "@/components/icons";
import {
  pendingCourses as initialPendingCourses,
  type GradeRow,
  type PendingCourse,
} from "@/lib/coe/grading-oversight-data";

const gradeStatusTone: Record<GradeRow["status"], StatusTone> = {
  Verified: "green",
  Flagged: "amber",
};

function downloadCsv(course: PendingCourse) {
  const header = ["Student Name", "Student ID", "Internal", "External", "Final Score", "Grade", "Status"];
  const rows = course.roster.map((s) => [
    s.name,
    s.studentId,
    String(s.internal),
    String(s.external),
    String(s.internal + s.external),
    s.grade,
    s.status,
  ]);
  const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${course.code}-grades.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function GradingOversightPage() {
  const [courses, setCourses] = useState(initialPendingCourses);
  const [selectedId, setSelectedId] = useState(courses[0].id);
  const [publishedIds, setPublishedIds] = useState<Set<string>>(new Set());

  const selected = courses.find((c) => c.id === selectedId) ?? courses[0];
  const isPublished = publishedIds.has(selected.id);
  const flaggedCount = selected.roster.filter((s) => s.status === "Flagged").length;

  const maxScore = Math.max(1, ...selected.roster.map((s) => s.internal + s.external));

  function toggleStatus(studentId: string) {
    setCourses((prev) =>
      prev.map((c) =>
        c.id !== selected.id
          ? c
          : {
              ...c,
              roster: c.roster.map((s) =>
                s.id === studentId
                  ? { ...s, status: s.status === "Verified" ? "Flagged" : "Verified" }
                  : s,
              ),
            },
      ),
    );
  }

  function verifyAllRemaining() {
    setCourses((prev) =>
      prev.map((c) =>
        c.id !== selected.id
          ? c
          : { ...c, roster: c.roster.map((s) => ({ ...s, status: "Verified" })) },
      ),
    );
  }

  function publishResults() {
    if (flaggedCount > 0) return;
    setPublishedIds((prev) => new Set(prev).add(selected.id));
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-rose-800">
          Grading Oversight
        </h1>
        <p className="mt-1.5 text-stone-500">
          Review, verify, and authorize the publication of academic results for
          the Spring 2024 Semester.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        <section className="h-fit rounded-2xl border border-stone-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-stone-900">
              Pending Approvals ({courses.length})
            </h2>
            <StatusBadge label="High Priority" tone="rose" />
          </div>
          <ul className="space-y-3">
            {courses.map((course) => {
              const active = course.id === selected.id;
              return (
                <li key={course.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(course.id)}
                    className={`w-full rounded-xl border-l-4 p-4 text-left transition-colors ${
                      active
                        ? "border-rose-700 bg-rose-50"
                        : "border-transparent hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-rose-700">{course.code}</span>
                      <span className="text-stone-400">{course.meta}</span>
                    </div>
                    <p className="mt-1 font-semibold text-stone-900">{course.title}</p>
                    <p className="text-sm text-stone-500">{course.instructor}</p>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="rounded-full bg-stone-100 px-2.5 py-0.5 font-semibold text-stone-600">
                        {course.studentCount} Students
                      </span>
                      <span
                        className={
                          course.reviewState === "In Review"
                            ? "font-semibold text-amber-600"
                            : "text-stone-400"
                        }
                      >
                        {course.reviewState}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-rose-50 px-3 py-1 text-sm font-bold text-rose-700">
                  {selected.code}
                </span>
                <h2 className="text-xl font-bold text-stone-900">{selected.title}</h2>
              </div>
              {selected.roster.length > 0 && (
                <div className="flex h-10 items-end gap-1">
                  {selected.roster.map((s) => (
                    <div
                      key={s.id}
                      className="w-4 rounded-t bg-rose-300"
                      style={{
                        height: `${((s.internal + s.external) / maxScore) * 100}%`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            {selected.roster.length > 0 && (
              <p className="mt-2 text-sm text-stone-500">
                Batch: {selected.batch} • Mean Score: {selected.meanScore}{" "}
                <span className="text-emerald-600 font-semibold">
                  • {selected.verifiedPercent}% Verified
                </span>
              </p>
            )}
          </div>

          <section className="rounded-2xl border border-stone-200 bg-white">
            <div className="flex items-center justify-between border-b border-stone-200 p-6">
              <h2 className="text-lg font-bold text-stone-900">Student Grade List</h2>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-sm font-semibold text-stone-500 hover:text-stone-700"
                >
                  <FilterIcon className="h-4 w-4" />
                  Filter
                </button>
                <button
                  type="button"
                  onClick={() => downloadCsv(selected)}
                  disabled={selected.roster.length === 0}
                  className="flex items-center gap-1.5 text-sm font-semibold text-stone-500 hover:text-stone-700 disabled:opacity-40"
                >
                  <DownloadIcon className="h-4 w-4" />
                  Export CSV
                </button>
              </div>
            </div>

            {selected.roster.length === 0 ? (
              <p className="p-10 text-center text-sm text-stone-400">
                Grades have not been submitted for this course yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs font-bold uppercase tracking-wide text-stone-400">
                      <th className="px-6 py-3">Student Details</th>
                      <th className="px-6 py-3">Internal (40)</th>
                      <th className="px-6 py-3">External (60)</th>
                      <th className="px-6 py-3">Final Score</th>
                      <th className="px-6 py-3">Grade</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {selected.roster.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${student.avatarColorClassName}`}
                            >
                              {student.initials}
                            </span>
                            <div>
                              <p className="font-semibold text-stone-800">{student.name}</p>
                              <p className="text-xs text-stone-400">ID: {student.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-stone-700">{student.internal}</td>
                        <td className="px-6 py-4 text-stone-700">{student.external}</td>
                        <td className="px-6 py-4 font-bold text-stone-900">
                          {student.internal + student.external}
                        </td>
                        <td className="px-6 py-4 font-bold text-rose-700">{student.grade}</td>
                        <td className="px-6 py-4">
                          <button type="button" onClick={() => toggleStatus(student.id)}>
                            <StatusBadge
                              label={`• ${student.status}`}
                              tone={gradeStatusTone[student.status]}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selected.roster.length > 0 && (
              <div className="flex flex-wrap items-center gap-4 border-t border-stone-200 p-6">
                <button
                  type="button"
                  onClick={verifyAllRemaining}
                  disabled={flaggedCount === 0}
                  className="flex items-center gap-2 rounded-lg border border-rose-300 px-5 py-2.5 text-sm font-semibold text-rose-800 hover:bg-rose-50 disabled:opacity-40"
                >
                  <ShieldCheckIcon className="h-4 w-4" />
                  Verify All Remaining
                </button>
                {flaggedCount > 0 && (
                  <p className="flex items-center gap-1.5 text-sm text-stone-500">
                    ⓘ {flaggedCount} record{flaggedCount > 1 ? "s" : ""} still
                    require{flaggedCount === 1 ? "s" : ""} manual verification.
                  </p>
                )}
              </div>
            )}
          </section>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-6">
            <button type="button" className="text-sm font-semibold text-stone-500 hover:text-stone-700">
              Save Draft
            </button>
            <button
              type="button"
              onClick={publishResults}
              disabled={flaggedCount > 0 || selected.roster.length === 0}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors ${
                flaggedCount > 0 || selected.roster.length === 0
                  ? "bg-rose-300"
                  : "bg-rose-800 hover:bg-rose-900"
              }`}
            >
              <SendIcon className="h-4 w-4" />
              {isPublished ? "Results Published" : "Publish Results"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
