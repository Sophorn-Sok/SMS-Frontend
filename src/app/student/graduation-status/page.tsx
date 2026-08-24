"use client";

import { useRef, useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  CalendarArrowIcon,
  CheckCircleIcon,
  DownloadIcon,
  GraduationCapIcon,
  UploadCloudIcon,
  XCircleIcon,
} from "@/components/icons";
import {
  creditCompletion,
  graduationForecast,
  graduationOverview,
  initialChecklist,
  type ChecklistItem,
} from "@/lib/student/graduation-data";

function stateStyles(state: ChecklistItem["state"]) {
  if (state === "done") {
    return { iconBg: "bg-emerald-600 text-white", icon: <CheckCircleIcon className="h-4 w-4" /> };
  }
  if (state === "pending") {
    return {
      iconBg: "bg-amber-100 text-amber-600",
      icon: (
        <span className="flex gap-0.5">
          <span className="h-1 w-1 rounded-full bg-amber-600" />
          <span className="h-1 w-1 rounded-full bg-amber-600" />
          <span className="h-1 w-1 rounded-full bg-amber-600" />
        </span>
      ),
    };
  }
  return { iconBg: "bg-rose-100 text-rose-600", icon: <XCircleIcon className="h-4 w-4" /> };
}

function downloadAudit() {
  const lines = [
    "Graduation Audit Export",
    "",
    `Eligibility: ${graduationOverview.eligibilityPercent}% (${graduationOverview.status})`,
    `Current GPA: ${graduationOverview.currentGpa}`,
    `Credits: ${creditCompletion.earned} / ${creditCompletion.required}`,
    "",
    ...creditCompletion.breakdown.map((b) => `  ${b.label}: ${b.earned}/${b.total}`),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "graduation-audit.txt";
  link.click();
  URL.revokeObjectURL(url);
}

export default function StudentGraduationStatusPage() {
  const [checklist, setChecklist] = useState(initialChecklist);
  const [applyMessage, setApplyMessage] = useState<string | null>(null);
  const [documents, setDocuments] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function resolveItem(id: string) {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, state: "done" } : item)),
    );
  }

  function addDocuments(files: FileList | null) {
    if (!files || files.length === 0) return;
    setDocuments((prev) => [...prev, ...Array.from(files).map((f) => f.name)]);
  }

  function handleApply() {
    setApplyMessage("Graduation application submitted for review.");
    window.setTimeout(() => setApplyMessage(null), 4000);
  }

  const ringDegrees = (graduationOverview.eligibilityPercent / 100) * 360;

  return (
    <div>
      <PageHeader
        title="Graduation Status"
        description="Real-time tracking of your academic journey and degree eligibility."
        actions={
          <>
            <button
              type="button"
              onClick={downloadAudit}
              className="flex items-center gap-2 rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
            >
              <DownloadIcon className="h-4 w-4" />
              Export Audit
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
            >
              Apply for Graduation
            </button>
          </>
        }
      />

      {applyMessage && (
        <p className="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {applyMessage}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500">
            Graduation Eligibility
          </h2>
          <div className="mt-6 flex flex-col items-center">
            <div
              className="flex h-40 w-40 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#9f1239 ${ringDegrees}deg, #f3d9de ${ringDegrees}deg)`,
              }}
            >
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-3xl font-extrabold text-stone-900">
                  {graduationOverview.eligibilityPercent}%
                </span>
                <span className="text-xs font-semibold text-stone-400">Eligible</span>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 divide-x divide-stone-200 border-t border-stone-200 pt-4 text-center">
            <div>
              <p className="text-2xl font-extrabold text-emerald-600">
                {graduationOverview.currentGpa}
              </p>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                Current GPA
              </p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-rose-700">
                {graduationOverview.status}
              </p>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                Status
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6">
          <GraduationCapIcon className="pointer-events-none absolute right-4 top-4 h-8 w-8 text-rose-100" />
          <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500">
            Credit Hour Completion
          </h2>
          <p className="mt-2">
            <span className="text-4xl font-extrabold text-rose-700">
              {creditCompletion.earned}
            </span>
            <span className="text-stone-500"> / {creditCompletion.required} Required Credits</span>
          </p>
          <ul className="mt-6 space-y-4">
            {creditCompletion.breakdown.map((item) => (
              <li key={item.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-stone-700">{item.label}</span>
                  <span className="font-bold text-stone-900">
                    {item.earned} / {item.total}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-rose-100">
                  <div
                    className={`h-full rounded-full ${item.colorClassName}`}
                    style={{ width: `${(item.earned / item.total) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500">
            Prerequisite Checklist
          </h2>
          <ul className="mt-4 space-y-3">
            {checklist.map((item) => {
              const { iconBg, icon } = stateStyles(item.state);
              return (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconBg}`}
                  >
                    {icon}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-stone-900">{item.title}</p>
                    <p className="text-sm text-stone-500">{item.description}</p>
                  </div>
                  {item.state !== "done" && item.actionLabel && (
                    <button
                      type="button"
                      onClick={() => resolveItem(item.id)}
                      className={`shrink-0 rounded-lg px-4 py-1.5 text-sm font-semibold ${
                        item.state === "blocked"
                          ? "bg-rose-800 text-white hover:bg-rose-900"
                          : "border border-rose-300 text-rose-800 hover:bg-rose-50"
                      }`}
                    >
                      {item.actionLabel}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500">
            Graduation Forecast
          </h2>
          <div className="mt-4 flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
              <CalendarArrowIcon className="h-7 w-7" />
            </span>
            <div>
              <p className="text-xl font-extrabold text-stone-900">{graduationForecast.date}</p>
              <p className="text-sm text-stone-500">{graduationForecast.label}</p>
            </div>
          </div>
          <ul className="mt-5 space-y-2">
            {graduationForecast.milestones.map((m) => (
              <li key={m.id} className="flex items-center gap-2 text-sm text-stone-700">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                {m.label}: <span className="font-semibold">{m.date}</span>
              </li>
            ))}
          </ul>
          <div className="relative mt-5 overflow-hidden rounded-xl bg-rose-50 p-4">
            <GraduationCapIcon className="pointer-events-none absolute -bottom-2 -right-2 h-16 w-16 text-rose-200/60" />
            <p className="relative text-sm font-bold italic text-rose-700">Administrative Note:</p>
            <p className="relative mt-1 text-sm italic text-stone-600">
              &quot;{graduationForecast.note}&quot;
            </p>
          </div>
        </section>
      </div>

      <div
        className={`mt-6 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
          isDragging ? "border-rose-400 bg-rose-50/60" : "border-rose-200 bg-white"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addDocuments(e.dataTransfer.files);
        }}
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
          <UploadCloudIcon className="h-7 w-7" />
        </span>
        <p className="mt-4 text-xl font-bold text-stone-900">Upload Supporting Documents</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-stone-500">
          Drag and drop your clearance certificates, external transfer credits, or identity
          documents for final verification.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => addDocuments(e.target.files)}
        />
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
          >
            Select Files
          </button>
          <button
            type="button"
            className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
          >
            View History
          </button>
        </div>
        {documents.length > 0 && (
          <ul className="mx-auto mt-5 max-w-md space-y-2 text-left">
            {documents.map((name, i) => (
              <li
                key={`${name}-${i}`}
                className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700"
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
