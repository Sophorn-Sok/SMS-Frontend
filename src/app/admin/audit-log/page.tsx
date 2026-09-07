"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge, type StatusTone } from "@/components/status-badge";
import { LoadingRow, ErrorRow, EmptyRow } from "@/components/query-states";
import { DownloadIcon, FilterIcon, ShieldCheckIcon } from "@/components/icons";
import { useApiQuery } from "@/lib/api/hooks";
import type { AuditActionDTO, AuditLogDTO } from "@/lib/api/types";
import {
  ACTION_OPTIONS,
  fromApiAuditLog,
  type AuditAction,
  type AuditEvent,
} from "@/lib/admin/audit-log-data";

const AUDIT_KEY = ["admin", "audit-logs"] as const;
const PAGE_SIZE = 20;

const actionTone: Record<AuditAction, StatusTone> = {
  Create: "green",
  Update: "sky",
  Publish: "amber",
  Approve: "green",
  Delete: "rose",
};

function downloadAuditCsv(events: AuditEvent[]) {
  const header = ["Timestamp", "Actor", "Email", "Action", "Module", "Detail", "Entity"];
  const rows = events.map((e) => [
    e.timestamp,
    e.actorName,
    e.actorEmail,
    e.action,
    e.module,
    e.detail,
    e.entityRef,
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
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState<"ALL" | AuditActionDTO>("ALL");

  const query = useApiQuery<AuditLogDTO[]>(
    [...AUDIT_KEY, { page, actionFilter }],
    "/admin/audit-logs",
    {
      query: {
        page,
        limit: PAGE_SIZE,
        action: actionFilter === "ALL" ? undefined : actionFilter,
      },
      placeholderData: (prev) => prev,
    },
  );

  const events = useMemo(
    () => (query.data?.data ?? []).map(fromApiAuditLog),
    [query.data],
  );

  const total = query.data?.pagination?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const criticalCount = events.filter(
    (e) => e.action === "Delete" || e.action === "Approve",
  ).length;

  return (
    <div>
      <PageHeader
        title="System Audit Log"
        description="Track every administrative action performed across the institution."
        actions={
          <button
            type="button"
            onClick={() => downloadAuditCsv(events)}
            className="flex items-center gap-2 rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
          >
            <DownloadIcon className="h-4 w-4" />
            Export Page
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-stone-500">
              Total Events
            </p>
            <p className="mt-1 text-2xl font-bold text-stone-900">
              {total.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-stone-500">All-time recorded actions</p>
          </div>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
            <ShieldCheckIcon className="h-6 w-6" />
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-stone-500">
              Critical (this page)
            </p>
            <p className="mt-1 text-2xl font-bold text-stone-900">{criticalCount}</p>
            <p className="mt-1 text-sm font-semibold text-amber-600">
              Deletes &amp; approvals
            </p>
          </div>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <ShieldCheckIcon className="h-6 w-6" />
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-stone-500">
              Page
            </p>
            <p className="mt-1 text-2xl font-bold text-stone-900">
              {page} / {pageCount}
            </p>
            <p className="mt-1 text-sm text-stone-500">{events.length} rows shown</p>
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
              onChange={(e) => {
                setPage(1);
                setActionFilter(e.target.value as "ALL" | AuditActionDTO);
              }}
              className="appearance-none rounded-lg border border-stone-300 bg-white py-2 pl-9 pr-8 text-sm font-medium text-stone-700 outline-none focus:border-rose-400"
            >
              <option value="ALL">All Actions</option>
              {ACTION_OPTIONS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
            <FilterIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          </div>
          <p className="text-sm text-stone-500">
            {query.isLoading
              ? "Loading…"
              : `Showing ${events.length} of ${total.toLocaleString()} events`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wide text-stone-400">
                <th className="px-6 py-3">Actor</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Module</th>
                <th className="px-6 py-3">Detail</th>
                <th className="px-6 py-3">Entity</th>
                <th className="px-6 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {query.isLoading && <LoadingRow colSpan={6} />}
              {query.isError && (
                <ErrorRow
                  colSpan={6}
                  message={query.error.message}
                  onRetry={() => query.refetch()}
                />
              )}
              {!query.isLoading &&
                !query.isError &&
                events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${event.actorColorClassName}`}
                        >
                          {event.actorInitials}
                        </span>
                        <div>
                          <p className="font-semibold text-stone-800">
                            {event.actorName}
                          </p>
                          <p className="text-xs text-stone-400">{event.actorEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        label={event.action}
                        tone={actionTone[event.action]}
                      />
                    </td>
                    <td className="px-6 py-4 text-stone-600">{event.module}</td>
                    <td className="px-6 py-4 text-stone-600">{event.detail}</td>
                    <td className="px-6 py-4 font-mono text-xs text-stone-500">
                      {event.entityRef}
                    </td>
                    <td className="px-6 py-4 text-stone-600">{event.timestamp}</td>
                  </tr>
                ))}
              {!query.isLoading && !query.isError && events.length === 0 && (
                <EmptyRow colSpan={6} label="No events match this filter." />
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 px-6 py-4 text-sm">
          <p className="text-stone-500">
            Page {page} of {pageCount} · {total.toLocaleString()} entries
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-stone-200 px-3 py-1.5 text-stone-600 hover:bg-stone-50 disabled:text-stone-300"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              className="rounded-lg border border-stone-200 px-3 py-1.5 text-stone-600 hover:bg-stone-50 disabled:text-stone-300"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
