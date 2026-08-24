"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge, type StatusTone } from "@/components/status-badge";
import { DownloadIcon, FilterIcon, ShieldCheckIcon } from "@/components/icons";
import {
  ACTION_OPTIONS,
  initialAuditEvents,
  type AuditAction,
} from "@/lib/admin/audit-log-data";

const actionTone: Record<AuditAction, StatusTone> = {
  Create: "green",
  Update: "sky",
  Delete: "rose",
  Login: "slate",
  "Permission Change": "amber",
};

function downloadAuditCsv(events: typeof initialAuditEvents) {
  const header = ["Timestamp", "Actor", "Role", "Action", "Detail", "IP Address"];
  const rows = events.map((e) => [
    e.timestamp,
    e.actorName,
    e.actorRole,
    e.action,
    e.detail,
    e.ipAddress,
  ]);
  const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "system-audit-log.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function AuditLogPage() {
  const [actionFilter, setActionFilter] = useState<"All Actions" | AuditAction>(
    "All Actions",
  );

  const filteredEvents = useMemo(
    () =>
      actionFilter === "All Actions"
        ? initialAuditEvents
        : initialAuditEvents.filter((e) => e.action === actionFilter),
    [actionFilter],
  );

  const criticalCount = initialAuditEvents.filter(
    (e) => e.action === "Delete" || e.action === "Permission Change",
  ).length;
  const todayCount = initialAuditEvents.filter((e) =>
    e.timestamp.startsWith("Today"),
  ).length;

  return (
    <div>
      <PageHeader
        title="System Audit Log"
        description="Track every administrative action performed across the institution."
        actions={
          <button
            type="button"
            onClick={() => downloadAuditCsv(filteredEvents)}
            className="flex items-center gap-2 rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
          >
            <DownloadIcon className="h-4 w-4" />
            Export Log
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-stone-500">
              Total Events
            </p>
            <p className="mt-1 text-2xl font-bold text-stone-900">{(initialAuditEvents.length + 3417).toLocaleString()}</p>
            <p className="mt-1 text-sm text-stone-500">All-time recorded actions</p>
          </div>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
            <ShieldCheckIcon className="h-6 w-6" />
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-stone-500">
              Critical Events
            </p>
            <p className="mt-1 text-2xl font-bold text-stone-900">{criticalCount}</p>
            <p className="mt-1 text-sm font-semibold text-amber-600">Deletes &amp; permission changes</p>
          </div>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <ShieldCheckIcon className="h-6 w-6" />
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-stone-500">
              Events Today
            </p>
            <p className="mt-1 text-2xl font-bold text-stone-900">{todayCount}</p>
            <p className="mt-1 text-sm text-stone-500">Since midnight</p>
          </div>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
            <ShieldCheckIcon className="h-6 w-6" />
          </span>
        </div>
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-stone-200 p-5">
          <div className="relative">
            <select
              value={actionFilter}
              onChange={(e) =>
                setActionFilter(e.target.value as "All Actions" | AuditAction)
              }
              className="appearance-none rounded-lg border border-stone-300 bg-white py-2 pl-9 pr-8 text-sm font-medium text-stone-700 outline-none focus:border-rose-400"
            >
              <option>All Actions</option>
              {ACTION_OPTIONS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
            <FilterIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          </div>
          <p className="text-sm text-stone-500">
            Showing {filteredEvents.length} of {(initialAuditEvents.length + 3417).toLocaleString()} events
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wide text-stone-400">
                <th className="px-6 py-3">Actor</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Detail</th>
                <th className="px-6 py-3">IP Address</th>
                <th className="px-6 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${event.actorColorClassName}`}
                      >
                        {event.actorInitials}
                      </span>
                      <div>
                        <p className="font-semibold text-stone-800">{event.actorName}</p>
                        <p className="text-xs text-stone-400">{event.actorRole}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge label={event.action} tone={actionTone[event.action]} />
                  </td>
                  <td className="px-6 py-4 text-stone-600">{event.detail}</td>
                  <td className="px-6 py-4 font-mono text-stone-500">{event.ipAddress}</td>
                  <td className="px-6 py-4 text-stone-600">{event.timestamp}</td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-stone-400">
                    No events match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 px-6 py-4 text-sm">
          <p className="text-stone-500">
            Showing 1 to {filteredEvents.length} of {(initialAuditEvents.length + 3417).toLocaleString()} entries
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled
              className="rounded-lg border border-stone-200 px-3 py-1.5 text-stone-400"
            >
              Previous
            </button>
            <button type="button" className="rounded-lg bg-rose-800 px-3 py-1.5 font-semibold text-white">
              1
            </button>
            <button type="button" className="rounded-lg px-3 py-1.5 text-stone-600 hover:bg-stone-50">
              2
            </button>
            <button type="button" className="rounded-lg border border-stone-200 px-3 py-1.5 text-stone-600 hover:bg-stone-50">
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
