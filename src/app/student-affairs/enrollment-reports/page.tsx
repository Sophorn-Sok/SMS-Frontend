"use client";

import { useMemo, useState } from "react";
import { MetricStatCard } from "@/components/metric-stat-card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge, type StatusTone } from "@/components/status-badge";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  FunnelIcon,
  HistoryIcon,
  MoreVerticalIcon,
  SendIcon,
} from "@/components/icons";
import {
  enrollmentRows,
  enrollmentTrend,
  initialSentReports,
  type EnrollmentRow,
  type SentReport,
} from "@/lib/student-affairs/enrollment-reports";

const PAGE_SIZE = 4;

const reportStatusTone: Record<SentReport["status"], StatusTone> = {
  Delivered: "green",
  Pending: "rose",
};

const enrollmentStatusTone: Record<EnrollmentRow["status"], StatusTone> = {
  Verified: "rose",
  "Pending Docs": "amber",
};

function downloadCsv(rows: EnrollmentRow[]) {
  const header = ["Student Name", "Enrollment ID", "Department", "Date", "Status"];
  const lines = rows.map((r) => [
    r.name,
    r.enrollmentId,
    r.department,
    r.date,
    r.status,
  ]);
  const csv = [header, ...lines]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "enrollment-report.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function EnrollmentReportingPage() {
  const [page, setPage] = useState(1);
  const [sentReports, setSentReports] = useState<SentReport[]>(initialSentReports);
  const [isSending, setIsSending] = useState(false);

  const totalPages = Math.ceil(enrollmentRows.length / PAGE_SIZE);
  const pagedRows = useMemo(
    () => enrollmentRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [page],
  );

  const maxTrendValue = Math.max(
    ...enrollmentTrend.flatMap((m) => [m.current, m.lastYear]),
  );

  function handleSendToPrincipal() {
    if (isSending) return;
    setIsSending(true);
    const newReport: SentReport = {
      id: `r-${Date.now()}`,
      title: "Enrollment Analysis Report",
      status: "Pending",
      meta: "Sent to Dr. Aris Thorne • Just now",
    };
    setSentReports((prev) => [newReport, ...prev]);
    window.setTimeout(() => {
      setSentReports((prev) =>
        prev.map((r) =>
          r.id === newReport.id ? { ...r, status: "Delivered" } : r,
        ),
      );
      setIsSending(false);
    }, 1200);
  }

  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: "Reports", href: "/student-affairs/enrollment-reports" },
          { label: "Enrollment Reporting" },
        ]}
        separator=">"
        title="Enrollment Analysis"
        description="Analyze institutional growth and generate administrative reports."
        actions={
          <>
            <button
              type="button"
              onClick={() => downloadCsv(enrollmentRows)}
              className="flex items-center gap-2 rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
            >
              <DownloadIcon className="h-4 w-4" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={handleSendToPrincipal}
              disabled={isSending}
              className="flex items-center gap-2 rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900 disabled:opacity-60"
            >
              <SendIcon className="h-4 w-4" />
              {isSending ? "Sending..." : "Send to Principal"}
            </button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricStatCard
          label="Total Enrolled"
          value="1,284"
          trend="↗ 12%"
          progress={78}
        />
        <MetricStatCard
          label="New Registrations"
          value="342"
          trend="↗ 5.4%"
          progress={45}
        />
        <MetricStatCard
          label="Target Completion"
          value="92%"
          trend="8% to goal"
          trendClassName="text-teal-700"
          progress={92}
          progressClassName="bg-teal-700"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-stone-900">
              Enrollment Trends (Academic Year)
            </h2>
            <div className="flex items-center gap-4 text-sm text-stone-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-800" />
                Current
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-200" />
                Last Year
              </span>
            </div>
          </div>
          <div className="flex h-56 items-end justify-between gap-4 border-b border-stone-200 px-2">
            {enrollmentTrend.map((m) => (
              <div
                key={m.month}
                className="flex h-full flex-1 items-end justify-center gap-1.5"
              >
                <div
                  className="w-6 rounded-t-md bg-rose-200"
                  style={{ height: `${(m.lastYear / maxTrendValue) * 100}%` }}
                />
                <div
                  className="w-6 rounded-t-md bg-rose-800"
                  style={{ height: `${(m.current / maxTrendValue) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between px-2 text-sm text-stone-500">
            {enrollmentTrend.map((m) => (
              <span key={m.month} className="flex-1 text-center">
                {m.month}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">
              Recent Sent Reports
            </h2>
            <HistoryIcon className="h-5 w-5 text-stone-400" />
          </div>
          <ul className="divide-y divide-stone-100">
            {sentReports.map((report) => (
              <li key={report.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-stone-800">
                    {report.title}
                  </p>
                  <StatusBadge
                    label={report.status}
                    tone={reportStatusTone[report.status]}
                  />
                </div>
                <p className="mt-1 text-xs text-stone-400">{report.meta}</p>
              </li>
            ))}
          </ul>
          <a
            href="#"
            className="mt-4 inline-block text-sm font-semibold text-rose-700 hover:underline"
          >
            View Full Log
          </a>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-stone-200 bg-white">
        <div className="flex items-center justify-between border-b border-stone-200 p-5">
          <h2 className="text-lg font-bold text-stone-900">
            Recent Enrollment Data
          </h2>
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-semibold text-rose-700 hover:underline"
          >
            <FunnelIcon className="h-4 w-4" />
            Filter Table
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wide text-stone-400">
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Enrollment ID</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {pagedRows.map((row) => (
                <tr key={row.id}>
                  <td className="px-5 py-4 font-semibold text-stone-800">
                    {row.name}
                  </td>
                  <td className="px-5 py-4 font-mono text-stone-600">
                    {row.enrollmentId}
                  </td>
                  <td className="px-5 py-4 text-stone-600">
                    {row.department}
                  </td>
                  <td className="px-5 py-4 text-stone-600">{row.date}</td>
                  <td className="px-5 py-4">
                    <StatusBadge
                      label={row.status}
                      tone={enrollmentStatusTone[row.status]}
                    />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      aria-label="Row actions"
                      className="text-stone-400 hover:text-stone-600"
                    >
                      <MoreVerticalIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 px-5 py-4 text-sm">
          <p className="text-stone-500">
            Showing {(page - 1) * PAGE_SIZE + 1}-
            {Math.min(page * PAGE_SIZE, enrollmentRows.length)} of 1,284
            entries
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="rounded-lg border border-stone-200 p-1.5 text-stone-500 disabled:opacity-40"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`rounded-lg px-3 py-1.5 font-semibold ${
                  p === page
                    ? "bg-rose-800 text-white"
                    : "text-stone-600 hover:bg-stone-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
              className="rounded-lg border border-stone-200 p-1.5 text-stone-500 disabled:opacity-40"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
