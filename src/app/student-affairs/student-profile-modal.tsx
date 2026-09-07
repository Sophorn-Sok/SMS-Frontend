"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StatusBadge } from "@/components/status-badge";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  DownloadIcon,
  EditIcon,
  FileTextIcon,
  PlusIcon,
  ShieldCheckIcon,
  UploadCloudIcon,
  XIcon,
} from "@/components/icons";
import { apiFetch } from "@/lib/api/client";
import { useApiQuery } from "@/lib/api/hooks";
import type {
  AddStudentDocumentBody,
  DocumentType,
  LinkStudentAccountBody,
  StudentDTO,
  StudentDocumentDTO,
  StudentStatus,
} from "@/lib/api/types";

const statusToneMap: Record<StudentStatus, "green" | "amber" | "rose" | "sky" | "slate"> = {
  ENROLLED: "green",
  PENDING: "amber",
  WITHDRAWN: "rose",
  GRADUATED: "sky",
  ON_LEAVE: "slate",
};

const statusLabelMap: Record<StudentStatus, string> = {
  ENROLLED: "Enrolled",
  PENDING: "Pending",
  WITHDRAWN: "Withdrawn",
  GRADUATED: "Graduated",
  ON_LEAVE: "On Leave",
};

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  ID_CARD: "National ID / Passport",
  TRANSCRIPT: "Academic Transcript",
  CERTIFICATE: "Graduation Certificate",
  OTHER: "Other Supporting Document",
};

