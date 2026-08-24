"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { DownloadIcon, FileTextIcon, PlusIcon } from "@/components/icons";
import {
  institutionalReports,
  reportCategories,
  type InstitutionalReport,
} from "@/lib/principal/institutional-reports-data";

function downloadReport(report: InstitutionalReport) {
  const blob = new Blob([`This is a placeholder export for "${report.name}".`], {
    type: "text/plain;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${report.name.toLowerCase().replace(/\s+/g, "-")}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

interface GenerateForm {
  name: string;
  category: string;
}

export default function InstitutionalReportsPage() {
  const [activeCategory, setActiveCategory] =
    useState<(typeof reportCategories)[number]>("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<GenerateForm>({ name: "", category: "Enrollment" });
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? institutionalReports
        : institutionalReports.filter((r) => r.category === activeCategory),
    [activeCategory],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return;
    setConfirmation(`"${form.name}" has been queued for generation.`);
    setForm({ name: "", category: "Enrollment" });
    setShowModal(false);
    window.setTimeout(() => setConfirmation(null), 4000);
  }

  return (
    <div>
      <PageHeader
        title="Institutional Reports"
        description="Browse, download, and generate reports across the institution."
        actions={
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
          >
            <PlusIcon className="h-4 w-4" />
            Generate New Report
          </button>
        }
      />

      {confirmation && (
        <p className="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {confirmation}
        </p>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">Total Reports</p>
          <p className="mt-1 text-2xl font-bold text-stone-900">{institutionalReports.length}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">Generated This Quarter</p>
          <p className="mt-1 text-2xl font-bold text-stone-900">6</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">Storage Used</p>
          <p className="mt-1 text-2xl font-bold text-stone-900">37.5 MB</p>
        </div>
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 p-6">
          <h2 className="text-lg font-bold text-stone-900">Report Library</h2>
          <div className="flex flex-wrap gap-2">
            {reportCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  activeCategory === category
                    ? "bg-rose-800 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wide text-stone-400">
                <th className="px-6 py-3">Report</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Size</th>
                <th className="px-6 py-3">Generated On</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
                        <FileTextIcon className="h-4 w-4" />
                      </span>
                      <span className="font-semibold text-stone-900">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      label={report.category}
                      tone={
                        report.category === "Enrollment"
                          ? "rose"
                          : report.category === "Finance"
                            ? "green"
                            : report.category === "Academics"
                              ? "sky"
                              : "amber"
                      }
                    />
                  </td>
                  <td className="px-6 py-4 text-stone-600">{report.type}</td>
                  <td className="px-6 py-4 text-stone-600">{report.size}</td>
                  <td className="px-6 py-4 text-stone-600">{report.generatedOn}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => downloadReport(report)}
                      aria-label={`Download ${report.name}`}
                      className="text-stone-500 hover:text-rose-700"
                    >
                      <DownloadIcon className="ml-auto h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-stone-400">
                    No reports in this category yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h3 className="text-lg font-bold text-stone-900">Generate New Report</h3>
            <div className="mt-4 space-y-3">
              <input
                required
                placeholder="Report name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-rose-400"
              />
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
              >
                {reportCategories
                  .filter((c) => c !== "All")
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
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
                Generate
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
