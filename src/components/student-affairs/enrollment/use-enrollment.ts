"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiRequestError } from "@/lib/api/client";
import type { CreateStudentBody, StudentDTO } from "@/lib/api/types";
import { INITIAL_ENROLLMENT_DATA, type EnrollmentFormData } from "./types";

export function useEnrollment(departments: { id: string }[], academicYears: { id: string; yearLabel: string }[]) {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [assignedId, setAssignedId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [portraitPreview, setPortraitPreview] = useState<string | null>(null);
  const [portraitError, setPortraitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EnrollmentFormData>(INITIAL_ENROLLMENT_DATA);

  const effectiveDeptId = formData.departmentId || departments[0]?.id || "";
  const effectiveYearId = formData.academicYearId || academicYears[0]?.id || "";

  const createMutation = useMutation({
    mutationFn: (body: CreateStudentBody) => apiFetch<StudentDTO>("/student-affairs/students", { method: "POST", body }),
    onSuccess: async (res) => {
      setAssignedId(res.data.studentNumber);
      setFormError(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["student-affairs", "students"] }),
        queryClient.invalidateQueries({ queryKey: ["student-affairs", "summary"] }),
      ]);
    },
    onError: (err: Error) => {
      setFormError(err.message || "Failed to create student record.");
      if (err instanceof ApiRequestError && err.errors) setFieldErrors(err.errors);
    },
  });

  const nextToStep2 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) return setFormError("First and Last Name required.");
    if (!formData.dob) return setFormError("Date of Birth is required.");
    setFormError(null);
    setCurrentStep(2);
  };

  const nextToStep3 = () => {
    setFormError(null);
    if (!formData.studentNumber) {
      const year = academicYears.find((y) => y.id === effectiveYearId)?.yearLabel.slice(0, 4) || "2024";
      setFormData((p) => ({ ...p, studentNumber: `STU-${year}-${Math.floor(1000 + Math.random() * 9000)}` }));
    }
    setCurrentStep(3);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      studentNumber: formData.studentNumber.trim(), firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(), dateOfBirth: formData.dob || undefined, gender: formData.gender,
      personalEmail: formData.email.trim() || undefined, contactDetails: formData.mobile.trim() || undefined,
      bloodGroup: formData.bloodGroup || undefined, guardianName: formData.guardianName.trim() || undefined,
      guardianContact: formData.guardianContact.trim() || undefined, departmentId: effectiveDeptId || undefined,
      status: "ENROLLED", enrollmentDate: new Date().toISOString().slice(0, 10),
    });
  };

  const reset = () => {
    setAssignedId(null);
    setCurrentStep(1);
    setFormData(INITIAL_ENROLLMENT_DATA);
  };

  return {
    currentStep, setCurrentStep, assignedId, formError, setFormError, fieldErrors,
    portraitPreview, setPortraitPreview, portraitError, setPortraitError,
    formData, setFormData, effectiveDeptId, effectiveYearId, isSubmitting: createMutation.isPending,
    nextToStep2, nextToStep3, submit, reset,
  };
}
