"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import {
  ArrowRightIcon,
  CameraIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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
  DocumentType,
  Gender,
  StudentDTO,
} from "@/lib/api/types";

interface EnrollmentDocument {
  id: string;
  name: string;
  type: DocumentType;
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
  { id: 3, label: "ID Assignment & Review" },
];

const REQUIRED_DOC_COUNT = 1;

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

  // Active step in the 3-step wizard
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Personal Details State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<Gender>("MALE");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | "">("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianContact, setGuardianContact] = useState("");

  // Step 2: Academic Background State
  const [academicYearId, setAcademicYearId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [prevSchool, setPrevSchool] = useState("");
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>("TRANSCRIPT");
  const [documents, setDocuments] = useState<EnrollmentDocument[]>([]);
  const [isDraggingDocs, setIsDraggingDocs] = useState(false);

  // Step 3: Student ID State
  const [studentNumber, setStudentNumber] = useState("");

  // UI state
  const [portraitPreview, setPortraitPreview] = useState<string | null>(null);
  const [portraitError, setPortraitError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [assignedId, setAssignedId] = useState<string | null>(null);

  const effectiveDepartmentId = departmentId || (departments[0]?.id ?? "");
  const effectiveAcademicYearId = academicYearId || (academicYears[0]?.id ?? "");

  const selectedDepartment = departments.find((d) => d.id === effectiveDepartmentId);
  const selectedAcademicYear = academicYears.find((y) => y.id === effectiveAcademicYearId);

  // Mutation to create student in backend
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
    const newDocs: EnrollmentDocument[] = Array.from(fileList).map((file, index) => ({
      id: `doc-${Date.now()}-${index}`,
      name: file.name,
      type: selectedDocType,
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

  // ─── Step Navigation Handlers ───
  function goToStep2() {
    if (!firstName.trim() || !lastName.trim()) {
      setFormError("Please enter the student's First Name and Last Name.");
      return;
    }
    if (!dob) {
      setFormError("Please select the student's Date of Birth.");
      return;
    }
    setFormError(null);
    setCurrentStep(2);
  }

  function goToStep3() {
    setFormError(null);
    // Generate suggested ID if empty
    if (!studentNumber) {
      const year = selectedAcademicYear?.yearLabel?.slice(0, 4) || new Date().getFullYear().toString();
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      setStudentNumber(`STU-${year}-${randomDigits}`);
    }
    setCurrentStep(3);
  }

  function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!studentNumber.trim()) {
      setFormError("Student ID number is required.");
      return;
    }
    setFormError(null);

    const payload: CreateStudentBody = {
      studentNumber: studentNumber.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dateOfBirth: dob ? dob : undefined,
      gender,
      personalEmail: email.trim() ? email.trim() : undefined,
      contactDetails: mobile.trim() ? mobile.trim() : undefined,
      bloodGroup: bloodGroup ? (bloodGroup as BloodGroup) : undefined,
      guardianName: guardianName.trim() ? guardianName.trim() : undefined,
      guardianContact: guardianContact.trim() ? guardianContact.trim() : undefined,
      departmentId: effectiveDepartmentId || undefined,
      status: "ENROLLED",
      enrollmentDate: new Date().toISOString().slice(0, 10),
    };

    createMutation.mutate(payload);
  }

  function handleResetForm() {
    setAssignedId(null);
    setCurrentStep(1);
    setFirstName("");
    setLastName("");
    setEmail("");
    setDob("");
    setMobile("");
    setBloodGroup("");
    setGuardianName("");
    setGuardianContact("");
    setPrevSchool("");
    setDocuments([]);
    setStudentNumber("");
    setPortraitPreview(null);
  }

  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: "Dashboard", href: "/student-affairs" },
          { label: "Enrollment" },
        ]}
        title="New Student Enrollment"
        description="Register a new student into the academic management system via guided multi-step enrollment."
        actions={
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
          >
            Cancel Enrollment
          </button>
        }
      />

      {/* ─── Step Progress Tracker ─── */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-stone-200 bg-white px-6 py-4">
        {STEPS.map((step, index) => {
          const isCompleted = assignedId ? true : currentStep > step.id;
          const isActive = assignedId ? step.id === 3 : currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  if (!assignedId && step.id < currentStep) {
                    setCurrentStep(step.id as 1 | 2 | 3);
                  }
                }}
                disabled={!!assignedId || step.id > currentStep}
                className="flex items-center gap-2.5 text-left disabled:cursor-default"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-rose-800 text-white"
                      : isCompleted
                        ? "bg-rose-100 text-rose-700"
                        : "bg-stone-100 text-stone-400"
                  }`}
                >
                  {isCompleted && !isActive ? "✓" : step.id}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    isActive ? "text-rose-800" : isCompleted ? "text-stone-800" : "text-stone-400"
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {index < STEPS.length - 1 && (
                <span className="h-px w-10 bg-stone-200" />
              )}
            </div>
          );
        })}
      </div>

      {formError && (
        <p className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {formError}
        </p>
      )}

      {/* ─── ENROLLMENT SUCCESS VIEW ─── */}
      {assignedId ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 text-center max-w-2xl mx-auto shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircleIcon className="h-10 w-10" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-stone-900">
            Student Enrolled Successfully!
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Official student record created in the university database.
          </p>

          <div className="my-6 inline-block rounded-xl border border-emerald-200 bg-white px-6 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Assigned Student Number
            </p>
            <p className="font-mono text-2xl font-extrabold text-emerald-800 mt-1">
              {assignedId}
            </p>
            <p className="text-sm font-semibold text-stone-700 mt-1">
              {firstName} {lastName}
            </p>
            <p className="text-xs text-stone-500">
              {selectedDepartment?.name || "Department Assigned"} • {selectedAcademicYear?.yearLabel || "Academic Year"}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/student-affairs"
              className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800"
            >
              View in Student Directory
            </Link>
            <button
              type="button"
              onClick={handleResetForm}
              className="rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
            >
              Enroll Another Student
            </button>
          </div>
        </div>
      ) : (
        /* ─── MULTI-STEP WIZARD BODY ─── */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main Step Content */}
          <div>
            {/* ────── STEP 1: PERSONAL DETAILS ────── */}
            {currentStep === 1 && (
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
                    <UserIcon className="h-5 w-5 text-rose-700" />
                    Step 1: Personal & Contact Information
                  </h2>
                  <p className="mt-1 text-xs text-stone-500">
                    Enter the student&apos;s legal name, birth information, and emergency guardian contacts.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextField
                    id="firstName"
                    label="First Name"
                    placeholder="e.g. Sok"
                    value={firstName}
                    onChange={setFirstName}
                    required
                    error={fieldErrors.firstName?.[0]}
                  />
                  <TextField
                    id="lastName"
                    label="Last Name"
                    placeholder="e.g. Dara"
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
                    required
                    error={fieldErrors.dateOfBirth?.[0]}
                  />
                  <div>
                    <label
                      htmlFor="gender"
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-500"
                    >
                      Gender <span className="text-rose-600">*</span>
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
                    label="Personal Email"
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={setEmail}
                    error={fieldErrors.personalEmail?.[0]}
                  />
                  <TextField
                    id="mobile"
                    label="Mobile Contact"
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

                <div className="border-t border-stone-100 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                    Guardian Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                <div className="flex justify-end pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={goToStep2}
                    className="flex items-center gap-2 rounded-lg bg-rose-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
                  >
                    Next: Academic Background
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ────── STEP 2: ACADEMIC BACKGROUND & DOCUMENTS ────── */}
            {currentStep === 2 && (
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-6">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
                    <GraduationCapIcon className="h-5 w-5 text-rose-700" />
                    Step 2: Academic Background & Verification
                  </h2>
                  <p className="mt-1 text-xs text-stone-500">
                    Assign the department, target academic session, and verify qualification records.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="department"
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-500"
                    >
                      Assigned Department / Faculty *
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
                      Enrolling Academic Session *
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
                </div>

                <div className="border-t border-stone-100 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Prior Academic Record (Optional Reference)
                  </h3>
                  <TextField
                    id="prevSchool"
                    label="Previous High School / Institution"
                    placeholder="e.g. Phnom Penh High School"
                    value={prevSchool}
                    onChange={setPrevSchool}
                  />
                </div>

                {/* Supporting Documents Section in Step 2 */}
                <div className="border-t border-stone-100 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                        Supporting Documents Checklist
                      </h3>
                      <p className="text-xs text-stone-400">
                        Attach National ID, High School Certificate, or Transcript.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-rose-800">
                      {documents.length} attached
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <select
                        value={selectedDocType}
                        onChange={(e) => setSelectedDocType(e.target.value as DocumentType)}
                        className="w-full appearance-none rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-800 outline-none focus:border-rose-400"
                      >
                        <option value="TRANSCRIPT">Academic Transcript</option>
                        <option value="CERTIFICATE">Graduation Certificate</option>
                        <option value="ID_CARD">National ID / Passport</option>
                        <option value="OTHER">Other Verification Document</option>
                      </select>
                      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
                    </div>

                    <button
                      type="button"
                      onClick={() => documentInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                    >
                      <UploadCloudIcon className="h-3.5 w-3.5 text-rose-700" />
                      Browse File
                    </button>
                  </div>

                  {documents.length > 0 && (
                    <div className="rounded-xl border border-stone-100 bg-stone-50/50 p-3 space-y-2">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between rounded-lg bg-white p-2 border border-stone-200 text-xs"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <FileTextIcon className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                            <span className="font-medium text-stone-800 truncate">{doc.name}</span>
                            <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                              {doc.type}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeDocument(doc.id)}
                            className="text-stone-400 hover:text-rose-600"
                          >
                            <XIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Back: Personal Details
                  </button>
                  <button
                    type="button"
                    onClick={goToStep3}
                    className="flex items-center gap-1.5 rounded-lg bg-rose-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
                  >
                    Next: ID Assignment & Review
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ────── STEP 3: ID ASSIGNMENT & REVIEW ────── */}
            {currentStep === 3 && (
              <form
                onSubmit={handleFinalSubmit}
                className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-6"
              >
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
                    <CheckCircleIcon className="h-5 w-5 text-rose-700" />
                    Step 3: Student ID Assignment & Final Review
                  </h2>
                  <p className="mt-1 text-xs text-stone-500">
                    Verify the official matriculation ID and review all enrollment information before saving.
                  </p>
                </div>

                <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4">
                  <TextField
                    id="studentNumber"
                    label="Assigned Student ID Number"
                    placeholder="e.g. STU-2024-001"
                    value={studentNumber}
                    onChange={setStudentNumber}
                    required
                    error={fieldErrors.studentNumber?.[0]}
                  />
                  <p className="mt-1.5 text-xs text-stone-500">
                    Auto-generated based on the academic year. You can customize this if your institution uses custom prefixes.
                  </p>
                </div>

                {/* Comprehensive Review Summary */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Enrollment Summary Preview
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl border border-stone-200 bg-stone-50/50 p-4 text-xs">
                    <div>
                      <p className="font-semibold text-stone-400 uppercase text-[10px]">Full Name</p>
                      <p className="font-bold text-stone-900 text-sm mt-0.5">{firstName} {lastName}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-400 uppercase text-[10px]">Date of Birth</p>
                      <p className="font-medium text-stone-800 mt-0.5">{dob || "N/A"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-400 uppercase text-[10px]">Gender / Blood</p>
                      <p className="font-medium text-stone-800 mt-0.5">
                        {gender} {bloodGroup ? `(${bloodGroup.replace("_", " ")})` : ""}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-400 uppercase text-[10px]">Department</p>
                      <p className="font-bold text-rose-800 mt-0.5">{selectedDepartment?.name || "Unassigned"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-400 uppercase text-[10px]">Academic Year</p>
                      <p className="font-medium text-stone-800 mt-0.5">{selectedAcademicYear?.yearLabel || "Current"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-400 uppercase text-[10px]">Documents</p>
                      <p className="font-medium text-stone-800 mt-0.5">{documents.length} verified</p>
                    </div>
                    <div className="col-span-2 sm:col-span-3 border-t border-stone-200 pt-2">
                      <p className="font-semibold text-stone-400 uppercase text-[10px]">Contact Details</p>
                      <p className="font-medium text-stone-800 mt-0.5">
                        {email || "No email"} • {mobile || "No phone"} • Guardian: {guardianName || "N/A"} ({guardianContact || "N/A"})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Back: Academic Background
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex items-center gap-2 rounded-lg bg-rose-800 px-7 py-2.5 text-sm font-bold text-white hover:bg-rose-900 disabled:opacity-50"
                  >
                    {createMutation.isPending ? "Enrolling Student…" : "Save & Complete Enrollment"}
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar: Photo & Documents Summary */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
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

            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wide text-stone-500">
                  Verification Status
                </h3>
                <span
                  className={`text-xs font-bold ${
                    documents.length >= REQUIRED_DOC_COUNT
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {documents.length >= REQUIRED_DOC_COUNT ? "Ready" : "Pending Docs"}
                </span>
              </div>
              <ul className="space-y-2 text-xs text-stone-600">
                <li className="flex items-center gap-2">
                  <span className={firstName && lastName && dob ? "text-emerald-600" : "text-stone-300"}>
                    ●
                  </span>
                  Personal Details {firstName && lastName && dob ? "Complete" : "Required"}
                </li>
                <li className="flex items-center gap-2">
                  <span className={effectiveDepartmentId ? "text-emerald-600" : "text-stone-300"}>
                    ●
                  </span>
                  Department Assigned
                </li>
                <li className="flex items-center gap-2">
                  <span className={documents.length > 0 ? "text-emerald-600" : "text-stone-300"}>
                    ●
                  </span>
                  {documents.length} Document(s) Uploaded
                </li>
              </ul>

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
                className={`mt-4 rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
