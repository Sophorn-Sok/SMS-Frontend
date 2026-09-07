"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDownIcon, UserIcon, XIcon } from "@/components/icons";
import { apiFetch } from "@/lib/api/client";
import type {
  BloodGroup,
  DepartmentDTO,
  Gender,
  StudentDTO,
  UpdateStudentBody,
} from "@/lib/api/types";

const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
];

const BLOOD_GROUP_OPTIONS: { label: string; value: BloodGroup }[] = [
  { label: "A+", value: "A_POS" },
  { label: "A-", value: "A_NEG" },
  { label: "B+", value: "B_POS" },
  { label: "B-", value: "B_NEG" },
  { label: "O+", value: "O_POS" },
  { label: "O-", value: "O_NEG" },
  { label: "AB+", value: "AB_POS" },
  { label: "AB-", value: "AB_NEG" },
];

interface EditStudentModalProps {
  student: StudentDTO;
  departments: DepartmentDTO[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: StudentDTO) => void;
}

export function EditStudentModal({
  student,
  departments,
  isOpen,
  onClose,
  onSuccess,
}: EditStudentModalProps) {
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState(student.firstName);
  const [lastName, setLastName] = useState(student.lastName);
  const [dateOfBirth, setDateOfBirth] = useState(
    student.dateOfBirth ? student.dateOfBirth.slice(0, 10) : ""
  );
  const [gender, setGender] = useState<Gender | "">(student.gender || "");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | "">(
    student.bloodGroup || ""
  );
  const [personalEmail, setPersonalEmail] = useState(
    student.personalEmail || ""
  );
  const [contactDetails, setContactDetails] = useState(
    student.contactDetails || ""
  );
  const [guardianName, setGuardianName] = useState(student.guardianName || "");
  const [guardianContact, setGuardianContact] = useState(
    student.guardianContact || ""
  );
  const [departmentId, setDepartmentId] = useState(
    student.departmentId || departments[0]?.id || ""
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const editMutation = useMutation({
    mutationFn: (body: UpdateStudentBody) =>
      apiFetch<StudentDTO>(`/student-affairs/students/${student.id}`, {
        method: "PATCH",
        body,
      }),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: ["student-affairs", "students"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["student-affairs", "summary"],
      });
      onSuccess(res.data);
      onClose();
    },
    onError: (err: Error) => {
      setErrorMessage(err.message || "Failed to update student profile.");
    },
  });

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage("First name and last name are required.");
      return;
    }
    setErrorMessage(null);

    editMutation.mutate({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dateOfBirth: dateOfBirth ? dateOfBirth : undefined,
      gender: gender ? (gender as Gender) : undefined,
      bloodGroup: bloodGroup ? (bloodGroup as BloodGroup) : undefined,
      personalEmail: personalEmail.trim() || undefined,
      contactDetails: contactDetails.trim() || undefined,
      guardianName: guardianName.trim() || undefined,
      guardianContact: guardianContact.trim() || undefined,
      departmentId: departmentId || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between border-b border-stone-100 pb-4">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-stone-900">
              <UserIcon className="h-5 w-5 text-rose-700" />
              Edit Student Record
            </h3>
            <p className="font-mono text-xs font-semibold text-rose-700">
              {student.studentNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-stone-400 hover:text-stone-600"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {errorMessage && (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-700">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-firstName"
                className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500"
              >
                First Name *
              </label>
              <input
                id="edit-firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </div>
            <div>
              <label
                htmlFor="edit-lastName"
                className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500"
              >
                Last Name *
              </label>
              <input
                id="edit-lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="edit-dob"
                className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500"
              >
                Date of Birth
              </label>
              <input
                id="edit-dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </div>
            <div>
              <label
                htmlFor="edit-gender"
                className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500"
              >
                Gender
              </label>
              <div className="relative">
                <select
                  id="edit-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full appearance-none rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                >
                  <option value="">Select Gender</option>
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              </div>
            </div>
            <div>
              <label
                htmlFor="edit-bloodGroup"
                className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500"
              >
                Blood Group
              </label>
              <div className="relative">
                <select
                  id="edit-bloodGroup"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full appearance-none rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                >
                  <option value="">Select Blood Group</option>
                  {BLOOD_GROUP_OPTIONS.map((bg) => (
                    <option key={bg.value} value={bg.value}>
                      {bg.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-email"
                className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500"
              >
                Personal Email
              </label>
              <input
                id="edit-email"
                type="email"
                value={personalEmail}
                onChange={(e) => setPersonalEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </div>
            <div>
              <label
                htmlFor="edit-contact"
                className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500"
              >
                Contact / Phone
              </label>
              <input
                id="edit-contact"
                type="text"
                value={contactDetails}
                onChange={(e) => setContactDetails(e.target.value)}
                placeholder="+855 12 345 678"
                className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-guardianName"
                className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500"
              >
                Guardian Name
              </label>
              <input
                id="edit-guardianName"
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </div>
            <div>
              <label
                htmlFor="edit-guardianContact"
                className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500"
              >
                Guardian Phone
              </label>
              <input
                id="edit-guardianContact"
                type="text"
                value={guardianContact}
                onChange={(e) => setGuardianContact(e.target.value)}
                className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-dept"
              className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500"
            >
              Assigned Department
            </label>
            <div className="relative">
              <select
                id="edit-dept"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full appearance-none rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              >
                <option value="">No Department Assigned</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-stone-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editMutation.isPending}
              className="rounded-lg bg-rose-800 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-900 disabled:opacity-50"
            >
              {editMutation.isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
