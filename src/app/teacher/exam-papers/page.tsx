"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { PromoBanner } from "@/components/promo-banner";
import { StatusBadge, type StatusTone } from "@/components/status-badge";
import {
  CalculatorIcon,
  CheckCircleIcon,
  EditIcon,
  EyeIcon,
  FileTextIcon,
  MoreVerticalIcon,
  UploadCloudIcon,
} from "@/components/icons";
import {
  correctionRoster as initialCorrectionRoster,
  initialChecklist,
  initialDraftPapers,
  type DraftPaper,
} from "@/lib/teacher/exam-papers-data";

const paperStatusTone: Record<DraftPaper["status"], StatusTone> = {
  DRAFT: "amber",
  "PENDING APPROVAL": "amber",
  APPROVED: "green",
};

function downloadGuidelines() {
  const content =
    "COE Submission Guidelines\n\n" +
    "1. Map every question to its ABET criteria before submission.\n" +
    "2. Upload the answer key draft to the secure cloud folder.\n" +
    "3. Verify internal marks for all enrolled students.\n" +
    "4. Obtain COE portal approval before publishing results.\n";
  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "coe-submission-guidelines.txt";
  link.click();
  URL.revokeObjectURL(url);
}

export default function TeacherExamPaperPage() {
  const [papers, setPapers] = useState(initialDraftPapers);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [correctionRoster, setCorrectionRoster] = useState(
    initialCorrectionRoster,
  );
  const [activeTab, setActiveTab] = useState<"Pending" | "Graded">("Pending");
  const [checklist, setChecklist] = useState(initialChecklist);
  const [calcMessage, setCalcMessage] = useState<string | null>(null);

  function submitPaperToCoe(id: string) {
    setPapers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "PENDING APPROVAL" } : p,
      ),
    );
  }

  function updateExamScore(id: string, value: string) {
    setCorrectionRoster((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, exam: value === "" ? null : Number(value) }
          : s,
      ),
    );
  }

  function toggleChecklistItem(id: string) {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  }

  function handleCalculate() {
    setCalcMessage("✓ Final scores recalculated.");
    window.setTimeout(() => setCalcMessage(null), 3000);
  }

  const visibleRoster =
    activeTab === "Pending"
      ? correctionRoster
      : correctionRoster.filter((s) => s.exam !== null);

  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: "Exams", href: "/teacher/exam-papers" },
          { label: "Final Assessment Manager" },
        ]}
        separator=">"
        title="Exam Paper Control Panel"
        description="Course: Advanced Data Structures (CS-402) - Semester 4"
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
              <EditIcon className="h-4 w-4" />
              Create New Paper
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-stone-900">
                Draft Papers for Submission
              </h2>
              <p className="text-sm text-stone-500">
                {papers.filter((p) => p.status !== "APPROVED").length}{" "}
                Pending COE Approval
              </p>
            </div>
            <ul className="divide-y divide-stone-100">
              {papers.map((paper) => (
                <li key={paper.id} className="py-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        paper.status === "APPROVED"
                          ? "bg-emerald-600 text-white"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {paper.status === "APPROVED" ? (
                        <CheckCircleIcon className="h-5 w-5" />
                      ) : (
                        <FileTextIcon className="h-5 w-5" />
                      )}
                    </span>
                    <div className="min-w-[220px] flex-1">
                      <p className="font-semibold text-stone-900">
                        {paper.title}
                      </p>
                      <p className="text-sm text-stone-500">{paper.meta}</p>
                    </div>
                    {paper.status === "DRAFT" && (
                      <p className="text-sm text-stone-500">{paper.detail}</p>
                    )}
                    <StatusBadge
                      label={paper.status}
                      tone={paperStatusTone[paper.status]}
                    />
                    {paper.status === "DRAFT" ? (
                      <>
                        <button
                          type="button"
                          aria-label="Preview paper"
                          onClick={() =>
                            setExpandedId((id) =>
                              id === paper.id ? null : paper.id,
                            )
                          }
                          className="text-stone-400 hover:text-stone-600"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => submitPaperToCoe(paper.id)}
                          className="rounded-lg bg-rose-800 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-900"
                        >
                          Submit to COE
                        </button>
                      </>
                    ) : paper.status === "PENDING APPROVAL" ? (
                      <span className="text-sm font-medium text-stone-400">
                        Submitted ✓
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          aria-label="More options"
                          className="text-stone-400 hover:text-stone-600"
                        >
                          <MoreVerticalIcon className="h-5 w-5" />
                        </button>
                        <p className="w-full pl-14 text-sm text-stone-500 sm:w-auto sm:pl-0">
                          {paper.detail}
                        </p>
                      </>
                    )}
                  </div>
                  {expandedId === paper.id && (
                    <p className="mt-3 rounded-lg bg-stone-50 p-3 text-sm text-stone-600">
                      {paper.previewText}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  Paper Correction Hub
                </h2>
                <p className="text-sm text-stone-500">
                  Digital evaluation for Semester Finals
                </p>
              </div>
              <div className="flex rounded-lg border border-stone-200 bg-stone-50 p-1">
                {(["Pending", "Graded"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
                      activeTab === tab
                        ? "bg-white text-stone-900 shadow-sm"
                        : "text-stone-500"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs font-bold uppercase tracking-wide text-stone-400">
                    <th className="py-3">Student Name</th>
                    <th className="py-3">Internal (40)</th>
                    <th className="py-3">Exam (60)</th>
                    <th className="py-3">Final Score</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {visibleRoster.map((student) => {
                    const finalScore =
                      student.exam !== null
                        ? student.internal + student.exam
                        : null;
                    return (
                      <tr key={student.id}>
                        <td className="py-4">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${student.avatarColorClassName}`}
                            >
                              {student.initials}
                            </span>
                            <span className="font-medium text-stone-800">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-stone-700">
                          {student.internal.toFixed(1)}
                        </td>
                        <td className="py-4">
                          <input
                            type="number"
                            min={0}
                            max={60}
                            value={student.exam ?? ""}
                            placeholder="Enter"
                            onChange={(e) =>
                              updateExamScore(student.id, e.target.value)
                            }
                            className="w-20 rounded-lg border border-stone-200 px-3 py-1.5 text-stone-800 outline-none focus:border-rose-400"
                          />
                        </td>
                        <td className="py-4">
                          {finalScore !== null ? (
                            <span className="rounded-full bg-rose-50 px-3 py-1 font-bold text-rose-700">
                              {finalScore.toFixed(1)}
                            </span>
                          ) : (
                            <span className="italic text-stone-400">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-4">
                          <button
                            type="button"
                            className="text-sm font-semibold text-rose-700 hover:underline"
                          >
                            {finalScore !== null
                              ? "Review Script"
                              : "Start Grading"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 pt-5">
              <p className="text-sm text-stone-500">
                Showing {correctionRoster.length} of 42 students
              </p>
              <div className="flex items-center gap-4">
                {calcMessage && (
                  <span className="text-sm font-medium text-emerald-700">
                    {calcMessage}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="flex items-center gap-2 rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
                >
                  <CalculatorIcon className="h-4 w-4" />
                  Calculate Final Scores
                </button>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-stone-500">
              Class Performance
            </h3>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-stone-600">
                Grading Progress
              </span>
              <span className="text-lg font-bold text-rose-700">68%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
              <div className="h-full w-[68%] rounded-full bg-rose-700" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-stone-200 p-4 text-center">
                <p className="text-xs text-stone-500">Avg. Score</p>
                <p className="mt-1 text-xl font-bold text-stone-900">74.2</p>
              </div>
              <div className="rounded-xl border border-stone-200 p-4 text-center">
                <p className="text-xs text-stone-500">Pass Rate</p>
                <p className="mt-1 text-xl font-bold text-emerald-600">92%</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-stone-500">
              Submission Checklist
            </h3>
            <ul className="mt-4 space-y-4">
              {checklist.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleChecklistItem(item.id)}
                    aria-label={`Toggle ${item.title}`}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      item.done
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-stone-300 text-transparent"
                    }`}
                  >
                    <CheckCircleIcon className="h-3.5 w-3.5" />
                  </button>
                  <div>
                    <p className="text-sm font-semibold text-stone-800">
                      {item.title}
                    </p>
                    <p className="text-xs text-stone-500">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={downloadGuidelines}
              className="mt-5 w-full rounded-lg border border-rose-300 bg-white py-2.5 text-sm font-semibold text-rose-800 hover:bg-rose-50"
            >
              Download Guidelines
            </button>
          </div>

          <PromoBanner
            eyebrow="Tutorial"
            title="Digital Correction Tools"
            description="Learn how to grade exam scripts faster with inline annotations."
          />
        </aside>
      </div>
    </div>
  );
}
