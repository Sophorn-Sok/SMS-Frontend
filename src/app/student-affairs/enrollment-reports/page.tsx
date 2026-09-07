"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MetricStatCard } from "@/components/metric-stat-card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { LoadingRow, ErrorRow, EmptyRow } from "@/components/query-states";
import {
  CheckCircleIcon,
  DownloadIcon,
  FileTextIcon,
  PlusIcon,
  SendIcon,
  XIcon,
} from "@/components/icons";
import { apiFetch } from "@/lib/api/client";
import { useApiQuery } from "@/lib/api/hooks";
import type {
  AcademicYearDTO,
  DepartmentDTO,
  EnrollmentReportDTO,
  GenerateReportBody,
  StudentDTO,
  StudentSummaryDTO,
} from "@/lib/api/types";

function downloadCsv(rows: StudentDTO[]) {
  const header = ["Student Number", "First Name", "Last Name", "Email", "Department", "Status", "Enrollment Date"];
  const lines = rows.map((r) => [
    r.studentNumber,
    r.firstName,
    r.lastName,
    r.personalEmail || "",
    r.department?.name || "",
    r.status,
    r.enrollmentDate ? new Date(r.enrollmentDate).toLocaleDateString() : "",
  ]);
  const csv = [header, ...lines]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "enrolled-students-report.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function EnrollmentReportingPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("ALL");

  // 1. Summary Metrics
  const summaryQuery = useApiQuery<StudentSummaryDTO>(
    ["student-affairs", "summary"],
    "/student-affairs/students/summary"
  );

  // 2. Academic Years & Departments
  const academicYearsQuery = useApiQuery<AcademicYearDTO[]>(
    ["academic-years"],
    "/student-affairs/academic-years"
  );
  const departmentsQuery = useApiQuery<DepartmentDTO[]>(
    ["departments"],
    "/student-affairs/departments"
  );

  // 3. Generated Reports List
  const reportsQuery = useApiQuery<EnrollmentReportDTO[]>(
    ["student-affairs", "reports", { page }],
    "/student-affairs/enrollment-reports",
    { query: { page, limit: 10 } }
  );

  // 4. Recently Enrolled Students List (for CSV export & audit table)
  const studentsQuery = useApiQuery<StudentDTO[]>(
    ["student-affairs", "audit-students", { page }],
    "/student-affairs/students",
    { query: { page, limit: 10, status: "ENROLLED" } }
  );

  // 5. Generate Report Mutation
  const generateMutation = useMutation({
    mutationFn: (body: GenerateReportBody) =>
      apiFetch<EnrollmentReportDTO>("/student-affairs/enrollment-reports", {
        method: "POST",
        body,
      }),
    onSuccess: async () => {
      setShowGenerateModal(false);
      await queryClient.invalidateQueries({
        queryKey: ["student-affairs", "reports"],
      });
      setToastMessage("Enrollment report snapshot generated successfully.");
      setTimeout(() => setToastMessage(null), 3500);
    },
    onError: (err: Error) => {
      setToastMessage(err.message || "Failed to generate enrollment report.");
      setTimeout(() => setToastMessage(null), 4000);
    },
  });

  // 6. Send Report to Principal Mutation
  const sendMutation = useMutation({
    mutationFn: (reportId: string) =>
      apiFetch<EnrollmentReportDTO>(
        `/student-affairs/enrollment-reports/${reportId}/send`,
        { method: "PATCH" }
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["student-affairs", "reports"],
      });
      setToastMessage("Report marked as sent to the Principal.");
      setTimeout(() => setToastMessage(null), 3500);
    },
    onError: (err: Error) => {
      setToastMessage(err.message || "Failed to send report to Principal.");
      setTimeout(() => setToastMessage(null), 4000);
    },
  });

  const summary = summaryQuery.data?.data;
  const reports = reportsQuery.data?.data ?? [];
  const students = studentsQuery.data?.data ?? [];
  const academicYears = academicYearsQuery.data?.data ?? [];
  const departments = departmentsQuery.data?.data ?? [];
  const auditPagination = studentsQuery.data?.pagination;
  const totalAuditPages = Math.max(1, Math.ceil((auditPagination?.total ?? 0) / 10));

  // Default year when opening modal
  function openModal() {
    if (academicYears.length > 0 && !selectedAcademicYearId) {
      setSelectedAcademicYearId(academicYears[0].id);
    }
    setShowGenerateModal(true);
  }

  function handleCreateReport(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAcademicYearId) return;

    generateMutation.mutate({
      academicYearId: selectedAcademicYearId,
      departmentId:
        selectedDepartmentId === "ALL" ? undefined : selectedDepartmentId,
    });
  }

  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: "Reports", href: "/student-affairs/enrollment-reports" },
          { label: "Enrollment Reporting" },
        ]}
        separator=">"
        title="Enrollment Analysis & Reporting"
        description="Analyze institutional growth, generate periodic audit snapshots, and dispatch to the Principal."
        actions={
          <>
            <button
              type="button"
              onClick={() => downloadCsv(students)}
              className="flex items-center gap-2 rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
            >
              <DownloadIcon className="h-4 w-4" />
              Export Enrolled CSV
            </button>
            <button
              type="button"
              onClick={openModal}
              className="flex items-center gap-2 rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
            >
              <PlusIcon className="h-4 w-4" />
              Generate Report
            </button>
          </>
        }
      />

      {/* ─── Metric Stat Cards ─── */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricStatCard
          label="Total Active Enrolled"
          value={
            summaryQuery.isLoading
              ? "…"
              : (summary?.byStatus?.ENROLLED ?? 0).toLocaleString()
          }
          trend={summary ? `${summary.total} Total` : "—"}
          progress={78}
        />
        <MetricStatCard
          label="Pending Verifications"
          value={
            summaryQuery.isLoading
              ? "…"
              : (summary?.byStatus?.PENDING ?? 0).toLocaleString()
          }
          trend="Requires review"
          trendClassName="text-amber-700"
          progress={25}
          progressClassName="bg-amber-500"
        />
        <MetricStatCard
          label="Academic Year"
          value={summary?.currentAcademicYear?.yearLabel ?? "Current"}
          trend="Active Intake"
          trendClassName="text-teal-700"
          progress={100}
          progressClassName="bg-teal-700"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left Column: Recent Verified Enrollment Records */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">
              Recent Enrolled Admissions
            </h2>
            <span className="text-xs font-medium text-stone-400">
              Live database records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-wide text-stone-400 border-b border-stone-100">
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {studentsQuery.isLoading && (
                  <LoadingRow colSpan={4} label="Loading admissions…" />
                )}
                {studentsQuery.isError && (
                  <ErrorRow
                    colSpan={4}
                    message="Failed to load records."
                    onRetry={() => studentsQuery.refetch()}
                  />
                )}
                {studentsQuery.isSuccess && students.length === 0 && (
                  <EmptyRow colSpan={4} label="No enrolled students yet." />
                )}
                {studentsQuery.isSuccess &&
                  students.map((st) => (
                    <tr key={st.id} className="hover:bg-rose-50/20">
                      <td className="py-3 font-semibold text-stone-800">
                        {st.firstName} {st.lastName}
                      </td>
                      <td className="py-3 font-mono text-xs text-stone-600">
                        {st.studentNumber}
                      </td>
                      <td className="py-3 text-stone-600 text-xs">
                        {st.department?.name || "General"}
                      </td>
                      <td className="py-3">
                        <StatusBadge label="Enrolled" tone="green" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-xs text-stone-500">
            <span>
              Page {page} of {totalAuditPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded border border-stone-200 px-2.5 py-1 font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalAuditPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border border-stone-200 px-2.5 py-1 font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Generated Reports & Send to Principal */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">
              Official Reports
            </h2>
            <span className="text-xs font-medium text-stone-400">
              Dispatch to Principal
            </span>
          </div>

          <div className="space-y-3">
            {reportsQuery.isLoading && (
              <p className="py-6 text-center text-xs text-stone-400">
                Loading official reports…
              </p>
            )}

            {reportsQuery.isSuccess && reports.length === 0 && (
              <div className="rounded-xl border border-dashed border-stone-200 p-6 text-center">
                <FileTextIcon className="mx-auto h-8 w-8 text-stone-300" />
                <p className="mt-2 text-xs font-medium text-stone-500">
                  No reports generated yet.
                </p>
                <button
                  type="button"
                  onClick={openModal}
                  className="mt-3 text-xs font-bold text-rose-700 hover:underline"
                >
                  Generate First Report →
                </button>
              </div>
            )}

            {reportsQuery.isSuccess &&
              reports.map((report) => {
                const dateLabel = new Date(report.generatedAt).toLocaleDateString();
                return (
                  <div
                    key={report.id}
                    className="rounded-xl border border-stone-200 p-4 transition-colors hover:border-rose-200 hover:bg-rose-50/20"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-stone-900 text-sm">
                          {report.academicYear?.yearLabel || "Academic Year"} Report
                        </h4>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {report.department?.name || "All Departments"} • {dateLabel}
                        </p>
                      </div>
                      <StatusBadge
                        label={report.sentToPrincipal ? "Delivered" : "Draft"}
                        tone={report.sentToPrincipal ? "green" : "amber"}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3 text-xs text-stone-600">
                      <span>
                        Active: <b>{report.totalActiveStudents}</b>
                      </span>
                      <span>
                        New: <b>{report.totalNewStudents}</b>
                      </span>

                      {!report.sentToPrincipal ? (
                        <button
                          type="button"
                          disabled={sendMutation.isPending}
                          onClick={() => sendMutation.mutate(report.id)}
                          className="flex items-center gap-1 font-bold text-rose-700 hover:underline disabled:opacity-50"
                        >
                          <SendIcon className="h-3 w-3" />
                          Send
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 font-medium text-emerald-700">
                          <CheckCircleIcon className="h-3.5 w-3.5" />
                          Sent
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* ─── Generate Report Modal ─── */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Generate Enrollment Report
                </h3>
                <p className="mt-0.5 text-xs text-stone-500">
                  Computes live totals of new and active students.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-stone-500">
                  Academic Year <span className="text-rose-600">*</span>
                </label>
                <select
                  value={selectedAcademicYearId}
                  onChange={(e) => setSelectedAcademicYearId(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-rose-400"
                >
                  {academicYears.map((ay) => (
                    <option key={ay.id} value={ay.id}>
                      {ay.yearLabel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-stone-500">
                  Department (Optional)
                </label>
                <select
                  value={selectedDepartmentId}
                  onChange={(e) => setSelectedDepartmentId(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-rose-400"
                >
                  <option value="ALL">All Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generateMutation.isPending || !selectedAcademicYearId}
                  className="rounded-lg bg-rose-800 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-900 disabled:opacity-50"
                >
                  {generateMutation.isPending ? "Generating…" : "Generate Snapshot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Feedback Toast ─── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-stone-900 px-5 py-4 text-white shadow-2xl">
          <CheckCircleIcon className="h-5 w-5 text-emerald-400 shrink-0" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}
