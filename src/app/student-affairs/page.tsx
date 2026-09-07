"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IconStatCard } from "@/components/icon-stat-card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge, type StatusTone } from "@/components/status-badge";
import { LoadingRow, ErrorRow, EmptyRow } from "@/components/query-states";
import {
  CheckCircleIcon,
  ClipboardIcon,
  FileTextIcon,
  FilterIcon,
  GraduationCapIcon,
  MoreVerticalIcon,
  SearchIcon,
  ShieldCheckIcon,
  UploadCloudIcon,
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from "@/components/icons";
import { apiFetch } from "@/lib/api/client";
import { useApiQuery } from "@/lib/api/hooks";
import type {
  DepartmentDTO,
  ImportStudentsResultDTO,
  StudentDTO,
  StudentStatus,
  StudentSummaryDTO,
} from "@/lib/api/types";
import { EditStudentModal } from "./edit-student-modal";
import { StudentProfileModal } from "./student-profile-modal";

const PAGE_SIZE = 10;

const statusToneMap: Record<StudentStatus, StatusTone> = {
  ENROLLED: "green",
  PENDING: "amber",
  WITHDRAWN: "rose",
  GRADUATED: "sky",
  ON_LEAVE: "slate",
};

const statusLabelMap: Record<StudentStatus, string> = {
  ENROLLED: "Enrolled",
  PENDING: "Pending",
  WITHDRAWN: "Withdrawn",
  GRADUATED: "Graduated",
  ON_LEAVE: "On Leave",
};

function initialsOf(first: string, last: string) {
  const f = first ? first[0] : "";
  const l = last ? last[0] : "";
  return (f + l).toUpperCase() || "ST";
}

export default function StudentAffairsDashboard() {
  const queryClient = useQueryClient();

  // Search & Filter state
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  // Modals & feedback
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isDraggingImport, setIsDraggingImport] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDTO | null>(null);
  const [editingStudent, setEditingStudent] = useState<StudentDTO | null>(null);
  const [actionMenuStudentId, setActionMenuStudentId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Debounce search by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // 1. Summary Metrics Query
  const summaryQuery = useApiQuery<StudentSummaryDTO>(
    ["student-affairs", "summary"],
    "/student-affairs/students/summary"
  );

  // 2. Departments Lookup Query
  const departmentsQuery = useApiQuery<DepartmentDTO[]>(
    ["departments"],
    "/student-affairs/departments"
  );

  // 3. Students Directory Query
  const studentsQuery = useApiQuery<StudentDTO[]>(
    [
      "student-affairs",
      "students",
      { page, debouncedSearch, departmentFilter, statusFilter },
    ],
    "/student-affairs/students",
    {
      query: {
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        departmentId: departmentFilter === "ALL" ? undefined : departmentFilter,
        status: statusFilter === "ALL" ? undefined : statusFilter,
      },
      placeholderData: (prev) => prev,
    }
  );

  // 4. Update Status Mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: StudentStatus }) =>
      apiFetch<StudentDTO>(`/student-affairs/students/${id}/status`, {
        method: "PATCH",
        body: { status },
      }),
    onSuccess: async (_, variables) => {
      setActionMenuStudentId(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["student-affairs", "students"] }),
        queryClient.invalidateQueries({ queryKey: ["student-affairs", "summary"] }),
      ]);
      setToastMessage(
        `Student status updated to "${statusLabelMap[variables.status]}".`
      );
      setTimeout(() => setToastMessage(null), 3500);
    },
    onError: (err: Error) => {
      setToastMessage(err.message || "Failed to update student status.");
      setTimeout(() => setToastMessage(null), 4000);
    },
  });

  const students = studentsQuery.data?.data ?? [];
  const pagination = studentsQuery.data?.pagination;
  const totalStudents = pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalStudents / PAGE_SIZE));
  const departments = departmentsQuery.data?.data ?? [];
  const summary = summaryQuery.data?.data;

  function openBulkImportModal() {
    setImportFile(null);
    setImportError(null);
    setShowBulkImportModal(true);
  }

  function selectImportFile(file: File | undefined | null) {
    if (!file) return;
    const isCsvOrExcel = /\.(xlsx|xls|csv)$/i.test(file.name);
    if (!isCsvOrExcel) {
      setImportError("Please upload a CSV or Excel file (.csv, .xlsx, .xls).");
      return;
    }
    setImportError(null);
    setImportFile(file);
  }

  async function handleExecuteImport() {
    if (!importFile) {
      setImportError("Please select a file to import.");
      return;
    }

    try {
      setIsImporting(true);
      setImportError(null);

      // Read file content
      const fileText = await importFile.text();
      const res = await apiFetch<ImportStudentsResultDTO>(
        "/student-affairs/students/import",
        {
          method: "POST",
          body: { csv: fileText },
        }
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["student-affairs", "students"] }),
        queryClient.invalidateQueries({ queryKey: ["student-affairs", "summary"] }),
      ]);

      setShowBulkImportModal(false);
      setImportFile(null);
      setToastMessage(
        `Bulk import complete: ${res.data.createdCount} students created${
          res.data.failedCount > 0 ? `, ${res.data.failedCount} rows skipped` : ""
        }.`
      );
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to import students from file.";
      setImportError(msg);
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Student Affairs"
        description="Central management portal for active student records and lifecycle transitions."
        actions={
          <>
            <button
              type="button"
              onClick={openBulkImportModal}
              className="flex items-center gap-2 rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
            >
              <UploadCloudIcon className="h-4 w-4" />
              Bulk Import
            </button>
            <Link
              href="/student-affairs/enrollment"
              className="flex items-center gap-2 rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
            >
              <UserPlusIcon className="h-4 w-4" />
              Enroll Student
            </Link>
          </>
        }
      />

      {/* ─── Metric Stat Cards ─── */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <IconStatCard
          icon={UsersIcon}
          label="Total Students"
          value={
            summaryQuery.isLoading
              ? "…"
              : (summary?.total ?? 0).toLocaleString()
          }
          trend={summary ? `${summary.total} Registered` : undefined}
        />
        <IconStatCard
          icon={GraduationCapIcon}
          iconBgClassName="bg-sky-50 text-sky-600"
          label="Academic Year"
          value={
            summaryQuery.isLoading
              ? "…"
              : summary?.currentAcademicYear?.yearLabel ?? "Current"
          }
        />
        <IconStatCard
          icon={ShieldCheckIcon}
          label="Enrolled Students"
          value={
            summaryQuery.isLoading
              ? "…"
              : (summary?.byStatus?.ENROLLED ?? 0).toLocaleString()
          }
          trendTone="positive"
        />
        <IconStatCard
          icon={ClipboardIcon}
          label="Pending Approvals"
          value={
            summaryQuery.isLoading
              ? "…"
              : (summary?.byStatus?.PENDING ?? 0).toLocaleString()
          }
          trend={
            summary?.byStatus?.PENDING
              ? `${summary.byStatus.PENDING} Action Required`
              : "All clear"
          }
          trendTone={summary?.byStatus?.PENDING ? "warning" : "positive"}
        />
      </div>

      {/* ─── Main Directory Card ─── */}
      <div className="rounded-2xl border border-stone-200 bg-white">
        {/* Filters Header */}
        <div className="flex flex-wrap items-center gap-3 border-b border-stone-200 p-5">
          <div className="relative min-w-[260px] flex-1">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by student name, number, or email..."
              className="w-full rounded-lg border border-stone-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 text-stone-400" />
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-rose-400"
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-rose-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="ENROLLED">Enrolled</option>
            <option value="PENDING">Pending</option>
            <option value="WITHDRAWN">Withdrawn</option>
            <option value="GRADUATED">Graduated</option>
            <option value="ON_LEAVE">On Leave</option>
          </select>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wide text-stone-400">
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Student ID</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {studentsQuery.isLoading && <LoadingRow colSpan={5} label="Loading students directory…" />}

              {studentsQuery.isError && (
                <ErrorRow
                  colSpan={5}
                  message="Failed to load students. Please check your backend connection."
                  onRetry={() => studentsQuery.refetch()}
                />
              )}

              {studentsQuery.isSuccess && students.length === 0 && (
                <EmptyRow colSpan={5} label="No students match your search criteria." />
              )}

              {studentsQuery.isSuccess &&
                students.map((student) => {
                  const fullName = `${student.firstName} ${student.lastName}`.trim();
                  return (
                    <tr key={student.id} className="hover:bg-rose-50/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-700">
                            {initialsOf(student.firstName, student.lastName)}
                          </span>
                          <div>
                            <p className="font-semibold text-stone-800">{fullName}</p>
                            <p className="text-xs text-stone-400">
                              {student.personalEmail || "No email on record"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono font-medium text-stone-700">
                        {student.studentNumber}
                      </td>
                      <td className="px-5 py-4 text-stone-600">
                        {student.department?.name || "General"}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge
                          label={statusLabelMap[student.status] || student.status}
                          tone={statusToneMap[student.status] || "slate"}
                        />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="relative inline-block text-left">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedStudent(student)}
                              className="text-sm font-semibold text-rose-700 hover:underline"
                            >
                              View Profile
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setActionMenuStudentId(
                                  actionMenuStudentId === student.id ? null : student.id
                                )
                              }
                              className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
                            >
                              <MoreVerticalIcon className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Action Dropdown Menu */}
                          {actionMenuStudentId === student.id && (
                            <div className="absolute right-0 z-20 mt-1 w-48 rounded-xl border border-stone-200 bg-white py-1.5 shadow-lg">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingStudent(student);
                                  setActionMenuStudentId(null);
                                }}
                                className="flex w-full items-center px-3.5 py-1.5 text-left text-xs font-semibold text-stone-700 hover:bg-stone-50"
                              >
                                Edit Information
                              </button>
                              <div className="my-1 border-t border-stone-100" />
                              <p className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-stone-400">
                                Change Status
                              </p>
                              {(["ENROLLED", "PENDING", "WITHDRAWN", "GRADUATED"] as StudentStatus[]).map(
                                (st) => (
                                  <button
                                    key={st}
                                    type="button"
                                    disabled={student.status === st || statusMutation.isPending}
                                    onClick={() =>
                                      statusMutation.mutate({ id: student.id, status: st })
                                    }
                                    className={`flex w-full items-center px-3.5 py-1.5 text-left text-xs font-medium transition-colors ${
                                      student.status === st
                                        ? "bg-rose-50 font-bold text-rose-800"
                                        : "text-stone-700 hover:bg-stone-50"
                                    }`}
                                  >
                                    Mark as {statusLabelMap[st]}
                                  </button>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalStudents > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 px-5 py-4 text-sm">
            <p className="text-stone-500">
              Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(page * PAGE_SIZE, totalStudents)} of {totalStudents} entries
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-stone-200 px-3 py-1.5 text-stone-600 hover:bg-stone-50 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="px-3 text-sm font-semibold text-stone-700">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-stone-200 px-3 py-1.5 text-stone-600 hover:bg-stone-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Student Profile & Document Management Modal ─── */}
      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onEdit={() => {
            setEditingStudent(selectedStudent);
          }}
        />
      )}

      {/* ─── Edit Student Information Modal ─── */}
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          departments={departments}
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          onSuccess={(updated) => {
            setEditingStudent(null);
            if (selectedStudent?.id === updated.id) {
              setSelectedStudent(updated);
            }
            setToastMessage("Student record updated successfully.");
            setTimeout(() => setToastMessage(null), 3500);
          }}
        />
      )}

      {/* ─── Bulk Import Modal ─── */}
      {showBulkImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Bulk Import Students
                </h3>
                <p className="mt-1 text-sm text-stone-500">
                  Upload a CSV file containing student numbers, names, emails, and departments.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBulkImportModal(false)}
                aria-label="Close"
                className="text-stone-400 hover:text-stone-600"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div
              className={`mt-5 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
                isDraggingImport
                  ? "border-rose-400 bg-rose-100/60"
                  : "border-rose-200 bg-rose-50/40"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingImport(true);
              }}
              onDragLeave={() => setIsDraggingImport(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingImport(false);
                selectImportFile(e.dataTransfer.files?.[0]);
              }}
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <UploadCloudIcon className="h-7 w-7" />
              </span>
              <p className="mt-4 font-semibold text-stone-800">
                Drag and drop your CSV file here
              </p>
              <p className="mt-1 text-xs text-stone-500">Supports .csv files</p>
              <input
                ref={importInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => selectImportFile(e.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => importInputRef.current?.click()}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
              >
                <UploadCloudIcon className="h-4 w-4" />
                Browse Files
              </button>

              {importFile && (
                <div className="mx-auto mt-4 flex max-w-xs items-center justify-between gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-left">
                  <span className="flex min-w-0 items-center gap-2 text-sm text-stone-700">
                    <FileTextIcon className="h-4 w-4 shrink-0 text-rose-600" />
                    <span className="truncate">{importFile.name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setImportFile(null)}
                    aria-label="Remove file"
                    className="shrink-0 text-stone-400 hover:text-rose-600"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {importError && (
              <p className="mt-3 text-sm font-medium text-rose-600">{importError}</p>
            )}

            <div className="mt-6 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowBulkImportModal(false)}
                className="text-sm font-semibold text-stone-500 hover:text-stone-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isImporting || !importFile}
                onClick={handleExecuteImport}
                className="rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900 disabled:opacity-50"
              >
                {isImporting ? "Importing…" : "Import Now"}
              </button>
            </div>
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
