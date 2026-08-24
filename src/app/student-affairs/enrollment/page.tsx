"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  CameraIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  FileTextIcon,
  GraduationCapIcon,
  InfoIcon,
  UploadCloudIcon,
  UserIcon,
  XIcon,
} from "@/components/icons";

interface EnrollmentDocument {
  id: string;
  name: string;
}

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const ACADEMIC_YEAR_OPTIONS = ["2024-2025", "2025-2026", "2023-2024"];
const DEPARTMENT_OPTIONS = [
  "Faculty of Computer Science",
  "Faculty of Business Administration",
  "Faculty of Engineering",
  "Faculty of Arts & Humanities",
  "Faculty of Applied Sciences",
];

const STEPS = [
  { id: 1, label: "Personal Details" },
  { id: 2, label: "Academic Background" },
  { id: 3, label: "ID Assignment" },
];

const REQUIRED_DOC_COUNT = 3;

function TextField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-500"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-stone-200 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-500"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
      </div>
    </div>
  );
}

export default function StudentEnrollmentPage() {
  const router = useRouter();
  const portraitInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [academicYear, setAcademicYear] = useState(ACADEMIC_YEAR_OPTIONS[0]);
  const [department, setDepartment] = useState(DEPARTMENT_OPTIONS[0]);

  const [portraitPreview, setPortraitPreview] = useState<string | null>(null);
  const [portraitError, setPortraitError] = useState<string | null>(null);

  const [documents, setDocuments] = useState<EnrollmentDocument[]>([
    { id: "doc-1", name: "birth_cert.pdf" },
  ]);
  const [isDraggingDocs, setIsDraggingDocs] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState<string | null>(null);
  const [assignedId, setAssignedId] = useState<string | null>(null);

  const currentStep = assignedId ? 3 : 1;
  const documentsVerifiedLabel =
    documents.length >= REQUIRED_DOC_COUNT
      ? "Verified"
      : `Pending (${documents.length}/${REQUIRED_DOC_COUNT})`;

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
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
  }

  function removeDocument(id: string) {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  }

  function handleCancel() {
    if (firstName || lastName || email) {
      const confirmed = window.confirm(
        "Discard this enrollment? Unsaved changes will be lost.",
      );
      if (!confirmed) return;
    }
    router.push("/student-affairs");
  }

  function handleSaveDraft() {
    setDraftMessage("Draft saved just now.");
    window.setTimeout(() => setDraftMessage(null), 3000);
  }

  function handleAssignId(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !dob || !gender || !email || !department) {
      setFormError(
        "Please complete all required fields before assigning a student ID.",
      );
      return;
    }
    setFormError(null);
    const yearPrefix = academicYear.slice(0, 4);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setAssignedId(`STU-${yearPrefix}-${randomSuffix}`);
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
              className="rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
            >
              Save & Assign ID
            </button>
          </>
        }
      />

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
        <form
          id="enrollment-form"
          onSubmit={handleAssignId}
          noValidate
          className="space-y-6"
        >
          {assignedId && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold text-emerald-800">
                  Enrollment saved. Student ID {assignedId} has been assigned.
                </p>
                <Link
                  href="/student-affairs"
                  className="mt-1 inline-block text-sm font-medium text-emerald-700 hover:underline"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          )}

          {formError && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {formError}
            </p>
          )}

          <section className="rounded-2xl border border-stone-200 bg-white p-8">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-stone-900">
              <UserIcon className="h-5 w-5 text-rose-700" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <TextField
                id="firstName"
                label="First Name"
                placeholder="e.g. Jonathan"
                value={firstName}
                onChange={setFirstName}
                required
              />
              <TextField
                id="lastName"
                label="Last Name"
                placeholder="e.g. Doe"
                value={lastName}
                onChange={setLastName}
                required
              />
              <TextField
                id="dob"
                label="Date of Birth"
                type="date"
                value={dob}
                onChange={setDob}
                required
              />
              <SelectField
                id="gender"
                label="Gender"
                value={gender}
                onChange={setGender}
                options={GENDER_OPTIONS}
                placeholder="Select Gender"
              />
              <div className="sm:col-span-2">
                <TextField
                  id="email"
                  label="Personal Email Address"
                  type="email"
                  placeholder="j.doe@example.com"
                  value={email}
                  onChange={setEmail}
                  required
                />
              </div>
              <TextField
                id="mobile"
                label="Mobile Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={mobile}
                onChange={setMobile}
              />
              <SelectField
                id="bloodGroup"
                label="Blood Group"
                value={bloodGroup}
                onChange={setBloodGroup}
                options={BLOOD_GROUP_OPTIONS}
                placeholder="Select Blood Type"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-8">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-stone-900">
              <GraduationCapIcon className="h-5 w-5 text-rose-700" />
              Academic Enrollment Details
            </h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <SelectField
                id="academicYear"
                label="Academic Year"
                value={academicYear}
                onChange={setAcademicYear}
                options={ACADEMIC_YEAR_OPTIONS}
                placeholder="Select Academic Year"
              />
              <SelectField
                id="department"
                label="Department / Program"
                value={department}
                onChange={setDepartment}
                options={DEPARTMENT_OPTIONS}
                placeholder="Select Department"
              />
            </div>
          </section>
        </form>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center">
            <input
              ref={portraitInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handlePortraitChange}
            />
            <button
              type="button"
              onClick={() => portraitInputRef.current?.click()}
              className="mx-auto flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/50 text-rose-300 hover:border-rose-300"
            >
              {portraitPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={portraitPreview}
                  alt="Student portrait preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <CameraIcon className="h-8 w-8" />
              )}
            </button>
            <p className="mt-4 font-semibold text-stone-800">
              Student Portrait
            </p>
            <p className="mt-1 text-xs text-stone-500">
              JPG or PNG, max 5MB. Must be recent and high-resolution.
            </p>
            {portraitError && (
              <p className="mt-2 text-xs font-medium text-rose-600">
                {portraitError}
              </p>
            )}
          </div>

          <div
            className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
              isDraggingDocs
                ? "border-rose-400 bg-rose-100/60"
                : "border-rose-200 bg-rose-50/40"
            }`}
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
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <UploadCloudIcon className="h-7 w-7" />
            </span>
            <p className="mt-4 font-semibold text-stone-800">
              Supporting Documents
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Drag and drop birth certificate, transcripts, and ID proof here
              for bulk processing.
            </p>
            <input
              ref={documentInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => addDocuments(e.target.files)}
            />
            <button
              type="button"
              onClick={() => documentInputRef.current?.click()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
            >
              <UploadCloudIcon className="h-4 w-4" />
              Browse Files
            </button>

            {documents.length > 0 && (
              <ul className="mt-4 space-y-2 text-left">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2"
                  >
                    <span className="flex min-w-0 items-center gap-2 text-sm text-stone-700">
                      <FileTextIcon className="h-4 w-4 shrink-0 text-rose-600" />
                      <span className="truncate">{doc.name}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      aria-label={`Remove ${doc.name}`}
                      className="shrink-0 text-stone-400 hover:text-rose-600"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-stone-200">
            <div className="bg-rose-800 px-5 py-3">
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                Enrollment Status
              </h3>
            </div>
            <div className="space-y-3 bg-white p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500">Registration Fee</span>
                <span className="font-semibold text-emerald-600">
                  Paid - $150.00
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500">Documents Verified</span>
                <span
                  className={`font-semibold ${
                    documents.length >= REQUIRED_DOC_COUNT
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {documentsVerifiedLabel}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500">System Assigned ID</span>
                <span
                  className={`font-semibold ${
                    assignedId ? "text-emerald-600" : "text-stone-400"
                  }`}
                >
                  {assignedId ?? "Not yet generated"}
                </span>
              </div>
              <div className="mt-2 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
                <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {assignedId
                    ? "Enrollment finalized. You can safely leave this page."
                    : "Enrollment will be finalized once the 'Save & Assign ID' button is pressed."}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 pt-6">
        <p className="text-sm text-stone-500">
          {draftMessage ?? "Form auto-saves every 30 seconds."}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="rounded-lg bg-rose-100 px-5 py-2.5 text-sm font-semibold text-rose-800 hover:bg-rose-200"
          >
            Save Draft
          </button>
          <button
            type="submit"
            form="enrollment-form"
            className="rounded-lg bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-900"
          >
            Save & Assign ID
          </button>
        </div>
      </div>
    </div>
  );
}
