"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import {
  CalendarArrowIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DownloadIcon,
  QuizIcon,
  TrendUpIcon,
} from "@/components/icons";
import {
  examStats,
  gradeDistribution,
  resultsHistory,
  upcomingExams,
} from "@/lib/student/exams-data";

export default function StudentExamResultsPage() {
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [startedExamId, setStartedExamId] = useState<string | null>(null);

  function handleRequestTranscript() {
    setRequestMessage(
      "Transcript request submitted. You'll receive it via email within 2 business days.",
    );
    window.setTimeout(() => setRequestMessage(null), 5000);
  }

  function handleStartExam(id: string) {
    setStartedExamId(id);
  }

  return (
    <div>
      <PageHeader
        title="Exams & Results"
        description="Manage your academic assessments and track your performance progress."
        actions={
          <>
            <button
              type="button"
              onClick={handleRequestTranscript}
              className="flex items-center gap-2 rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
            >
              <DownloadIcon className="h-4 w-4" />
              Request Transcript
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
            >
              <QuizIcon className="h-4 w-4" />
              Take Exam
            </button>
          </>
        }
      />

      {requestMessage && (
        <p className="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {requestMessage}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-wide text-stone-500">
                Current GPA
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
                <TrendUpIcon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-rose-700">{examStats.gpa}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-wide text-stone-500">
                Credits Earned
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                <CheckCircleIcon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-stone-900">
              {examStats.creditsEarned} / {examStats.creditsTotal}
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-wide text-stone-500">
                Upcoming Exams
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <CalendarArrowIcon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-stone-900">
              {String(examStats.upcomingExams).padStart(2, "0")}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">Grade Distribution</h2>
            <div className="relative">
              <select className="appearance-none rounded-lg border border-stone-200 bg-white py-1.5 pl-3 pr-8 text-sm font-medium text-stone-700 outline-none focus:border-rose-400">
                <option>Semester 1, 2023</option>
                <option>Semester 2, 2023</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            </div>
          </div>
          <ul className="mt-5 space-y-4">
            {gradeDistribution.map((band) => (
              <li key={band.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-700">{band.label}</span>
                  <span className="font-bold text-stone-900">{band.percent}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-stone-100">
                  <div
                    className={`h-full rounded-full ${band.colorClassName}`}
                    style={{ width: `${band.percent}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-stone-200 bg-white">
        <div className="flex items-center justify-between border-b border-stone-200 p-6">
          <h2 className="text-lg font-bold text-stone-900">Active &amp; Upcoming Exams</h2>
          <StatusBadge label="Fall Semester 2024" tone="rose" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wide text-stone-400">
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Date &amp; Time</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {upcomingExams.map((exam) => (
                <tr key={exam.id}>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-stone-900">{exam.subject}</p>
                    <p className="text-sm text-stone-500">{exam.code}</p>
                  </td>
                  <td className="px-6 py-4 text-stone-600">
                    {exam.date}
                    <br />
                    <span className={exam.isActiveNow ? "font-semibold text-rose-700" : ""}>
                      {exam.timeLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-stone-600">{exam.duration}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${exam.typeColorClassName}`}
                    >
                      {exam.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {exam.locked ? (
                      <button
                        type="button"
                        disabled
                        title="Available at the scheduled time"
                        className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-400"
                      >
                        Locked
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartExam(exam.id)}
                        className="rounded-lg bg-rose-800 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-900"
                      >
                        {startedExamId === exam.id ? "Redirecting..." : "Start Now"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-4 text-lg font-bold text-stone-900">Semester Results History</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {resultsHistory.map((semester) => (
            <div key={semester.id} className="rounded-2xl border border-stone-200 bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-stone-900">{semester.semester}</p>
                  <p className="text-sm text-stone-500">{semester.completedDate}</p>
                </div>
                <StatusBadge label={`GPA ${semester.gpa}`} tone="green" />
              </div>
              <ul className="mt-4 space-y-2">
                {semester.courses.map((course) => (
                  <li
                    key={course.id}
                    className="flex items-center justify-between text-sm text-stone-700"
                  >
                    {course.name}
                    <span className="font-bold text-rose-700">{course.grade}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-4 text-sm font-semibold text-rose-700 hover:underline"
              >
                View Detailed Report
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
