export const SUBMISSION_STATUSES = [
  "pending",
  "approved",
  "matched",
  "declined",
  "closed",
] as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  pending: "Pending review",
  approved: "Approved — matching",
  matched: "Matched / introduced",
  declined: "Declined",
  closed: "Closed",
};

export const STATUS_STYLES: Record<SubmissionStatus, string> = {
  pending: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  approved: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  matched: "bg-leaf-500/20 text-leaf-400 border-leaf-500/40",
  declined: "bg-red-500/20 text-red-300 border-red-500/40",
  closed: "bg-white/10 text-white/50 border-white/20",
};

export function isSubmissionStatus(s: string): s is SubmissionStatus {
  return (SUBMISSION_STATUSES as readonly string[]).includes(s);
}
