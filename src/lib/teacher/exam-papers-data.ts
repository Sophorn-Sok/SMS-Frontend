export interface DraftPaper {
  id: string;
  title: string;
  status: "DRAFT" | "PENDING APPROVAL" | "APPROVED";
  meta: string;
  detail: string;
  previewText: string;
}

export const initialDraftPapers: DraftPaper[] = [
  {
    id: "p1",
    title: "Mid-Term: Binary Trees & Graphs",
    status: "DRAFT",
    meta: "Last modified: Oct 12, 2023",
    detail: "40 Questions | 100 Marks",
    previewText:
      "Preview: 40 multiple-choice and short-answer questions covering trees, graphs, and traversal algorithms.",
  },
  {
    id: "p2",
    title: "Quiz 4: Complexity Analysis",
    status: "APPROVED",
    meta: "Approved by COE on Oct 10",
    detail: "Live in 2 days",
    previewText:
      "Preview: 15 questions on time and space complexity, Big-O notation, and recurrence relations.",
  },
];

export interface CorrectionStudent {
  id: string;
  name: string;
  initials: string;
  avatarColorClassName: string;
  internal: number;
  exam: number | null;
}

export const correctionRoster: CorrectionStudent[] = [
  {
    id: "cs1",
    name: "Julian Sterling",
    initials: "JS",
    avatarColorClassName: "bg-rose-100 text-rose-700",
    internal: 34.5,
    exam: 48,
  },
  {
    id: "cs2",
    name: "Mira Al-Saud",
    initials: "MA",
    avatarColorClassName: "bg-rose-100 text-rose-700",
    internal: 38.0,
    exam: null,
  },
  {
    id: "cs3",
    name: "Kenji Brooks",
    initials: "KB",
    avatarColorClassName: "bg-sky-100 text-sky-700",
    internal: 29.5,
    exam: 51,
  },
];

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  done: boolean;
}

export const initialChecklist: ChecklistItem[] = [
  {
    id: "chk1",
    title: "Paper Blueprint Mapping",
    description: "Mapped to ABET criteria",
    done: true,
  },
  {
    id: "chk2",
    title: "Answer Key Draft",
    description: "Uploaded to secure cloud",
    done: true,
  },
  {
    id: "chk3",
    title: "Internal Marks Verification",
    description: "Missing for 5 students",
    done: false,
  },
  {
    id: "chk4",
    title: "COE Portal Approval",
    description: "Final step before publishing",
    done: false,
  },
];
