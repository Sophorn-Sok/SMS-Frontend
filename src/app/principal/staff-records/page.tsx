"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { PromoBanner } from "@/components/promo-banner";
import {
  CheckCircleIcon,
  DownloadIcon,
  EditIcon,
  FileTextIcon,
  PartyIcon,
  UserPlusIcon,
} from "@/components/icons";
import {
  departments,
  hiringPipeline,
  milestones,
  recentChanges,
  tenureReviews,
  type RecordChange,
} from "@/lib/principal/staff-records-data";

const changeIcons: Record<RecordChange["kind"], typeof CheckCircleIcon> = {
  check: CheckCircleIcon,
  edit: EditIcon,
  profile: FileTextIcon,
};

function downloadDepartmentsCsv() {
  const header = ["Department", "Faculty Count", "Recruitment Status", "S:F Ratio"];
  const rows = departments.map((d) => [d.name, String(d.facultyCount), d.recruitmentLabel, d.ratio]);
  const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "departmental-distribution.csv";
  link.click();
  URL.revokeObjectURL(url);
}

interface RecruitForm {
  name: string;
  department: string;
  position: string;
}

const emptyForm: RecruitForm = { name: "", department: "", position: "" };

export default function StaffRecordsPage() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<RecruitForm>(emptyForm);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.department || !form.position) return;
    setConfirmation(`Recruitment request for ${form.position} (${form.department}) submitted.`);
    setForm(emptyForm);
    setShowModal(false);
    window.setTimeout(() => setConfirmation(null), 4000);
  }

  return (
    <div>
      <PageHeader
        title="Principal - Staff Records Management"
        description="Holistic overview of institutional human capital and faculty lifecycle."
        actions={
          <>
            <button
              type="button"
              onClick={downloadDepartmentsCsv}
              className="flex items-center gap-2 rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
            >
              <DownloadIcon className="h-4 w-4" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
            >
              <UserPlusIcon className="h-4 w-4" />
              Recruit Staff
            </button>
          </>
        }
      />

      {confirmation && (
        <p className="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {confirmation}
        </p>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-stone-500">Total Faculty</p>
          <p className="mt-2 text-2xl font-bold text-stone-900">
            284 <span className="text-sm font-semibold text-emerald-600">↑3%</span>
          </p>
          <p className="mt-1 text-sm text-stone-500">vs. previous academic year</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-stone-500">
            Avg. Student Ratio
          </p>
          <p className="mt-2 text-2xl font-bold text-stone-900">1:18</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
            <div className="h-full w-3/4 rounded-full bg-rose-700" />
          </div>
          <p className="mt-2 text-sm text-stone-500">Target threshold: 1:15</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-stone-500">
            Open Recruitments
          </p>
          <p className="mt-2 text-2xl font-bold text-stone-900">
            12 <span className="text-sm font-semibold text-amber-600">!High</span>
          </p>
          <p className="mt-1 text-sm text-stone-500">Critical need in Computer Science</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-stone-500">
            Upcoming Reviews
          </p>
          <p className="mt-2 text-2xl font-bold text-stone-900">08</p>
          <div className="mt-2 flex -space-x-2">
            {["EJ", "MS", "TK"].map((initials) => (
              <span
                key={initials}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-rose-100 text-[10px] font-bold text-rose-700"
              >
                {initials}
              </span>
            ))}
            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-stone-200 text-[10px] font-bold text-stone-600">
              +5
            </span>
          </div>
          <p className="mt-2 text-sm text-stone-500">Tenure reviews due this quarter</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-stone-200 bg-white">
            <div className="flex items-center justify-between border-b border-stone-200 p-6">
              <h2 className="text-xl font-bold text-stone-900">Departmental Distribution</h2>
              <button type="button" className="text-sm font-semibold text-rose-700 hover:underline">
                View All Departments
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs font-bold uppercase tracking-wide text-stone-400">
                    <th className="px-6 py-3">Department</th>
                    <th className="px-6 py-3">Faculty Count</th>
                    <th className="px-6 py-3">Recruitment Status</th>
                    <th className="px-6 py-3">S:F Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {departments.map((dept) => (
                    <tr key={dept.id}>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2 font-semibold text-stone-900">
                          <span className={`h-2 w-2 rounded-full ${dept.dotColorClassName}`} />
                          {dept.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-stone-600">{dept.facultyCount} Active</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${dept.recruitmentColorClassName}`}
                        >
                          {dept.recruitmentLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={
                            dept.ratioConcern
                              ? "font-bold text-rose-700"
                              : "text-stone-700"
                          }
                        >
                          {dept.ratio}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-stone-500">
                Hiring Pipeline
              </h3>
              <ul className="mt-4 space-y-4">
                {hiringPipeline.map((stage) => (
                  <li key={stage.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-700">{stage.label}</span>
                      <span className="font-bold text-stone-900">{stage.count}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                      <div
                        className="h-full rounded-full bg-rose-700"
                        style={{ width: `${stage.percent}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <PromoBanner
              eyebrow="Recruitment Campaign"
              title="CS Expansion Phase II"
              description="Focus on attracting Senior Research Fellows for the 2024-25 Innovation Cycle. Budget approved for 5 full-time faculty positions."
            />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h3 className="text-lg font-bold text-stone-900">Upcoming Tenure Reviews</h3>
            <ul className="mt-4 space-y-4">
              {tenureReviews.map((review) => (
                <li key={review.id} className="flex items-center gap-3">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${review.colorClassName}`}
                  >
                    {review.initials}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-stone-900">{review.name}</p>
                    <p className="text-sm text-stone-500">Dept: {review.department}</p>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                        {review.dueDate}
                      </span>
                      <button
                        type="button"
                        className="text-xs font-semibold text-rose-700 hover:underline"
                      >
                        Review File
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-4 w-full rounded-lg border border-stone-200 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50"
            >
              View Full Calendar
            </button>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900">Staff Milestones</h3>
              <PartyIcon className="h-5 w-5 text-amber-500" />
            </div>
            <ul className="mt-4 space-y-4">
              {milestones.map((m) => (
                <li key={m.id} className="flex items-start gap-3">
                  <div className="shrink-0 rounded-lg bg-rose-50 px-2.5 py-1 text-center">
                    <p className="text-[10px] font-bold uppercase text-rose-700">{m.month}</p>
                    <p className="text-sm font-extrabold text-rose-800">{m.day}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">{m.title}</p>
                    <p className="text-sm text-stone-500">{m.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-stone-500">
              Recent Record Changes
            </h3>
            <ul className="mt-4 space-y-3">
              {recentChanges.map((change) => {
                const Icon = changeIcons[change.kind];
                return (
                  <li key={change.id} className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0 text-stone-400" />
                    <span className="flex-1 text-sm text-stone-700">{change.text}</span>
                    <span className="shrink-0 text-xs text-stone-400">{change.meta}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h3 className="text-lg font-bold text-stone-900">Recruit Staff</h3>
            <div className="mt-4 space-y-3">
              <input
                required
                placeholder="Candidate name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-rose-400"
              />
              <input
                required
                placeholder="Department"
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-rose-400"
              />
              <input
                required
                placeholder="Position"
                value={form.position}
                onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-rose-400"
              />
            </div>
            <div className="mt-5 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-sm font-semibold text-stone-500 hover:text-stone-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