interface StudentProfileModalProps {
  student: StudentDTO;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export function StudentProfileModal({
  student,
  isOpen,
  onClose,
  onEdit,
}: StudentProfileModalProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "account">("overview");

  // Document upload state
  const [documentType, setDocumentType] = useState<DocumentType>("TRANSCRIPT");
  const [fileUrl, setFileUrl] = useState("");
  const [docFeedback, setDocFeedback] = useState<string | null>(null);

  // Link account state
  const [userIdInput, setUserIdInput] = useState("");
  const [accountFeedback, setAccountFeedback] = useState<string | null>(null);

  // 1. Fetch Student Documents
  const documentsQuery = useApiQuery<StudentDocumentDTO[]>(
    ["student-affairs", "students", student.id, "documents"],
    `/student-affairs/students/${student.id}/documents`,
    { enabled: isOpen }
  );

  // 2. Add Document Mutation
  const addDocMutation = useMutation({
    mutationFn: (body: AddStudentDocumentBody) =>
      apiFetch<StudentDocumentDTO>(
        `/student-affairs/students/${student.id}/documents`,
        { method: "POST", body }
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["student-affairs", "students", student.id, "documents"],
      });
      setFileUrl("");
      setDocFeedback("Document attached successfully.");
      setTimeout(() => setDocFeedback(null), 3000);
    },
    onError: (err: Error) => {
      setDocFeedback(err.message || "Failed to attach document.");
    },
  });

  // 3. Delete Document Mutation
  const deleteDocMutation = useMutation({
    mutationFn: (docId: string) =>
      apiFetch<void>(
        `/student-affairs/students/${student.id}/documents/${docId}`,
        { method: "DELETE" }
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["student-affairs", "students", student.id, "documents"],
      });
      setDocFeedback("Document removed.");
      setTimeout(() => setDocFeedback(null), 3000);
    },
    onError: (err: Error) => {
      setDocFeedback(err.message || "Failed to remove document.");
    },
  });

  // 4. Link User Account Mutation
  const linkAccountMutation = useMutation({
    mutationFn: (body: LinkStudentAccountBody) =>
      apiFetch<StudentDTO>(
        `/student-affairs/students/${student.id}/link-account`,
        { method: "PATCH", body }
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["student-affairs", "students"],
      });
      setUserIdInput("");
      setAccountFeedback("User account linked successfully!");
      setTimeout(() => setAccountFeedback(null), 3500);
    },
    onError: (err: Error) => {
      setAccountFeedback(err.message || "Failed to link user account.");
    },
  });

  if (!isOpen) return null;

  const documents = documentsQuery.data?.data ?? [];

  function handleAddDocument(e: React.FormEvent) {
    e.preventDefault();
    if (!fileUrl.trim()) return;
    addDocMutation.mutate({
      documentType,
      fileUrl: fileUrl.trim(),
    });
  }

  function handleLinkAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!userIdInput.trim()) return;
    linkAccountMutation.mutate({ userId: userIdInput.trim() });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 p-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-stone-900">
                {student.firstName} {student.lastName}
              </h3>
              <StatusBadge
                label={statusLabelMap[student.status] || student.status}
                tone={statusToneMap[student.status] || "slate"}
              />
            </div>
            <p className="font-mono text-xs font-semibold text-rose-700 mt-1">
              ID: {student.studentNumber}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              <EditIcon className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-1.5 text-stone-400 hover:text-stone-600"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-100 px-6">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`border-b-2 py-3 px-3 text-xs font-bold transition-colors ${
              activeTab === "overview"
                ? "border-rose-800 text-rose-800"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            Profile Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("documents")}
            className={`flex items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-bold transition-colors ${
              activeTab === "documents"
                ? "border-rose-800 text-rose-800"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            Documents
            <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[10px] font-bold text-stone-600">
              {documents.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("account")}
            className={`border-b-2 py-3 px-3 text-xs font-bold transition-colors ${
              activeTab === "account"
                ? "border-rose-800 text-rose-800"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            Student Account
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ─── TAB 1: OVERVIEW ─── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-stone-100 bg-stone-50/50 p-4 text-sm">
                <div>
                  <p className="text-xs font-bold uppercase text-stone-400">Department</p>
                  <p className="font-semibold text-stone-800 mt-0.5">
                    {student.department?.name || "Unassigned"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-stone-400">Enrollment Date</p>
                  <p className="font-semibold text-stone-800 mt-0.5">
                    {student.enrollmentDate
                      ? new Date(student.enrollmentDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-stone-400">Date of Birth</p>
                  <p className="font-semibold text-stone-800 mt-0.5">
                    {student.dateOfBirth
                      ? new Date(student.dateOfBirth).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-stone-400">Gender</p>
                  <p className="font-semibold text-stone-800 mt-0.5">
                    {student.gender || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-stone-400">Blood Group</p>
                  <p className="font-semibold text-stone-800 mt-0.5">
                    {student.bloodGroup ? student.bloodGroup.replace("_", " ") : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-stone-400">Login Account</p>
                  <p className="font-semibold text-stone-800 mt-0.5 flex items-center gap-1">
                    {student.userId ? (
                      <span className="text-emerald-700 flex items-center gap-1 text-xs">
                        <CheckCircleIcon className="h-3.5 w-3.5" /> Linked
                      </span>
                    ) : (
                      <span className="text-stone-400 text-xs">Not linked</span>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Contact & Guardian
                </h4>
                <div className="grid grid-cols-2 gap-4 rounded-xl border border-stone-100 bg-stone-50/50 p-4 text-sm">
                  <div>
                    <p className="text-xs font-bold uppercase text-stone-400">Personal Email</p>
                    <p className="font-medium text-stone-800 mt-0.5">
                      {student.personalEmail || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-stone-400">Phone Number</p>
                    <p className="font-medium text-stone-800 mt-0.5">
                      {student.contactDetails || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-stone-400">Guardian Name</p>
                    <p className="font-medium text-stone-800 mt-0.5">
                      {student.guardianName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-stone-400">Guardian Contact</p>
                    <p className="font-medium text-stone-800 mt-0.5">
                      {student.guardianContact || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 2: DOCUMENTS ─── */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              {docFeedback && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-700">
                  {docFeedback}
                </p>
              )}

              {/* Upload / Attach Form */}
              <form
                onSubmit={handleAddDocument}
                className="rounded-xl border border-dashed border-stone-200 p-4 bg-stone-50/40"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 flex items-center gap-1.5">
                  <UploadCloudIcon className="h-4 w-4 text-rose-700" />
                  Attach New Document
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1">
                      Document Type
                    </label>
                    <div className="relative">
                      <select
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                        className="w-full appearance-none rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs outline-none focus:border-rose-400"
                      >
                        {(Object.keys(DOCUMENT_TYPE_LABELS) as DocumentType[]).map((type) => (
                          <option key={type} value={type}>
                            {DOCUMENT_TYPE_LABELS[type]}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1">
                      Document File URL / Cloud Link
                    </label>
                    <input
                      type="url"
                      required
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      placeholder="https://storage.kit.test/docs/..."
                      className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs outline-none focus:border-rose-400"
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={addDocMutation.isPending}
                    className="flex items-center gap-1.5 rounded-lg bg-rose-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-900 disabled:opacity-50"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                    {addDocMutation.isPending ? "Attaching…" : "Add Document"}
                  </button>
                </div>
              </form>

              {/* Documents List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Attached Records ({documents.length})
                </h4>
                {documentsQuery.isLoading && (
                  <p className="py-4 text-center text-xs text-stone-400">
                    Loading student documents…
                  </p>
                )}
                {documentsQuery.isSuccess && documents.length === 0 && (
                  <div className="rounded-xl border border-stone-200 p-6 text-center text-xs text-stone-400">
                    No documents uploaded for this student yet.
                  </div>
                )}
                {documentsQuery.isSuccess &&
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-xl border border-stone-200 p-3 hover:border-rose-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
                          <FileTextIcon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-stone-800">
                            {DOCUMENT_TYPE_LABELS[doc.documentType] || doc.documentType}
                          </p>
                          <p className="text-[10px] text-stone-400">
                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-lg border border-stone-200 px-2.5 py-1 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                        >
                          <DownloadIcon className="h-3 w-3" />
                          View File
                        </a>
                        <button
                          type="button"
                          disabled={deleteDocMutation.isPending}
                          onClick={() => deleteDocMutation.mutate(doc.id)}
                          className="rounded-lg p-1 text-stone-400 hover:text-rose-600 disabled:opacity-50"
                          title="Delete document"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ─── TAB 3: STUDENT USER ACCOUNT ─── */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-stone-200 p-5 bg-stone-50/50">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-800">
                    <ShieldCheckIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">
                      Self-Service Portal Access
                    </h4>
                    <p className="text-xs text-stone-500 mt-1">
                      Students can access their individual course schedules, examination results,
                      and attendance records when their student profile is linked to a user account.
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-stone-200 pt-4">
                  {student.userId ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-stone-400 uppercase">Linked User ID</p>
                        <p className="font-mono text-xs font-bold text-emerald-700 mt-0.5">
                          {student.userId}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        Active Link
                      </span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-medium text-amber-700">
                        No user account is currently linked to this student record.
                      </p>
                      <form onSubmit={handleLinkAccount} className="mt-3 flex gap-2">
                        <input
                          type="text"
                          required
                          value={userIdInput}
                          onChange={(e) => setUserIdInput(e.target.value)}
                          placeholder="Enter User Account UUID"
                          className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-xs font-mono outline-none focus:border-rose-400"
                        />
                        <button
                          type="submit"
                          disabled={linkAccountMutation.isPending}
                          className="rounded-lg bg-rose-800 px-4 py-2 text-xs font-bold text-white hover:bg-rose-900 disabled:opacity-50"
                        >
                          {linkAccountMutation.isPending ? "Linking…" : "Link Account"}
                        </button>
                      </form>
                    </div>
                  )}
                  {accountFeedback && (
                    <p className="mt-3 text-xs font-semibold text-rose-700">
                      {accountFeedback}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-100 p-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
