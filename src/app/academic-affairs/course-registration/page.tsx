"use client";

import { useRef, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { PromoBanner } from "@/components/promo-banner";
import { StatusBadge } from "@/components/status-badge";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  FileTextIcon,
  FilterIcon,
  PlusIcon,
  SparkleIcon,
  UploadCloudIcon,
  XIcon,
} from "@/components/icons";
import {
  TIMETABLE_DAYS,
  TIMETABLE_TIME_SLOTS,
  courseRegistry as initialCourseRegistry,
  initialScheduleConflicts,
  roomUtilization,
  timetableEvents,
  type CourseRegistryItem,
} from "@/lib/academic-affairs/data";

const DEPARTMENT_OPTIONS = [
  "Engineering",
  "Mathematics",
  "Life Sciences",
  "Business Administration",
  "Computer Science",
];

const INSTRUCTOR_COLOR_PALETTE = [
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
];

const ACCEPTED_IMPORT_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];

function initialsOf(name: string) {
  return name
    .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i, "")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface NewCourseForm {
  code: string;
  title: string;
  department: string;
  instructor: string;
}

const emptyCourseForm: NewCourseForm = {
  code: "",
  title: "",
  department: DEPARTMENT_OPTIONS[0],
  instructor: "",
};

const BASE_COURSE_COUNT = 42 - 3;

