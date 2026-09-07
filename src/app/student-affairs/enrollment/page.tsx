"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import {
  CameraIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  FileTextIcon,
  GraduationCapIcon,
  UploadCloudIcon,
  UserIcon,
  XIcon,
} from "@/components/icons";
import { apiFetch, ApiRequestError } from "@/lib/api/client";
import { useApiQuery } from "@/lib/api/hooks";
import type {
  AcademicYearDTO,
  BloodGroup,
  CreateStudentBody,
  DepartmentDTO,
  Gender,
  StudentDTO,
} from "@/lib/api/types";

interface EnrollmentDocument {
  id: string;
  name: string;
  file?: File;
}

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

const STEPS = [
  { id: 1, label: "Personal Details" },
  { id: 2, label: "Academic Background" },
  { id: 3, label: "ID Assignment & Complete" },
];

const REQUIRED_DOC_COUNT = 2;

function TextField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-500"
      >
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-colors ${
          error
            ? "border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-200"
            : "border-stone-200 bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
        }`}
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

export default function StudentEnrollmentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const portraitInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // Queries for live lookups
  const departmentsQuery = useApiQuery<DepartmentDTO[]>(
    ["departments"],
    "/student-affairs/departments"
  );
  const academicYearsQuery = useApiQuery<AcademicYearDTO[]>(
    ["academic-years"],
    "/student-affairs/academic-years"
  );

  const departments = departmentsQuery.data?.data ?? [];
  const academicYears = academicYearsQuery.data?.data ?? [];

  // Form state
  const [studentNumber, setStudentNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<Gender>("MALE");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianContact, setGuardianContact] = useState("");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | "">("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const [portraitPreview, setPortraitPreview] = useState<string | null>(null);
  const [portraitError, setPortraitError] = useState<string | null>(null);

  const [documents, setDocuments] = useState<EnrollmentDocument[]>([]);
  const [isDraggingDocs, setIsDraggingDocs] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [assignedId, setAssignedId] = useState<string | null>(null);

  const effectiveDepartmentId = departmentId || (departments[0]?.id ?? "");
  const effectiveAcademicYearId = academicYearId || (academicYears[0]?.id ?? "");

  const currentStep = assignedId ? 3 : 1;
  const documentsVerifiedLabel =
    documents.length >= REQUIRED_DOC_COUNT
      ? "Verified"
      : `Pending (${documents.length}/${REQUIRED_DOC_COUNT})`;

  // Mutation to create student
  const createMutation = useMutation({
    mutationFn: (body: CreateStudentBody) =>
      apiFetch<StudentDTO>("/student-affairs/students", {
        method: "POST",
        body,
      }),
    onSuccess: async (res) => {
      setAssignedId(res.data.studentNumber);
      setFormError(null);
      setFieldErrors({});
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["student-affairs", "students"] }),
        queryClient.invalidateQueries({ queryKey: ["student-affairs", "summary"] }),
      ]);
    },
    onError: (err: Error) => {
      setFormError(err.message || "Failed to create student record.");
      if (err instanceof ApiRequestError && err.errors) {
        setFieldErrors(err.errors);
      }
    },
  });

  function handlePortraitChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setPortraitError("Only JPG or PNG files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPortraitError("Image must be 5MB or smaller.");
      return;
    }
    setPortraitError(null);
    setPortraitPreview(URL.createObjectURL(file));
  }

  function addDocuments(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const newDocs = Array.from(fileList).map((file, index) => ({
      id: `doc-${Date.now()}-${index}`,
      name: file.name,
      file,
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
  }

  function removeDocument(id: string) {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  }

  function handleCancel() {
    if (firstName || lastName || email) {
      const confirmed = window.confirm(
        "Discard this enrollment? Unsaved changes will be lost."
      );
      if (!confirmed) return;
    }
    router.push("/student-affairs");
  }

  function handleSubmitEnrollment(e: React.FormEvent) {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setFormError("Please provide student first and last name.");
      return;
    }

    const effectiveYear =
      academicYears.find((a) => a.id === effectiveAcademicYearId)?.yearLabel?.slice(0, 4) ||
      "2024";
    const effectiveNumber =
      studentNumber.trim() ||
      `STU-${effectiveYear}-${Math.floor(1000 + Math.random() * 9000)}`;

    setFormError(null);
    setFieldErrors({});

    const payload: CreateStudentBody = {
      studentNumber: effectiveNumber,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      personalEmail: email.trim() || undefined,
      dateOfBirth: dob || undefined,
      gender: gender || undefined,
      bloodGroup: bloodGroup ? (bloodGroup as BloodGroup) : undefined,
      departmentId: effectiveDepartmentId || undefined,
      contactDetails: mobile.trim() || undefined,
      guardianName: guardianName.trim() || undefined,
      guardianContact: guardianContact.trim() || undefined,
      status: "ENROLLED",
      enrollmentDate: new Date().toISOString().slice(0, 10),
    };

    createMutation.mutate(payload);
  }

  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: "Dashboard", href: "/student-affairs" },
          { label: "Enrollment" },
        ]}
        title="New Student Enrollment"
        description="Register a new student into the academic management system."
        actions={
          <>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
            >
              Cancel Enrollment
            </button>
            <button
              type="submit"
              form="enrollment-form"
              disabled={createMutation.isPending || !!assignedId}
              className="rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900 disabled:opacity-60"
            >
              {createMutation.isPending ? "Submitting…" : "Save & Assign ID"}
            </button>
          </>
        }
      />

      {/* ─── Step Progress Tracker ─── */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-stone-200 bg-white px-6 py-4">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                  step.id === currentStep
                    ? "bg-rose-800 text-white"
                    : step.id < currentStep
                      ? "bg-rose-100 text-rose-700"
                      : "bg-stone-100 text-stone-400"
                }`}
              >
                {step.id}
              </span>
              <span
                className={`text-sm font-semibold ${
                  step.id === currentStep ? "text-rose-800" : "text-stone-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <span className="h-px w-10 bg-stone-200" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Form Container */}
        <form
          id="enrollment-form"
          onSubmit={handleSubmitEnrollment}
          noValidate
          className="space-y-6"
        >
          {assignedId && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold text-emerald-800">
                  Student record created successfully in database.
                </p>
                <p className="mt-0.5 text-sm text-emerald-700">
                  Assigned Student ID:{" "}
                  <span className="font-mono font-bold">{assignedId}</span>
                </p>
                <div className="mt-3 flex gap-3">
                  <Link
                    href="/student-affairs"
                    className="rounded-lg bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
                  >
                    Back to Student Directory
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setAssignedId(null);
                      setFirstName("");
                      setLastName("");
                      setEmail("");
                      setDob("");
                      setMobile("");
                      const year = academicYears[0]?.yearLabel?.slice(0, 4) || "2024";
                      setStudentNumber(`STU-${year}-${Math.floor(1000 + Math.random() * 9000)}`);
                    }}
                    className="rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                  >
                    Enroll Another Student
                  </button>
                </div>
              </div>
            </div>
          )}

          {formError && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {formError}
            </p>
          )}

          {/* Card 1: Personal Details */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-stone-900">
              <UserIcon className="h-5 w-5 text-rose-700" />
              Personal Details
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                id="firstName"
                label="First Name"
                placeholder="e.g. Johnathan"
                value={firstName}
                onChange={setFirstName}
                required
                error={fieldErrors.firstName?.[0]}
              />
              <TextField
                id="lastName"
                label="Last Name"
                placeholder="e.g. Doe"
                value={lastName}
                onChange={setLastName}
                required
                error={fieldErrors.lastName?.[0]}
              />
              <TextField
                id="dob"
                label="Date of Birth"
                type="date"
                value={dob}
                onChange={setDob}
                error={fieldErrors.dateOfBirth?.[0]}
              />
              <div>
                <label
                  htmlFor="gender"
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-500"
                >
                  Gender
                </label>
                <div className="relative">
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full appearance-none rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  >
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                </div>
              </div>
              <TextField
                id="email"
                label="Email Address"
                type="email"
                placeholder="e.g. student@university.edu"
                value={email}
                onChange={setEmail}
                error={fieldErrors.personalEmail?.[0]}
              />
              <TextField
                id="mobile"
                label="Mobile Number"
                type="tel"
                placeholder="+855 12 345 678"
                value={mobile}
                onChange={setMobile}
                error={fieldErrors.contactDetails?.[0]}
              />
              <div>
                <label
                  htmlFor="bloodGroup"
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-500"
                >
                  Blood Group
                </label>
                <div className="relative">
                  <select
                    id="bloodGroup"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full appearance-none rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  >
                    <option value="">Select blood group (Optional)</option>
                    {BLOOD_GROUP_OPTIONS.map((bg) => (
                      <option key={bg.value} value={bg.value}>
                        {bg.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Academic Background & Identification */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-stone-900">
              <GraduationCapIcon className="h-5 w-5 text-rose-700" />
              Academic Department & Student ID
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                id="studentNumber"
                label="Student ID Number"
                placeholder="e.g. STU-2024-001"
                value={studentNumber}
                onChange={setStudentNumber}
                required
                error={fieldErrors.studentNumber?.[0]}
              />
              <div>
                <label
                  htmlFor="department"
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-500"
                >
                  Assigned Department
                </label>
                <div className="relative">
                  <select
                    id="department"
                    value={effectiveDepartmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="academicYear"
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-500"
                >
                  Academic Year
                </label>
                <div className="relative">
                  <select
                    id="academicYear"
                    value={effectiveAcademicYearId}
                    onChange={(e) => setAcademicYearId(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  >
                    {academicYears.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.yearLabel}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                </div>
              </div>

              <TextField
                id="guardianName"
                label="Guardian / Parent Name"
                placeholder="e.g. Robert Doe"
                value={guardianName}
                onChange={setGuardianName}
              />
              <TextField
                id="guardianContact"
                label="Guardian Contact Number"
                placeholder="+855 12 999 888"
                value={guardianContact}
                onChange={setGuardianContact}
              />
            </div>
          </div>
        </form>

        {/* Sidebar: Photo & Documents */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-stone-500">
              Student Photo
            </h3>
            <div className="flex flex-col items-center">
              <div className="relative mb-3 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-rose-200 bg-rose-50/50">
                {portraitPreview ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={portraitPreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-14 w-14 text-rose-300" />
                )}
              </div>
              <input
                ref={portraitInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handlePortraitChange}
              />
              <button
                type="button"
                onClick={() => portraitInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700 hover:underline"
              >
                <CameraIcon className="h-4 w-4" />
                {portraitPreview ? "Change Photo" : "Upload Photo"}
              </button>
              {portraitError && (
                <p className="mt-2 text-center text-xs text-rose-600">
                  {portraitError}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wide text-stone-500">
                Documents
              </h3>
              <span className="text-xs font-medium text-stone-400">
                {documentsVerifiedLabel}
              </span>
            </div>

            <input
              ref={documentInputRef}
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => addDocuments(e.target.files)}
            />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingDocs(true);
              }}
              onDragLeave={() => setIsDraggingDocs(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingDocs(false);
                addDocuments(e.dataTransfer.files);
              }}
              className={`rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
                isDraggingDocs
                  ? "border-rose-400 bg-rose-50/70"
                  : "border-stone-200 bg-stone-50/50"
              }`}
            >
              <UploadCloudIcon className="mx-auto h-6 w-6 text-stone-400" />
              <p className="mt-1 text-xs text-stone-600">Drag files here or</p>
              <button
                type="button"
                onClick={() => documentInputRef.current?.click()}
                className="mt-1 text-xs font-semibold text-rose-700 hover:underline"
              >
                browse files
              </button>
            </div>

            {documents.length > 0 && (
              <ul className="mt-3 divide-y divide-stone-100">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between py-2 text-xs text-stone-700"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <FileTextIcon className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                      <span className="truncate">{doc.name}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="ml-2 text-stone-400 hover:text-rose-600"
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
