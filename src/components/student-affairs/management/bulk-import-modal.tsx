"use client";

import { useRef, useState } from "react";
import { UploadCloudIcon, XIcon } from "@/components/icons";
import { apiFetch } from "@/lib/api/client";
import type { CreateStudentBody, ImportStudentsResultDTO } from "@/lib/api/types";

interface BulkImportProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: ImportStudentsResultDTO) => void;
}

export function BulkImportModal({ isOpen, onClose, onSuccess }: BulkImportProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) throw new Error("CSV file has no data rows.");

      const students: CreateStudentBody[] = lines.slice(1).map((line) => {
        const [studentNumber, firstName, lastName, email, gender, dob] = line.split(",").map((s) => s.trim().replace(/^"|"$/g, ""));
        return {
          studentNumber: studentNumber || `STU-${Date.now().toString().slice(-4)}`,
          firstName: firstName || "Student",
          lastName: lastName || "Name",
          personalEmail: email || undefined,
          gender: (gender?.toUpperCase() === "FEMALE" ? "FEMALE" : "MALE"),
          dateOfBirth: dob || undefined,
        };
      });

      const res = await apiFetch<ImportStudentsResultDTO>("/student-affairs/students/import", {
        method: "POST",
        body: { students },
      });
      onSuccess(res.data);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to import CSV";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-stone-900 text-sm">Bulk Import Students</h3>
          <button type="button" onClick={onClose} className="text-stone-400 hover:text-stone-600"><XIcon className="h-4 w-4" /></button>
        </div>
        {error && <p className="mt-3 text-xs text-rose-600 font-semibold">{error}</p>}
        <div className="mt-4 rounded-xl border-2 border-dashed p-6 text-center">
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={(e) => { setFile(e.target.files?.[0] || null); setError(null); }} />
          <UploadCloudIcon className="mx-auto h-7 w-7 text-stone-400" />
          <p className="mt-2 text-xs font-semibold text-stone-700">{file ? file.name : "Select a CSV file"}</p>
          <button type="button" onClick={() => fileRef.current?.click()} className="mt-2 text-xs font-bold text-rose-700 hover:underline">Browse CSV</button>
        </div>
        <div className="mt-4 flex justify-end gap-2 border-t pt-3">
          <button type="button" onClick={onClose} className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-stone-50">Cancel</button>
          <button type="button" disabled={!file || loading} onClick={handleUpload} className="rounded-lg bg-rose-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-900 disabled:opacity-50">
            {loading ? "Importing…" : "Upload & Process"}
          </button>
        </div>
      </div>
    </div>
  );
}
