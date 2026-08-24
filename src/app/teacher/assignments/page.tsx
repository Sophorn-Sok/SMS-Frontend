"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge, type StatusTone } from "@/components/status-badge";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  DownloadIcon,
  EditIcon,
  LightbulbIcon,
} from "@/components/icons";
import {
  assignments as initialAssignments,
  type Assignment,
  type RosterStudent,
} from "@/lib/teacher/assignments-data";

const badgeTone: Record<Assignment["badge"], StatusTone> = {
  "GRADING IN PROGRESS": "rose",
  UPCOMING: "rose",
  GRADED: "green",
};

const submissionStatusTone: Record<RosterStudent["submissionStatus"], StatusTone> = {
  "On Time": "green",
  Late: "amber",
  Missing: "rose",
};

type SortKey = "roll" | "name" | "score";

export default function AssignmentGradingPage() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [selectedId, setSelectedId] = useState(assignments[0].id);
  const [sortKey, setSortKey] = useState<SortKey>("roll");
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());

  const selected = assignments.find((a) => a.id === selectedId) ?? assignments[0];
  const isSubmitted = submittedIds.has(selected.id);

  const sortedRoster = useMemo(() => {
    const roster = [...selected.roster];
    if (sortKey === "name") return roster.sort((a, b) => a.name.localeCompare(b.name));
    if (sortKey === "score")
      return roster.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    return roster.sort((a, b) => a.rollNo.localeCompare(b.rollNo));
  }, [selected.roster, sortKey]);

  const scores = selected.roster
    .map((s) => s.score)
    .filter((s): s is number => s !== null);
  const pendingCount = selected.roster.filter((s) => s.score === null).length;

  function updateStudent(
    studentId: string,
    patch: Partial<Pick<RosterStudent, "score" | "feedback">>,
  ) {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id !== selected.id
          ? a
          : {
              ...a,
              roster: a.roster.map((s) =>
                s.id === studentId ? { ...s, ...patch } : s,
              ),
            },
      ),
    );
  }

  function handleSaveDraft() {
    setDraftMessage("Draft saved just now.");
    window.setTimeout(() => setDraftMessage(null), 3000);
  }

  function handleSubmitToCoe() {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        "Submit grades to COE? Once submitted, grades cannot be edited without a formal request.",
      );
      if (!confirmed) return;
    }
    setSubmittedIds((prev) => new Set(prev).add(selected.id));
  }

  return (
    <div>
      <p className="mb-1 text-sm text-stone-500">
        Academic Year 2023-24 • Term 2
      </p>
      <PageHeader
        title="Assignment & Grading"
        description="Manage coursework, track submissions, and enter student scores."
        actions={
          <>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
            >
              <DownloadIcon className="h-4 w-4" />
              Export List
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
            >
              <EditIcon className="h-4 w-4" />
              Create Assignment
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <section className="h-fit rounded-2xl border border-stone-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">
              Active Assignments
            </h2>
            <StatusBadge label={`${assignments.length} TOTAL`} tone="rose" />
          </div>
          <ul className="space-y-3">
            {assignments.map((assignment) => {
              const active = assignment.id === selected.id;
              return (
                <li key={assignment.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(assignment.id)}
                    className={`w-full rounded-xl border p-4 text-left transition-colors ${
                      active
                        ? "border-rose-700 bg-rose-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-rose-700">
                        {assignment.code}
                      </span>
                      <StatusBadge
                        label={assignment.badge}
                        tone={badgeTone[assignment.badge]}
                      />
                    </div>
                    <p className="mt-2 font-semibold text-stone-900">
                      {assignment.title}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      {assignment.deadlineLabel}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-stone-600">
                      {assignment.submissionsLabel}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm text-stone-500">Average Grade</p>
              <p className="mt-1 text-2xl font-bold text-rose-700">
                {selected.stats.average}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm text-stone-500">High Score</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {selected.stats.high}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm text-stone-500">Low Score</p>
              <p className="mt-1 text-2xl font-bold text-rose-700">
                {selected.stats.low}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-sm text-stone-500">Pending Review</p>
              <p className="mt-1 text-2xl font-bold text-amber-600">
                {selected.stats.pending}
              </p>
            </div>
          </div>

          <section className="rounded-2xl border border-stone-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 p-6">
              <div>
                <h2 className="text-lg font-bold uppercase text-stone-900">
                  {selected.className}
                </h2>
                <p className="text-sm text-stone-500">{selected.classMeta}</p>
              </div>
              <div className="relative">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="appearance-none rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-8 text-sm font-medium text-stone-700 outline-none focus:border-rose-400"
                >
                  <option value="roll">Sort by Roll No.</option>
                  <option value="name">Sort by Name</option>
                  <option value="score">Sort by Score</option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              </div>
            </div>

            {sortedRoster.length === 0 ? (
              <p className="p-10 text-center text-sm text-stone-400">
                No submissions yet for this assignment.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs font-bold uppercase tracking-wide text-stone-400">
                      <th className="px-6 py-3">Roll No.</th>
                      <th className="px-6 py-3">Student Name</th>
                      <th className="px-6 py-3">Submission Status</th>
                      <th className="px-6 py-3">Score / 100</th>
                      <th className="px-6 py-3">Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {sortedRoster.map((student) => (
                      <tr
                        key={student.id}
                        className={
                          student.score === null && !isSubmitted
                            ? "bg-rose-50/50"
                            : ""
                        }
                      >
                        <td className="px-6 py-4 font-mono text-stone-600">
                          {student.rollNo}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${student.avatarColorClassName}`}
                            >
                              {student.initials}
                            </span>
                            <span className="font-medium text-stone-800">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge
                            label={student.submissionStatus}
                            tone={submissionStatusTone[student.submissionStatus]}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            disabled={isSubmitted}
                            value={student.score ?? ""}
                            placeholder="--"
                            onChange={(e) =>
                              updateStudent(student.id, {
                                score:
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value),
                              })
                            }
                            className="w-20 rounded-lg border border-rose-200 px-3 py-1.5 text-center font-semibold text-stone-800 outline-none focus:border-rose-400 disabled:bg-stone-50 disabled:text-stone-400"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            disabled={isSubmitted}
                            value={student.feedback}
                            placeholder="Add comments..."
                            onChange={(e) =>
                              updateStudent(student.id, {
                                feedback: e.target.value,
                              })
                            }
                            className={`w-full min-w-[180px] rounded-lg border border-transparent bg-transparent px-2 py-1.5 italic outline-none focus:border-rose-200 disabled:text-stone-400 ${
                              student.submissionStatus === "Missing"
                                ? "text-rose-600"
                                : "text-stone-500"
                            }`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 p-6">
              <div className="flex items-center gap-5 text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-emerald-500" />
                  {scores.length} Graded
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-amber-400" />
                  {pendingCount} Pending
                </span>
                {draftMessage && (
                  <span className="text-stone-500">{draftMessage}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={handleSubmitToCoe}
                  disabled={isSubmitted}
                  className="flex items-center gap-2 rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900 disabled:opacity-60"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  {isSubmitted ? "Submitted to COE" : "Submit to COE"}
                </button>
              </div>
            </div>
          </section>

          <div className="flex items-start gap-4 rounded-2xl bg-teal-800 p-6 text-white">
            <LightbulbIcon className="mt-0.5 h-6 w-6 shrink-0 text-teal-200" />
            <div>
              <p className="font-bold">
                Notice from Controller of Examination (COE)
              </p>
              <p className="mt-1 text-sm text-teal-100">
                Please ensure all grades are entered by Friday, 5 PM. Once
                submitted to COE, grades cannot be modified without a formal
                request to the department head. Auto-save is enabled for your
                session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
