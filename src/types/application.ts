// The shape of an Application as it travels between our API and the UI.
// Dates come back from JSON as strings, not Date objects, so we type them as string here.
export type ApplicationStatus =
  | "APPLIED"
  | "INTERVIEWING"
  | "OFFER"
  | "REJECTED";

export type Application = {
  id: string;
  company: string;
  role: string;
  jobUrl: string | null;
  jobDescription: string | null;
  status: ApplicationStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export const STATUS_COLUMNS: { id: ApplicationStatus; label: string }[] = [
  { id: "APPLIED", label: "Applied" },
  { id: "INTERVIEWING", label: "Interviewing" },
  { id: "OFFER", label: "Offer" },
  { id: "REJECTED", label: "Rejected" },
];
