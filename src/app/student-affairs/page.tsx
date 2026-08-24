"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IconStatCard } from "@/components/icon-stat-card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge, type StatusTone } from "@/components/status-badge";
import {
  ClipboardIcon,
  FilterIcon,
  GraduationCapIcon,
  HistoryIcon,
  MoreVerticalIcon,
  SearchIcon,
  ShieldCheckIcon,
  SortIcon,
  UploadCloudIcon,
  UserPlusIcon,
  UsersIcon,
} from "@/components/icons";
import {
  recentDirectoryChanges,
  students,
  type StudentRecord,
} from "@/lib/student-affairs/students";

const statusTone: Record<StudentRecord["status"], StatusTone> = {
  Enrolled: "green",
  Pending: "amber",
  Withdrawn: "rose",
};

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function StudentAffairsDashboard() {
  const [query, setQuery] = useState("");

  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div>
      <PageHeader
        title="Student Affairs"
        description="Central management portal for active student records and lifecycle transitions."
        actions={
          <>
            <button
              type="button"
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

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <IconStatCard
          icon={UsersIcon}
          label="Total Students"
          value="12,842"
          trend="↗ +2.4%"
        />
        <IconStatCard
          icon={GraduationCapIcon}
          iconBgClassName="bg-sky-50 text-sky-600"
          label="Academic Year"
          value="2023-24"
        />
        <IconStatCard
          icon={ShieldCheckIcon}
          label="Verified Records"
          value="98.2%"
        />
        <IconStatCard
          icon={ClipboardIcon}
          label="Pending Approvals"
          value="14"
          trend="8 Pending"
          trendTone="warning"
        />
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-stone-200 p-5">
          <div className="relative min-w-[260px] flex-1">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, ID or department..."
              className="w-full rounded-lg border border-stone-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
          >
            <FilterIcon className="h-4 w-4" />
            Filter
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
          >
            <SortIcon className="h-4 w-4" />
            Sort
          </button>
          <button
            type="button"
            aria-label="More options"
            className="rounded-lg border border-stone-300 p-2.5 text-stone-500 hover:bg-stone-50"
          >
            <MoreVerticalIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wide text-stone-400">
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Student ID</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Year</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-700">
                        {initialsOf(student.name)}
                      </span>
                      <div>
                        <p className="font-semibold text-stone-800">
                          {student.name}
                        </p>
                        <p className="text-xs text-stone-400">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-stone-600">
                    {student.studentId}
                  </td>
                  <td className="px-5 py-4 text-stone-600">
                    {student.department}
                  </td>
                  <td className="px-5 py-4 text-stone-600">{student.year}</td>
                  <td className="px-5 py-4">
                    <StatusBadge
                      label={student.status}
                      tone={statusTone[student.status]}
                    />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="text-sm font-semibold text-rose-700 hover:underline"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-stone-400"
                  >
                    No students match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 px-5 py-4 text-sm">
          <p className="text-stone-500">
            Showing 1 to {filteredStudents.length} of 1,248 entries
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled
              className="rounded-lg border border-stone-200 px-3 py-1.5 text-stone-400"
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-lg bg-rose-800 px-3 py-1.5 font-semibold text-white"
            >
              1
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-stone-600 hover:bg-stone-50"
            >
              2
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-stone-600 hover:bg-stone-50"
            >
              3
            </button>
            <span className="px-1 text-stone-400">...</span>
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-stone-600 hover:bg-stone-50"
            >
              125
            </button>
            <button
              type="button"
              className="rounded-lg border border-stone-200 px-3 py-1.5 text-stone-600 hover:bg-stone-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-stone-900">
          <HistoryIcon className="h-5 w-5 text-rose-700" />
          Recent Directory Changes
        </h2>
        <ul className="space-y-4">
          {recentDirectoryChanges.map((change) => (
            <li key={change.id} className="flex items-start gap-3">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${change.dotColorClassName}`}
              />
              <div>
                <p className="text-sm text-stone-700">
                  <span className="font-semibold">{change.boldText}</span>
                  {change.restText}
                </p>
                <p className="mt-0.5 text-xs text-stone-400">{change.meta}</p>
              </div>
            </li>
          ))}
        </ul>
        <Link
          href="#"
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-rose-700 hover:underline"
        >
          View Audit Log →
        </Link>
      </div>
    </div>
  );
}