export default function CourseRegistrationSchedulingPage() {
  const [isPublished, setIsPublished] = useState(false);
  const [conflicts, setConflicts] = useState(initialScheduleConflicts);
  const [courseRegistry, setCourseRegistry] = useState(initialCourseRegistry);
  const [toast, setToast] = useState<string | null>(null);

  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isDraggingUpload, setIsDraggingUpload] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [courseForm, setCourseForm] = useState<NewCourseForm>(emptyCourseForm);
  const [registerError, setRegisterError] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 4000);
  }

  function handlePublish() {
    setIsPublished(true);
  }

  function resolveConflict(id: string) {
    setConflicts((prev) => prev.filter((c) => c.id !== id));
  }

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
    showToast(`"${uploadFile.name}" has been uploaded and is being processed.`);
    setUploadFile(null);
  }

  function openRegisterModal() {
    setCourseForm(emptyCourseForm);
    setRegisterError(null);
    setShowRegisterModal(true);
  }

  function handleRegisterCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!courseForm.code || !courseForm.title || !courseForm.instructor) {
      setRegisterError("Please fill in course code, title, and instructor.");
      return;
    }
    const newCourse: CourseRegistryItem = {
      id: `c-${Date.now()}`,
      code: courseForm.code.toUpperCase(),
      title: courseForm.title,
      department: courseForm.department,
      instructorName: courseForm.instructor,
      instructorInitials: initialsOf(courseForm.instructor) || "??",
      instructorColorClassName:
        INSTRUCTOR_COLOR_PALETTE[courseRegistry.length % INSTRUCTOR_COLOR_PALETTE.length],
    };
    setCourseRegistry((prev) => [newCourse, ...prev]);
    setShowRegisterModal(false);
    showToast(`Course "${newCourse.code}" has been registered successfully.`);
  }

  return (
    <div>
      <PageHeader
        title="Course Registration & Scheduling"
        description="Manage course offerings and optimize the institutional timetable."
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
              onClick={openRegisterModal}
              className="flex items-center gap-2 rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
            >
              <PlusIcon className="h-4 w-4" />
              Register New Course
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-stone-200 bg-white">
            <div className="flex items-center justify-between border-b border-stone-200 p-6">
              <h2 className="text-xl font-bold text-stone-900">
                Course Registry
              </h2>
              <StatusBadge
                label={`${BASE_COURSE_COUNT + courseRegistry.length} Total Courses`}
                tone="rose"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs font-bold uppercase tracking-wide text-stone-400">
                    <th className="px-6 py-3">Course Code</th>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Department</th>
                    <th className="px-6 py-3">Instructor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {courseRegistry.map((course) => (
                    <tr key={course.id}>
                      <td className="px-6 py-4 font-bold text-rose-700">
                        {course.code}
                      </td>
                      <td className="px-6 py-4 text-stone-800">
                        {course.title}
                      </td>
                      <td className="px-6 py-4 text-stone-600">
                        {course.department}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${course.instructorColorClassName}`}
                          >
                            {course.instructorInitials}
                          </span>
                          <span className="text-stone-700">
                            {course.instructorName}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-stone-200 p-4 text-center">
              <button
                type="button"
                className="text-sm font-semibold text-rose-700 hover:underline"
              >
                View All Courses
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  Weekly Timetable
                </h2>
                <p className="text-sm text-stone-500">
                  Current Semester (Fall 2024)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
                >
                  <FilterIcon className="h-4 w-4" />
                  Filter Room
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg bg-rose-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
                >
                  <SparkleIcon className="h-4 w-4" />
                  Generate Timetable
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] table-fixed border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th className="w-20 border-b border-stone-200 bg-white py-3" />
                    {TIMETABLE_DAYS.map((day) => (
                      <th
                        key={day}
                        className="border-b border-l border-stone-200 bg-stone-50 px-3 py-3 text-xs font-bold uppercase tracking-wide text-stone-500"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIMETABLE_TIME_SLOTS.map((time) => (
                    <tr key={time}>
                      <td className="border-b border-stone-200 px-2 py-4 align-top text-xs font-semibold text-stone-500">
                        {time}
                      </td>
                      {TIMETABLE_DAYS.map((day) => {
                        const event = timetableEvents.find(
                          (e) => e.day === day && e.time === time,
                        );
                        return (
                          <td
                            key={day}
                            className="h-24 border-b border-l border-stone-200 p-1.5 align-top"
                          >
                            {event && (
                              <div
                                className={`h-full rounded-md border-l-4 px-2.5 py-2 text-xs ${event.colorClassName}`}
                              >
                                <p className="font-bold">{event.title}</p>
                                <p className="mt-0.5 opacity-80">
                                  {event.location}
                                </p>
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
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900">
                Publishing Workflow
              </h3>
              <StatusBadge
                label={isPublished ? "• Published" : "• Draft"}
                tone={isPublished ? "green" : "amber"}
              />
            </div>
            <p className="mt-5 text-sm text-stone-500">
              Schedule coverage: {isPublished ? 100 : 88}%
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-rose-700"
                style={{ width: `${isPublished ? 100 : 88}%` }}
              />
            </div>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublished}
              className="mt-5 w-full rounded-lg bg-rose-800 py-2.5 text-sm font-semibold text-white hover:bg-rose-900 disabled:opacity-60"
            >
              {isPublished ? "Schedule Published" : "Publish Schedule"}
            </button>
            <p className="mt-3 text-center text-xs text-stone-400">
              {isPublished
                ? "Published just now"
                : "Last saved: Today at 09:42 AM"}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h3 className="text-lg font-bold text-stone-900">
              Room Utilization
            </h3>
            <ul className="mt-4 space-y-4">
              {roomUtilization.map((room) => (
                <li key={room.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-stone-700">
                      {room.label}
                    </span>
                    <span className="font-bold text-stone-900">
                      {room.value}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                    <div
                      className={`h-full rounded-full ${room.colorClassName}`}
                      style={{ width: `${room.value}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            {conflicts.length > 0 ? (
              <div className="mt-5 border-t border-stone-200 pt-4">
                {conflicts.map((conflict) => (
                  <div key={conflict.id} className="flex items-start gap-2.5">
                    <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                    <div>
                      <p className="text-sm font-bold text-stone-800">
                        {conflicts.length} Schedule Conflict
                        {conflicts.length > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-stone-500">
                        {conflict.description}{" "}
                        <button
                          type="button"
                          onClick={() => resolveConflict(conflict.id)}
                          className="font-semibold text-rose-700 hover:underline"
                        >
                          Resolve
                        </button>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 border-t border-stone-200 pt-4 text-sm font-medium text-emerald-700">
                No schedule conflicts remaining.
              </p>
            )}
          </div>

          <PromoBanner
            title="New Campus Wing"
            description="Available for bookings from Dec 2024"
          />
        </aside>
      </div>

      {showBulkUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Bulk Upload Courses
                </h3>
                <p className="mt-1 text-sm text-stone-500">
                  Upload an Excel or CSV file to add or update multiple course
                  offerings at once.
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

      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form
            onSubmit={handleRegisterCourse}
            noValidate
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Register New Course
                </h3>
                <p className="mt-1 text-sm text-stone-500">
                  Add a new course offering to the registry.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                aria-label="Close"
                className="text-stone-400 hover:text-stone-600"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-500">
                    Course Code
                  </label>
                  <input
                    required
                    placeholder="e.g. CS101"
                    value={courseForm.code}
                    onChange={(e) =>
                      setCourseForm((f) => ({ ...f, code: e.target.value }))
                    }
                    className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-rose-400"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-500">
                    Department
                  </label>
                  <div className="relative">
                    <select
                      value={courseForm.department}
                      onChange={(e) =>
                        setCourseForm((f) => ({ ...f, department: e.target.value }))
                      }
                      className="w-full appearance-none rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
                    >
                      {DEPARTMENT_OPTIONS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-500">
                  Course Title
                </label>
                <input
                  required
                  placeholder="e.g. Intro to Computer Science"
                  value={courseForm.title}
                  onChange={(e) =>
                    setCourseForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-rose-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-500">
                  Instructor
                </label>
                <input
                  required
                  placeholder="e.g. Dr. Robert Chen"
                  value={courseForm.instructor}
                  onChange={(e) =>
                    setCourseForm((f) => ({ ...f, instructor: e.target.value }))
                  }
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-rose-400"
                />
              </div>
            </div>

            {registerError && (
              <p className="mt-3 text-sm font-medium text-rose-600">{registerError}</p>
            )}

            <div className="mt-6 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="text-sm font-semibold text-stone-500 hover:text-stone-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
              >
                Register Course
              </button>
            </div>
          </form>
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
