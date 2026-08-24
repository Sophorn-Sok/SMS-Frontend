"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge, type StatusTone } from "@/components/status-badge";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  FileTextIcon,
  FunnelIcon,
  MoreVerticalIcon,
} from "@/components/icons";
import {
  enrollmentTrend,
  facultyPerformance,
  graduationTrend,
  overviewStats,
  reports,
  trendYears,
  type FacultyPerformanceRow,
} from "@/lib/principal/analytics-data";

const statusTone: Record<FacultyPerformanceRow["status"], StatusTone> = {
  Exceptional: "green",
  Achieved: "sky",
};

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="text-amber-400">
      {"★".repeat(full)}
      <span className="text-stone-200">{"★".repeat(5 - full)}</span>
    </span>
  );
}

function linePoints(values: number[], width: number, height: number) {
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - (v / 100) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

function downloadSummary() {
  const lines = ["Institutional Overview Summary", ""];
  for (const stat of overviewStats) lines.push(`${stat.label}: ${stat.value}`);
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "institutional-summary.txt";
  link.click();
  URL.revokeObjectURL(url);
}

function downloadReport(name: string) {
  const blob = new Blob([`This is a placeholder export for "${name}".`], {
    type: "text/plain;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name.toLowerCase().replace(/\s+/g, "-")}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

const CHART_WIDTH = 640;
const CHART_HEIGHT = 220;

export default function PrincipalAnalyticsPage() {
  const [requestMessage, setRequestMessage] = useState<string | null>(null);

  function handleRequestCustomReport() {
    setRequestMessage("Custom report request submitted to the analytics team.");
    window.setTimeout(() => setRequestMessage(null), 4000);
  }

  return (
    <div>
      <PageHeader
        title="Institutional Overview"
        description="Academic Year 2023-2024 • Q3 Performance Summary"
        actions={
          <>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
            >
              <CalendarIcon className="h-4 w-4" />
              Select Period
            </button>
            <button
              type="button"
              onClick={downloadSummary}
              className="flex items-center gap-2 rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
            >
              <DownloadIcon className="h-4 w-4" />
              Export Summary
            </button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <div key={stat.id} className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconColorClassName}`}
              >
                <stat.icon className="h-5 w-5" />
              </span>
              {stat.trend && (
                <span className="text-sm font-semibold text-emerald-600">{stat.trend}</span>
              )}
              {stat.trendNote && (
                <span className="text-sm font-semibold text-stone-500">{stat.trendNote}</span>
              )}
            </div>
            <p className="mt-4 text-sm text-stone-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-stone-900">{stat.value}</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
              <div
                className={`h-full rounded-full ${stat.progressColorClassName}`}
                style={{ width: `${stat.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">Enrollment vs. Graduation Trends</h2>
            <div className="flex items-center gap-4 text-sm text-stone-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-700" />
                Enrollment
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-700" />
                Graduation
              </span>
            </div>
          </div>
          <div className="mt-6 flex">
            <div className="flex h-[220px] flex-col justify-between pr-3 text-xs text-stone-400">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
            <div className="min-w-0 flex-1 overflow-x-auto">
              <svg
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                className="h-[220px] w-full"
                preserveAspectRatio="none"
              >
                {[0, 0.25, 0.5, 0.75, 1].map((f) => (
                  <line
                    key={f}
                    x1={0}
                    x2={CHART_WIDTH}
                    y1={CHART_HEIGHT * f}
                    y2={CHART_HEIGHT * f}
                    stroke="#e7e5e4"
                    strokeWidth={1}
                  />
                ))}
                <polyline
                  points={linePoints(enrollmentTrend, CHART_WIDTH, CHART_HEIGHT)}
                  fill="none"
                  stroke="#9f1239"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points={linePoints(graduationTrend, CHART_WIDTH, CHART_HEIGHT)}
                  fill="none"
                  stroke="#0f766e"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-2 flex justify-between text-sm text-stone-500">
                {trendYears.map((year) => (
                  <span key={year}>{year}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-bold text-stone-900">Institutional Reports</h2>
          <ul className="mt-4 space-y-3">
            {reports.map((report) => (
              <li
                key={report.id}
                className="flex items-center gap-3 rounded-xl bg-stone-50 p-3.5"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${report.colorClassName}`}
                >
                  <FileTextIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-stone-900">{report.name}</p>
                  <p className="text-sm text-stone-500">
                    {report.type} • {report.size}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => downloadReport(report.name)}
                  aria-label={`Download ${report.name}`}
                  className="shrink-0 text-stone-500 hover:text-rose-700"
                >
                  <DownloadIcon className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
          {requestMessage && (
            <p className="mt-4 text-sm font-medium text-emerald-700">{requestMessage}</p>
          )}
          <button
            type="button"
            onClick={handleRequestCustomReport}
            className="mt-4 w-full rounded-lg border border-rose-300 bg-white py-2.5 text-sm font-semibold text-rose-800 hover:bg-rose-50"
          >
            Request Custom Report
          </button>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-stone-200 bg-white">
        <div className="flex items-center justify-between border-b border-stone-200 p-6">
          <h2 className="text-xl font-bold text-stone-900">Faculty Performance Overview</h2>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800"
          >
            <FunnelIcon className="h-4 w-4" />
            All Departments
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wide text-stone-400">
                <th className="px-6 py-3">Faculty Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Publication Index</th>
                <th className="px-6 py-3">Student Rating</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {facultyPerformance.map((row) => (
                <tr key={row.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${row.avatarColorClassName}`}
                      >
                        {row.initials}
                      </span>
                      <span className="font-semibold text-stone-800">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-600">{row.department}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-stone-100">
                        <div
                          className="h-full rounded-full bg-rose-800"
                          style={{
                            width: `${(row.publicationIndex / row.maxPublicationIndex) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-stone-600">{row.publicationIndex}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Stars rating={row.studentRating} />{" "}
                    <span className="text-stone-600">{row.studentRating}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge label={row.status} tone={statusTone[row.status]} />
                  </td>
                  <td className="px-6 py-4 text-right">
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
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 px-6 py-4 text-sm">
          <p className="text-stone-500">
            Showing 1-{facultyPerformance.length} of 48 members
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Previous page"
              className="rounded-lg border border-stone-200 p-1.5 text-stone-500"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next page"
              className="rounded-lg border border-stone-200 p-1.5 text-stone-500"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
