"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { PromoBanner } from "@/components/promo-banner";
import { StatusBadge } from "@/components/status-badge";
import {
  AlertTriangleIcon,
  FilterIcon,
  PlusIcon,
  SparkleIcon,
  UploadCloudIcon,
} from "@/components/icons";
import {
  TIMETABLE_DAYS,
  TIMETABLE_TIME_SLOTS,
  courseRegistry,
  initialScheduleConflicts,
  roomUtilization,
  timetableEvents,
} from "@/lib/academic-affairs/data";

export default function CourseRegistrationSchedulingPage() {
  const [isPublished, setIsPublished] = useState(false);
  const [conflicts, setConflicts] = useState(initialScheduleConflicts);

  function handlePublish() {
    setIsPublished(true);
  }

  function resolveConflict(id: string) {
    setConflicts((prev) => prev.filter((c) => c.id !== id));
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
              className="flex items-center gap-2 rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
            >
              <UploadCloudIcon className="h-4 w-4" />
              Bulk Upload
            </button>
            <button
              type="button"
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
              <StatusBadge label="42 Total Courses" tone="rose" />
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
    </div>
  );
}
