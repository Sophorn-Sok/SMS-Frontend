"use client";

import { useState } from "react";
import { MetricStatCard } from "@/components/metric-stat-card";
import { StatusBadge, type StatusTone } from "@/components/status-badge";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  GraduationCapIcon,
  InfoIcon,
  PrinterIcon,
  SearchIcon,
  SendIcon,
  ShieldCheckIcon,
  XCircleIcon,
} from "@/components/icons";
import {
  eligibilityList,
  graduationDepartments,
  transcripts,
  type ClearanceState,
  type EligibilityRow,
} from "@/lib/coe/transcript-data";

const eligibilityStatusTone: Record<EligibilityRow["status"], StatusTone> = {
  ELIGIBLE: "green",
  HOLD: "rose",
  VERIFYING: "amber",
};

function ClearanceIcon({ state }: { state: ClearanceState }) {
  if (state === "clear") return <CheckCircleIcon className="h-5 w-5 text-emerald-600" />;
  if (state === "hold") return <XCircleIcon className="h-5 w-5 text-rose-600" />;
  return (
    <span className="flex items-center gap-0.5 text-amber-500">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
    </span>
  );
}

function downloadEligibilityCsv() {
  const header = [
    "Student Name",
    "Roll No.",
    "Program",
    "Credits Earned",
    "Credits Total",
    "Financial Clearance",
    "Library Dues",
    "Status",
  ];
  const rows = eligibilityList.map((r) => [
    r.name,
    r.rollNo,
    r.program,
    String(r.creditsEarned),
    String(r.creditsTotal),
    r.financialClearance,
    r.libraryDues,
    r.status,
  ]);
  const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "graduation-eligibility.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function TranscriptGraduationReportingPage() {
  const [searchValue, setSearchValue] = useState("AD-2024-8839");
  const [activeRoll, setActiveRoll] = useState("AD-2024-8839");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [reportSent, setReportSent] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [page, setPage] = useState(1);

  const transcript = transcripts[activeRoll];

  function handleSelectStudent() {
    const match = transcripts[searchValue.trim().toUpperCase()];
    if (!match) {
      setSearchError("No transcript found for that name or roll number.");
      return;
    }
    setSearchError(null);
    setActiveRoll(match.rollNumber);
  }

  function handleSendToPrincipal() {
    setReportSent(true);
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 4000);
  }

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricStatCard
          label="TOTAL ELIGIBLE STUDENTS"
          value="1,248"
          trend="+12%"
          progress={72}
        />
        <MetricStatCard
          label="TRANSCRIPTS PENDING"
          value="84"
          trend="Critical"
          trendClassName="text-amber-600"
          progress={34}
          progressClassName="bg-amber-500"
        />
        <MetricStatCard
          label="AVG. COMPLETION RATE"
          value="94.2%"
          trend="Stable"
          progress={94}
          progressClassName="bg-emerald-600"
        />
        <MetricStatCard
          label="REPORTS DISPATCHED"
          value="12/15"
          trend="Depts"
          trendClassName="text-stone-400"
          progress={80}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Transcript Generation</h2>
              <p className="text-sm text-stone-500">
                Generate verified academic records with digital seals.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={downloadEligibilityCsv}
                className="flex items-center gap-2 rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
              >
                <DownloadIcon className="h-4 w-4" />
                Export CSV
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-rose-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
              >
                <DownloadIcon className="h-4 w-4" />
                Bulk Transcripts (PDF)
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-500">
                Search Student Name / Roll Number
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2.5">
                <SearchIcon className="h-4 w-4 shrink-0 text-stone-400" />
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={handleSelectStudent}
                  className="shrink-0 text-sm font-semibold text-rose-700 hover:underline"
                >
                  Select Student
                </button>
              </div>
              {searchError && <p className="mt-1 text-xs text-rose-600">{searchError}</p>}
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-500">
                Select Semester/Year
              </label>
              <div className="relative">
                <select className="w-full appearance-none rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400">
                  <option>Consolidated (Final)</option>
                  <option>Semester 1</option>
                  <option>Semester 2</option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              </div>
            </div>
          </div>

          {transcript && (
            <div className="mt-6 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/30 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                    <GraduationCapIcon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-lg font-bold text-stone-900">Academic Nexus University</p>
                    <p className="text-sm text-stone-500">Official Provisional Transcript</p>
                  </div>
                </div>
                <div className="text-right text-sm text-stone-500">
                  <p>SR No: AN-TR-2024-00128</p>
                  <p>Date: Oct 24, 2024</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-stone-500">
                    Student Name
                  </p>
                  <p className="font-bold text-stone-900">{transcript.studentName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-stone-500">
                    Program
                  </p>
                  <p className="font-bold text-stone-900">{transcript.program}</p>
                </div>
              </div>

              <table className="mt-6 w-full text-left text-sm">
                <thead>
                  <tr className="text-xs font-bold uppercase tracking-wide text-stone-500">
                    <th className="py-2">Course Code</th>
                    <th className="py-2">Subject Title</th>
                    <th className="py-2">Credits</th>
                    <th className="py-2">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100">
                  {transcript.courses.map((course) => (
                    <tr key={course.code}>
                      <td className="py-3 text-stone-700">{course.code}</td>
                      <td className="py-3 text-stone-700">{course.title}</td>
                      <td className="py-3 text-stone-700">{course.credits.toFixed(1)}</td>
                      <td className="py-3 font-bold text-rose-700">{course.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 flex items-center justify-between border-t border-rose-200 pt-4">
                <p className="font-bold text-stone-900">Cumulative GPA:</p>
                <p className="text-xl font-extrabold text-rose-700">{transcript.gpa}</p>
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wide text-rose-700">
                Graduation Report
              </h3>
              <StatusBadge
                label={reportSent ? "Sent" : "Pending Approval"}
                tone={reportSent ? "green" : "amber"}
              />
            </div>
            <p className="mt-1 text-sm text-stone-500">Cohort: Spring 2024</p>
            <ul className="mt-4 space-y-4">
              {graduationDepartments.map((dept) => (
                <li key={dept.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-stone-700">{dept.label}</span>
                    <span className="font-bold text-stone-900">
                      {dept.completed} / {dept.total}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-rose-700"
                      style={{ width: `${(dept.completed / dept.total) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
              <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                All departmental data has been aggregated. Final verification
                required before Principal sign-off.
              </span>
            </div>
            <button
              type="button"
              onClick={handleSendToPrincipal}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-rose-800 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
            >
              <SendIcon className="h-4 w-4" />
              Send to Principal
            </button>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-rose-800 p-6 text-white">
            <ShieldCheckIcon className="pointer-events-none absolute -bottom-4 -right-4 h-28 w-28 text-rose-700/60" />
            <p className="relative text-xs font-bold uppercase tracking-wide text-rose-100">
              System Health
            </p>
            <p className="relative mt-2 text-3xl font-extrabold">100% Reliable</p>
            <p className="relative mt-1 text-sm text-rose-100">
              Blockchain Verification Active
            </p>
          </div>
        </aside>
      </div>

      <section className="mt-6 rounded-2xl border border-stone-200 bg-white">
        <div className="flex items-center justify-between border-b border-stone-200 p-6">
          <h2 className="text-lg font-bold text-rose-700">
            Graduation Eligibility &amp; Verification List
          </h2>
          <div className="flex items-center gap-4 text-sm text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Verified
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Pending
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wide text-stone-400">
                <th className="px-6 py-3">Student Details</th>
                <th className="px-6 py-3">Roll No.</th>
                <th className="px-6 py-3">Credits Earned</th>
                <th className="px-6 py-3">Financial Clearance</th>
                <th className="px-6 py-3">Library Dues</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {eligibilityList.map((row) => (
                <tr key={row.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${row.avatarColorClassName}`}
                      >
                        {row.initials}
                      </span>
                      <div>
                        <p className="font-semibold text-stone-800">{row.name}</p>
                        <p className="text-xs text-stone-400">{row.program}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-stone-600">{row.rollNo}</td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        row.creditsEarned < row.creditsTotal
                          ? "font-semibold text-amber-600"
                          : "text-stone-700"
                      }
                    >
                      {row.creditsEarned}
                    </span>
                    <span className="text-stone-400"> / {row.creditsTotal}</span>
                  </td>
                  <td className="px-6 py-4">
                    <ClearanceIcon state={row.financialClearance} />
                  </td>
                  <td className="px-6 py-4">
                    <ClearanceIcon state={row.libraryDues} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge label={row.status} tone={eligibilityStatusTone[row.status]} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      disabled={row.status === "HOLD"}
                      aria-label="Print transcript"
                      className="text-rose-700 hover:text-rose-900 disabled:text-stone-300"
                    >
                      <PrinterIcon className="ml-auto h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 px-6 py-4 text-sm">
          <p className="text-stone-500">
            Showing 1-{eligibilityList.length} of 1,248 eligible students
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-stone-200 p-1.5 text-stone-500"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`rounded-lg px-3 py-1.5 font-semibold ${
                  p === page ? "bg-rose-800 text-white" : "text-stone-600 hover:bg-stone-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(3, p + 1))}
              className="rounded-lg border border-stone-200 p-1.5 text-stone-500"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-emerald-600 px-5 py-4 text-white shadow-xl">
          <CheckCircleIcon className="h-6 w-6 shrink-0" />
          <div>
            <p className="font-semibold">Report Dispatched</p>
            <p className="text-sm text-emerald-50">
              Spring 2024 Graduation Report sent to Principal&apos;s desk.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
