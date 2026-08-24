"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  DownloadIcon,
  EnvelopeIcon,
  FilterIcon,
  IdCardIcon,
  MoreVerticalIcon,
  PrinterIcon,
  UserPlusIcon,
  UsersIcon,
  ZapIcon,
} from "@/components/icons";
import { ROLE_OPTIONS, initialUsers, type AppUser } from "@/lib/admin/users-data";

interface NewUserForm {
  name: string;
  email: string;
  role: string;
}

const emptyForm: NewUserForm = { name: "", email: "", role: ROLE_OPTIONS[0] };

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(-2)
    .join("")
    .toUpperCase();
}

function downloadUsersCsv(users: AppUser[]) {
  const header = ["Name", "Email", "Role", "Status", "Last Login"];
  const rows = users.map((u) => [u.name, u.email, u.role, u.status, u.lastLogin]);
  const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "users.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function ManageUserAccountsPage() {
  const [users, setUsers] = useState(initialUsers);
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortAsc, setSortAsc] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewUserForm>(emptyForm);

  const filteredUsers = useMemo(() => {
    let list = users;
    if (roleFilter !== "All Roles") list = list.filter((u) => u.role === roleFilter);
    if (statusFilter !== "All Status") list = list.filter((u) => u.status === statusFilter);
    list = [...list].sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
    );
    return list;
  }, [users, roleFilter, statusFilter, sortAsc]);

  function toggleStatus(id: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Deactivated" : "Active" }
          : u,
      ),
    );
  }

  function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    const newUser: AppUser = {
      id: `u-${Date.now()}`,
      name: form.name,
      email: form.email,
      initials: initialsOf(form.name) || "??",
      avatarColorClassName: "bg-rose-100 text-rose-700",
      role: form.role,
      status: "Active",
      lastLogin: "Never",
    };
    setUsers((prev) => [newUser, ...prev]);
    setForm(emptyForm);
    setShowModal(false);
  }

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage institutional access, roles, and security permissions for all system users."
        actions={
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
          >
            <UserPlusIcon className="h-4 w-4" />
            Create New User
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-stone-500">
              Total Users
            </p>
            <p className="mt-1 text-2xl font-bold text-stone-900">{(users.length + 1279).toLocaleString()}</p>
            <p className="mt-1 text-sm font-semibold text-emerald-600">↗ +12 this week</p>
          </div>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
            <UsersIcon className="h-6 w-6" />
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-stone-500">
              Active Sessions
            </p>
            <p className="mt-1 text-2xl font-bold text-stone-900">412</p>
            <p className="mt-1 text-sm text-stone-500">Current real-time traffic</p>
          </div>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
            <IdCardIcon className="h-6 w-6" />
          </span>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-stone-500">
              Pending Invitations
            </p>
            <p className="mt-1 text-2xl font-bold text-stone-900">28</p>
            <p className="mt-1 text-sm font-semibold text-amber-600">⚠ Require follow-up</p>
          </div>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <EnvelopeIcon className="h-6 w-6" />
          </span>
        </div>
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-stone-200 p-5">
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none rounded-lg border border-stone-300 bg-white py-2 pl-9 pr-8 text-sm font-medium text-stone-700 outline-none focus:border-rose-400"
            >
              <option>All Roles</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <FilterIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-lg border border-stone-300 bg-white py-2 pl-9 pr-8 text-sm font-medium text-stone-700 outline-none focus:border-rose-400"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Deactivated</option>
            </select>
            <ZapIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          </div>
          <span className="h-6 w-px bg-stone-200" />
          <p className="text-sm text-stone-500">
            Showing {filteredUsers.length} of {(users.length + 1279).toLocaleString()} users
          </p>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadUsersCsv(filteredUsers)}
              aria-label="Download list"
              className="rounded-lg border border-stone-200 p-2 text-stone-500 hover:bg-stone-50"
            >
              <DownloadIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              aria-label="Print list"
              className="rounded-lg border border-stone-200 p-2 text-stone-500 hover:bg-stone-50"
            >
              <PrinterIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wide text-stone-400">
                <th className="px-6 py-3">
                  <button
                    type="button"
                    onClick={() => setSortAsc((v) => !v)}
                    className="flex items-center gap-1 hover:text-stone-600"
                  >
                    Name {sortAsc ? "↑" : "↓"}
                  </button>
                </th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Last Login</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${user.avatarColorClassName}`}
                      >
                        {user.initials}
                      </span>
                      <div>
                        <p className="font-semibold text-stone-900">{user.name}</p>
                        <p className="text-sm text-stone-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-stone-700">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          user.status === "Active" ? "bg-emerald-500" : "bg-rose-300"
                        }`}
                      />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-stone-600">{user.lastLogin}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="group relative inline-block">
                      <button
                        type="button"
                        aria-label="Row actions"
                        className="text-stone-400 hover:text-stone-600"
                      >
                        <MoreVerticalIcon className="h-4 w-4" />
                      </button>
                      <div className="invisible absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-stone-200 bg-white py-1 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => toggleStatus(user.id)}
                          className="block w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-50"
                        >
                          {user.status === "Active" ? "Deactivate" : "Reactivate"}
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-stone-400">
                    No users match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 px-6 py-4 text-sm">
          <p className="text-stone-500">
            Showing 1 to {filteredUsers.length} of {(users.length + 1279).toLocaleString()} entries
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
            <button type="button" className="rounded-lg px-3 py-1.5 text-stone-600 hover:bg-stone-50">
              3
            </button>
            <span className="px-1 text-stone-400">...</span>
            <button type="button" className="rounded-lg px-3 py-1.5 text-stone-600 hover:bg-stone-50">
              129
            </button>
            <button type="button" className="rounded-lg border border-stone-200 px-3 py-1.5 text-stone-600 hover:bg-stone-50">
              Next
            </button>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form
            onSubmit={handleCreateUser}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h3 className="text-lg font-bold text-stone-900">Create New User</h3>
            <div className="mt-4 space-y-3">
              <input
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-rose-400"
              />
              <input
                required
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-rose-400"
              />
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r}>{r}</option>
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
                Create User
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
