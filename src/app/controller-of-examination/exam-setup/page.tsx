"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { PromoBanner } from "@/components/promo-banner";
import { StatusBadge, type StatusTone } from "@/components/status-badge";
import { ToggleSwitch } from "@/components/toggle-switch";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  ClipboardCheckIcon,
  ClipboardClockIcon,
  DoorIcon,
  EnvelopeIcon,
  EyeIcon,
  FunnelIcon,
  PlusIcon,
  UserPlusIcon,
} from "@/components/icons";
import {
  INVIGILATOR_OPTIONS,
  ROOM_OPTIONS,
  initialActivity,
  initialExams,
  type ExamRow,
  type ExamStatus,
} from "@/lib/coe/exam-setup-data";

const statusTone: Record<ExamStatus, StatusTone> = {
  "Paper Pending": "rose",
  "Exam Paper Received": "green",
  "Room Assigned": "sky",
  "Ready for Launch": "green",
};

interface NewExamForm {
  subject: string;
  code: string;
  department: string;
  date: string;
  time: string;
}

const emptyForm: NewExamForm = {
  subject: "",
  code: "",
  department: "",
  time: "",
  date: "",
};

export default function ExamSetupPage() {
  const [exams, setExams] = useState(initialExams);
  const [activity, setActivity] = useState(initialActivity);
  const [isPublished, setIsPublished] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState<NewExamForm>(emptyForm);
  const [pendingRemindersOf, setPendingRemindersOf] = useState<Set<string>>(
    new Set(),
  );
  const [assignModalFor, setAssignModalFor] = useState<{
    exam: ExamRow;
    kind: "room" | "invigilator";
  } | null>(null);
  const [notifyMessage, setNotifyMessage] = useState<string | null>(null);
  const [facultyPending, setFacultyPending] = useState(5);

  function logActivity(title: string, description: string) {
    setActivity((prev) => [
      {
        id: `act-${Date.now()}`,
        barColorClassName: "bg-emerald-500",
        title,
        description,
        meta: "Just now",
      },
      ...prev,
    ]);
  }

  function sendReminder(exam: ExamRow) {
    setPendingRemindersOf((prev) => new Set(prev).add(exam.id));
    window.setTimeout(() => {
      setExams((prev) =>
        prev.map((e) =>
          e.id === exam.id ? { ...e, status: "Exam Paper Received" } : e,
        ),
      );
      setPendingRemindersOf((prev) => {
        const next = new Set(prev);
        next.delete(exam.id);
        return next;
      });
      logActivity(
        "Paper Received",
        `${exam.subject} (${exam.code}) paper uploaded after reminder.`,
      );
    }, 1500);
  }

  function confirmAssignment(value: string) {
    if (!assignModalFor) return;
    const { exam, kind } = assignModalFor;
    setExams((prev) =>
      prev.map((e) => {
        if (e.id !== exam.id) return e;
        if (kind === "room") {
          return { ...e, room: value, status: "Room Assigned" };
        }
        return { ...e, invigilator: value, status: "Ready for Launch" };
      }),
    );
    logActivity(
      kind === "room" ? "Room Assigned" : "Invigilator Assigned",
      kind === "room"
        ? `${value} assigned to ${exam.code}`
        : `${value} assigned to invigilate ${exam.code}`,
    );
    setAssignModalFor(null);
  }

  function handleCreateExam(e: React.FormEvent) {
    e.preventDefault();
    if (!form.subject || !form.code || !form.department || !form.date) return;
    const newExam: ExamRow = {
      id: `e-${Date.now()}`,
      subject: form.subject,
      code: form.code,
      department: form.department,
      date: form.date,
      time: form.time || "TBD",
      status: "Paper Pending",
    };
    setExams((prev) => [newExam, ...prev]);
    logActivity("Exam Created", `${form.subject} (${form.code}) added to schedule.`);
    setForm(emptyForm);
    setShowCreateModal(false);
  }

  function handleAutoNotify() {
    setNotifyMessage(`Reminder sent to ${facultyPending} faculty members.`);
    setFacultyPending(0);
    window.setTimeout(() => setNotifyMessage(null), 4000);
  }

  function actionFor(exam: ExamRow) {
    const isSendingReminder = pendingRemindersOf.has(exam.id);
    switch (exam.status) {
      case "Paper Pending":
        return (
          <button
            type="button"
            disabled={isSendingReminder}
            onClick={() => sendReminder(exam)}
            className="flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:underline disabled:opacity-60"
          >
            {isSendingReminder ? "Sending..." : "Send Reminder"}
            <EnvelopeIcon className="h-4 w-4" />
          </button>
        );
      case "Exam Paper Received":
        return (
          <button
            type="button"
            onClick={() => setAssignModalFor({ exam, kind: "room" })}
            className="flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:underline"
          >
            Assign Room
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        );
      case "Room Assigned":
        return (
          <button
            type="button"
            onClick={() => setAssignModalFor({ exam, kind: "invigilator" })}
            className="flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:underline"
          >
            Assign Invigilator
            <UserPlusIcon className="h-4 w-4" />
          </button>
        );
      case "Ready for Launch":
        return (
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:underline"
          >
            View Details
            <EyeIcon className="h-4 w-4" />
          </button>
        );
    }
  }

  return (
    <div>
      <PageHeader
        title="Exam Setup Dashboard"
        description="Session 2023-24 | Semester: Fall"
        actions={
          <>
            <ToggleSwitch
              label="Publish Schedule"
              checked={isPublished}
              onChange={(v) => {
                setIsPublished(v);
                if (v) logActivity("Schedule Published", "Fall 2023 exam schedule is now live.");
              }}
            />
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
            >
              <PlusIcon className="h-4 w-4" />
              Create Exam
            </button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <ClipboardClockIcon className="h-7 w-7 text-rose-700" />
          <p className="mt-3 text-3xl font-extrabold text-stone-900">12</p>
          <p className="mt-1 text-sm text-stone-500">Upcoming Exams</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <ClipboardCheckIcon className="h-7 w-7 text-emerald-600" />
          <p className="mt-3 text-3xl font-extrabold text-stone-900">45</p>
          <p className="mt-1 text-sm text-stone-500">Papers Received</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <DoorIcon className="h-7 w-7 text-amber-500" />
          <p className="mt-3 text-3xl font-extrabold text-stone-900">08</p>
          <p className="mt-1 text-sm text-stone-500">Pending Room Allocations</p>
        </div>
        <div className="rounded-2xl bg-rose-800 p-5 text-white">
          <UserPlusIcon className="h-7 w-7" />
          <p className="mt-3 text-3xl font-extrabold">124</p>
          <p className="mt-1 text-sm text-rose-100">Active Invigilators</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <section id="upcoming-exams" className="rounded-2xl border border-stone-200 bg-white">
          <div className="flex items-center justify-between border-b border-stone-200 p-6">
            <h2 className="text-xl font-bold text-stone-900">Upcoming Exams</h2>
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-stone-700"
            >
              <FunnelIcon className="h-4 w-4" />
              Filter by Department
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-wide text-stone-400">
                  <th className="px-6 py-3">Subject / Code</th>
                  <th className="px-6 py-3">Date &amp; Time</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {exams.map((exam) => (
                  <tr key={exam.id}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-stone-900">{exam.subject}</p>
                      <p className="text-sm text-stone-500">
                        {exam.code} • {exam.department}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {exam.date}
                      <br />
                      {exam.time}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge label={`• ${exam.status}`} tone={statusTone[exam.status]} />
                    </td>
                    <td className="px-6 py-4 text-right">{actionFor(exam)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-stone-200 p-4 text-center">
            <button type="button" className="text-sm font-semibold text-rose-700 hover:underline">
              View All Exams
            </button>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h3 className="text-lg font-bold text-stone-900">Quick Allocation</h3>
            <div className="mt-4 space-y-3">
              <a
                href="#upcoming-exams"
                className="flex items-center gap-3 rounded-xl border border-stone-200 p-3.5 hover:border-stone-300"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
                  <DoorIcon className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold text-stone-800">Assign Room</span>
                  <span className="block text-sm text-stone-500">8 exams pending rooms</span>
                </span>
                <span className="text-stone-300">›</span>
              </a>
              <a
                href="#upcoming-exams"
                className="flex items-center gap-3 rounded-xl border border-stone-200 p-3.5 hover:border-stone-300"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
                  <BriefcaseIcon className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold text-stone-800">Assign Invigilator</span>
                  <span className="block text-sm text-stone-500">14 shifts available</span>
                </span>
                <span className="text-stone-300">›</span>
              </a>
            </div>
          </div>

          <PromoBanner
            title="Paper Submission Deadline"
            description={
              facultyPending > 0
                ? `${facultyPending} Faculty members have not submitted their final question papers for the upcoming mid-terms.`
                : "All faculty members have submitted their final question papers."
            }
          />
          {facultyPending > 0 ? (
            <button
              type="button"
              onClick={handleAutoNotify}
              className="-mt-4 w-full rounded-lg border border-stone-300 bg-white py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
            >
              Auto-Notify Faculty
            </button>
          ) : (
            notifyMessage && (
              <p className="-mt-4 text-center text-sm font-medium text-emerald-700">
                {notifyMessage}
              </p>
            )
          )}

          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h3 className="text-lg font-bold text-stone-900">Recent Activity</h3>
            <ul className="mt-4 space-y-4">
              {activity.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <span className={`w-1 shrink-0 rounded-full ${item.barColorClassName}`} />
                  <div>
                    <p className="font-semibold text-stone-800">{item.title}</p>
                    <p className="text-sm text-stone-500">{item.description}</p>
                    <p className="mt-0.5 text-xs text-stone-400">{item.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form
            onSubmit={handleCreateExam}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h3 className="text-lg font-bold text-stone-900">Create Exam</h3>
            <div className="mt-4 space-y-3">
              <input
                required
                placeholder="Subject name"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-rose-400"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Course code"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-rose-400"
                />
                <input
                  required
                  placeholder="Department"
                  value={form.department}
                  onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-rose-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-rose-400"
                />
                <input
                  placeholder="e.g. 09:00 AM - 12:00 PM"
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-rose-400"
                />
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-sm font-semibold text-stone-500 hover:text-stone-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
              >
                Create Exam
              </button>
            </div>
          </form>
        </div>
      )}

      {assignModalFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-stone-900">
              {assignModalFor.kind === "room" ? "Assign Room" : "Assign Invigilator"}
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              {assignModalFor.exam.subject} ({assignModalFor.exam.code})
            </p>
            <ul className="mt-4 space-y-2">
              {(assignModalFor.kind === "room" ? ROOM_OPTIONS : INVIGILATOR_OPTIONS).map(
                (option) => (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => confirmAssignment(option)}
                      className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-left text-sm font-medium text-stone-700 hover:border-rose-300 hover:bg-rose-50"
                    >
                      {option}
                    </button>
                  </li>
                ),
              )}
            </ul>
            <button
              type="button"
              onClick={() => setAssignModalFor(null)}
              className="mt-4 text-sm font-semibold text-stone-500 hover:text-stone-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
