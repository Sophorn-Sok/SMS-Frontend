"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge, type StatusTone } from "@/components/status-badge";
import {
  AlertTriangleIcon,
  CalendarXIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DownloadIcon,
  FileTextIcon,
  FunnelIcon,
  GraduationCapIcon,
  UploadCloudIcon,
  XIcon,
} from "@/components/icons";
import {
  MAJOR_OPTIONS,
  PROGRAM_OPTIONS,
  registrationMonitoring,
  upcomingDeadlines,
  type RegistrationMonitorRow,
} from "@/lib/academic-affairs/data";

const ACCEPTED_IMPORT_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];

const statusTone: Record<RegistrationMonitorRow["status"], StatusTone> = {
  OPEN: "green",
  FULL: "rose",
};

type Semester = "First" | "Second";

function SemesterOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition-colors ${
        selected
          ? "border-rose-400 bg-rose-50 text-rose-800"
          : "border-stone-200 text-stone-700 hover:border-stone-300"
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-rose-700" : "border-stone-300"
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-rose-700" />}
      </span>
      {label}
    </button>
  );
}

export default function AcademicAffairsDashboard() {
  const [program, setProgram] = useState(PROGRAM_OPTIONS[0]);
  const [major, setMajor] = useState(MAJOR_OPTIONS[0]);
  const [semester, setSemester] = useState<Semester | null>(null);
  const [enrollmentStart, setEnrollmentStart] = useState("");
  const [enrollmentEnd, setEnrollmentEnd] = useState("");
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isDraggingUpload, setIsDraggingUpload] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  function openBulkUploadModal() {
    setUploadFile(null);
    setUploadError(null);
    setShowBulkUploadModal(true);
  }

  function selectUploadFile(file: File | undefined | null) {
    if (!file) return;
    const isAcceptedType =
      ACCEPTED_IMPORT_TYPES.includes(file.type) || /\.(xlsx|xls|csv)$/i.test(file.name);
    if (!isAcceptedType) {
      setUploadError("Please upload an Excel (.xlsx, .xls) or CSV file.");
      return;
    }
    setUploadError(null);
    setUploadFile(file);
  }

  function handleSaveBulkUpload() {
    if (!uploadFile) {
      setUploadError("Please select a file to upload.");
      return;
    }
    setShowBulkUploadModal(false);
    setToast(`"${uploadFile.name}" has been uploaded and is being processed.`);
    setUploadFile(null);
    window.setTimeout(() => setToast(null), 4000);
  }

  function handleDiscard() {
    setProgram(PROGRAM_OPTIONS[0]);
    setMajor(MAJOR_OPTIONS[0]);
    setSemester(null);
    setEnrollmentStart("");
    setEnrollmentEnd("");
    setSavedMessage(null);
  }

  function handleUpdate() {
    setSavedMessage("Academic structure updated for 2024/25.");
    window.setTimeout(() => setSavedMessage(null), 3000);
  }

  return (
    <div>
      <PageHeader
        title="Academic Affairs"
        description="Configure programs, assign structures, and manage session timelines."
        actions={
          <>
            <button
              type="button"
              onClick={openBulkUploadModal}
              className="flex items-center gap-2 rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
            >
              <UploadCloudIcon className="h-4 w-4" />
              Bulk Upload
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              className="flex items-center gap-2 rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
            >
              <UploadCloudIcon className="h-4 w-4 -rotate-90" />
              Publish Schedule
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-stone-200 bg-white p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-stone-900">
                Academic Program Setup
              </h2>
              <StatusBadge label="Active Session: 2024/25" tone="rose" />
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-500">
                  Assign Program by Year
                </label>
                <div className="relative">
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  >
                    {PROGRAM_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-500">
                  Assign Major/Specialization
                </label>
                <div className="relative">
                  <select
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  >
                    {MAJOR_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-500">
                  Assign Semester
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <SemesterOption
                    label="First Semester"
                    selected={semester === "First"}
                    onSelect={() => setSemester("First")}
                  />
                  <SemesterOption
                    label="Second Semester"
                    selected={semester === "Second"}
                    onSelect={() => setSemester("Second")}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-500">
                  Session Enrollment Window
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={enrollmentStart}
                    onChange={(e) => setEnrollmentStart(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  />
                  <input
                    type="date"
                    value={enrollmentEnd}
                    onChange={(e) => setEnrollmentEnd(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 pt-6">
              <p className="text-sm text-stone-500">{savedMessage}</p>
              <div className="ml-auto flex items-center gap-5">
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="text-sm font-semibold text-rose-700 hover:underline"
                >
                  Discard Changes
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
                >
                  Update Academic Structure
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white">
            <div className="flex items-center justify-between border-b border-stone-200 p-6">
              <h2 className="text-xl font-bold text-stone-900">
                Registration Monitoring
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Filter"
                  className="rounded-lg border border-stone-200 p-2.5 text-stone-500 hover:bg-stone-50"
                >
                  <FunnelIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Download"
                  className="rounded-lg border border-stone-200 p-2.5 text-stone-500 hover:bg-stone-50"
                >
                  <DownloadIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs font-bold uppercase tracking-wide text-stone-400">
                    <th className="px-6 py-3">Course Code</th>
                    <th className="px-6 py-3">Course Title</th>
                    <th className="px-6 py-3">Instructor</th>
                    <th className="px-6 py-3">Enrollment</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {registrationMonitoring.map((row) => (
                    <tr key={row.id}>
                      <td className="px-6 py-4 font-bold text-rose-700">
                        {row.code}
                      </td>
                      <td className="px-6 py-4 text-stone-800">
                        {row.title}
                      </td>
                      <td className="px-6 py-4 text-stone-600">
                        {row.instructor}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-stone-100">
                            <div
                              className={`h-full rounded-full ${
                                row.status === "FULL"
                                  ? "bg-amber-500"
                                  : "bg-rose-800"
                              }`}
                              style={{
                                width: `${(row.enrolled / row.capacity) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-stone-500">
                            {row.enrolled}/{row.capacity}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          label={row.status}
                          tone={statusTone[row.status]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-stone-200 px-6 py-4 text-sm">
              <p className="text-stone-500">
                Showing {registrationMonitoring.length} of 48 Courses
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="rounded-lg border border-stone-200 px-4 py-1.5 text-stone-400"
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-stone-200 px-4 py-1.5 text-stone-600 hover:bg-stone-50"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-rose-800 p-6 text-white">
            <GraduationCapIcon className="pointer-events-none absolute -bottom-4 -right-4 h-28 w-28 text-rose-700/60" />
            <p className="relative text-xs font-bold uppercase tracking-wide text-rose-100">
              Total Enrolled Students
            </p>
            <p className="relative mt-2 text-4xl font-extrabold">12,482</p>
            <p className="relative mt-2 text-sm font-semibold text-emerald-300">
              ↗ +4.2% from last session
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-stone-500">
              Upcoming Deadlines
            </h3>
            <ul className="mt-4 space-y-3">
              {upcomingDeadlines.map((deadline) => (
                <li
                  key={deadline.id}
                  className={`flex items-start gap-4 rounded-lg border-l-4 p-3 ${deadline.accentClassName}`}
                >
                  <div className="text-center leading-none">
                    <p className="text-lg font-extrabold">{deadline.day}</p>
                    <p className="text-[10px] font-bold uppercase">
                      {deadline.month}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-800">
                      {deadline.title}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500">
                      {deadline.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wide text-stone-500">
                Conflict Watch
              </h3>
              <AlertTriangleIcon className="h-5 w-5 text-amber-500" />
            </div>
            <span className="mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <CalendarXIcon className="h-7 w-7" />
            </span>
            <p className="mt-4 font-semibold text-stone-800">
              No critical schedule conflicts
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Automatic conflict detection is currently active for the
              2024/25 session.
            </p>
            <Link
              href="/academic-affairs/course-registration"
              className="mt-3 inline-block text-sm font-semibold text-rose-700 hover:underline"
            >
              View Global Timetable
            </Link>
          </div>
        </aside>
      </div>

      {showBulkUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Bulk Upload
                </h3>
                <p className="mt-1 text-sm text-stone-500">
                  Upload an Excel or CSV file to add or update multiple
                  academic program records at once.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBulkUploadModal(false)}
                aria-label="Close"
                className="text-stone-400 hover:text-stone-600"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div
              className={`mt-5 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
                isDraggingUpload
                  ? "border-rose-400 bg-rose-100/60"
                  : "border-rose-200 bg-rose-50/40"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingUpload(true);
              }}
              onDragLeave={() => setIsDraggingUpload(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingUpload(false);
                selectUploadFile(e.dataTransfer.files?.[0]);
              }}
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <UploadCloudIcon className="h-7 w-7" />
              </span>
              <p className="mt-4 font-semibold text-stone-800">
                Drag and drop your file here
              </p>
              <p className="mt-1 text-xs text-stone-500">
                Supports .xlsx, .xls, and .csv files
              </p>
              <input
                ref={uploadInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => selectUploadFile(e.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
              >
                <UploadCloudIcon className="h-4 w-4" />
                Browse Files
              </button>

              {uploadFile && (
                <div className="mx-auto mt-4 flex max-w-xs items-center justify-between gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-left">
                  <span className="flex min-w-0 items-center gap-2 text-sm text-stone-700">
                    <FileTextIcon className="h-4 w-4 shrink-0 text-rose-600" />
                    <span className="truncate">{uploadFile.name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setUploadFile(null)}
                    aria-label="Remove file"
                    className="shrink-0 text-stone-400 hover:text-rose-600"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {uploadError && (
              <p className="mt-3 text-sm font-medium text-rose-600">{uploadError}</p>
            )}

            <div className="mt-6 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowBulkUploadModal(false)}
                className="text-sm font-semibold text-stone-500 hover:text-stone-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveBulkUpload}
                className="rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-emerald-600 px-5 py-4 text-white shadow-xl">
          <CheckCircleIcon className="h-6 w-6 shrink-0" />
          <p className="font-semibold">{toast}</p>
        </div>
      )}
    </div>
  );
}
