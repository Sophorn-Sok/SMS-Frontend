export interface InstitutionalReport {
  id: string;
  name: string;
  category: "Enrollment" | "Finance" | "Academics" | "Staffing";
  type: string;
  size: string;
  generatedOn: string;
}

export const institutionalReports: InstitutionalReport[] = [
  { id: "ir1", name: "Enrollment Audit Q3", category: "Enrollment", type: "PDF", size: "12.4 MB", generatedOn: "Oct 18, 2024" },
  { id: "ir2", name: "Financial Summary 2024", category: "Finance", type: "XLSX", size: "4.8 MB", generatedOn: "Oct 15, 2024" },
  { id: "ir3", name: "Graduation Forecast", category: "Academics", type: "PDF", size: "8.2 MB", generatedOn: "Oct 10, 2024" },
  { id: "ir4", name: "Faculty Headcount Report", category: "Staffing", type: "XLSX", size: "2.1 MB", generatedOn: "Oct 5, 2024" },
  { id: "ir5", name: "Departmental Budget Variance", category: "Finance", type: "PDF", size: "6.7 MB", generatedOn: "Sep 30, 2024" },
  { id: "ir6", name: "Grade Distribution Analysis", category: "Academics", type: "PDF", size: "3.3 MB", generatedOn: "Sep 22, 2024" },
];

export const reportCategories = ["All", "Enrollment", "Finance", "Academics", "Staffing"] as const;
