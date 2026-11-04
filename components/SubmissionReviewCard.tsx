"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  STATUS_LABELS,
  STATUS_STYLES,
  SUBMISSION_STATUSES,
  type SubmissionStatus,
} from "@/lib/submission-status";
import { formTypeLabel, labelForPayloadKey } from "@/lib/submission-labels";

export type SubmissionForReview = {
  id: number;
  form_type: string;
  payload: Record<string, unknown>;
  created_at: string;
  status: SubmissionStatus;
  coordinator_notes: string | null;
  reviewed_at: string | null;
  matched_mentor_id?: string | null;
};

type MentorOption = { id: string; name: string; batch: string; field: string };

type MentorContactPreview = {
  email: string | null;
  mobile: string | null;
  whatsapp: string | null;
};

export function SubmissionReviewCard({
  submission,
  mentorOptions,
}: {
  submission: SubmissionForReview;
  mentorOptions?: MentorOption[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<SubmissionStatus>(submission.status);
  const [notes, setNotes] = useState(submission.coordinator_notes ?? "");
  const [matchedMentorId, setMatchedMentorId] = useState(
    submission.matched_mentor_id ?? ""
  );
  const [contactPreview, setContactPreview] = useState<MentorContactPreview | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isMentorship = submission.form_type === "mentorship";
  const showMentorPicker = isMentorship && mentorOptions && mentorOptions.length > 0;

  useEffect(() => {
    if (!showMentorPicker || !matchedMentorId) {
      setContactPreview(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/coordinator/mentors/${matchedMentorId}/contact`);
      if (!res.ok || cancelled) return;
      const json = (await res.json()) as { contact?: MentorContactPreview | null };
      if (!cancelled) setContactPreview(json.contact ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [matchedMentorId, showMentorPicker]);

  async function saveReview() {
    if (
      isMentorship &&
      (status === "approved" || status === "matched") &&
      !matchedMentorId
    ) {
      setMessage("Select a mentor before approving or marking matched.");
      return;
    }
    setLoading(true);
    setMessage("");
    const res = await fetch(`/api/coordinator/submissions/${submission.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        coordinatorNotes: notes,
        matchedMentorId: showMentorPicker ? matchedMentorId || null : undefined,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      setMessage("Could not save. Sign in again as coordinator.");
      return;
    }
    setMessage("Saved.");
    router.refresh();
  }

  const payloadEntries = Object.entries(submission.payload).filter(
    ([key, v]) =>
      v !== undefined &&
      v !== "" &&
      key !== "memberUserId" &&
      key !== "memberEmail"
  );

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-saffron-400">
            {formTypeLabel(submission.form_type)} · #{submission.id}
          </p>
          <p className="mt-1 text-sm text-white/50">
            Submitted{" "}
            {new Date(submission.created_at).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {payloadEntries.map(([key, value]) => (
          <div
            key={key}
            className={key === "question" || key === "request" ? "sm:col-span-2" : ""}
          >
            <dt className="text-xs font-medium text-white/45">
              {labelForPayloadKey(key)}
            </dt>
            <dd className="mt-0.5 whitespace-pre-wrap text-sm text-white/85">
              {String(value)}
            </dd>
          </div>
        ))}
      </dl>

      {showMentorPicker && (
        <div className="mt-5 rounded-xl border border-sky-500/25 bg-sky-500/5 p-4">
          <p className="text-sm font-medium text-white">Assign counselling mentor</p>
          <p className="mt-1 text-xs text-white/45">
            Contact details stay hidden from students until you approve and assign a
            mentor. Only coordinators see the preview below.
          </p>
          <label className="mt-3 block text-xs text-white/50">
            Mentor from counselling team
            <select
              value={matchedMentorId}
              onChange={(e) => setMatchedMentorId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-navy-900 px-3 py-2 text-sm text-white focus:border-saffron-400 focus:outline-none"
            >
              <option value="">Select mentor…</option>
              {mentorOptions!.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} · Batch {m.batch} · {m.field}
                </option>
              ))}
            </select>
          </label>
          {contactPreview &&
            (contactPreview.email || contactPreview.mobile || contactPreview.whatsapp) && (
              <dl className="mt-3 grid gap-1 text-xs text-white/70 sm:grid-cols-2">
                {contactPreview.email && (
                  <div>
                    <dt className="text-white/40">Email</dt>
                    <dd>{contactPreview.email}</dd>
                  </div>
                )}
                {contactPreview.mobile && (
                  <div>
                    <dt className="text-white/40">Mobile</dt>
                    <dd>{contactPreview.mobile}</dd>
                  </div>
                )}
                {contactPreview.whatsapp && (
                  <div>
                    <dt className="text-white/40">WhatsApp</dt>
                    <dd>{contactPreview.whatsapp}</dd>
                  </div>
                )}
              </dl>
            )}
        </div>
      )}

      <div className="mt-6 border-t border-white/10 pt-5">
        <p className="text-sm font-medium text-white">Coordinator action</p>
        <p className="mt-1 text-xs text-white/45">
          Approve for matching, mark introduced, or decline. Notes are for internal
          follow-up (not shown on public pages).
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {SUBMISSION_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                status === s
                  ? "bg-saffron-500 text-navy-950"
                  : "border border-white/15 text-white/70 hover:bg-white/10"
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <label className="mt-4 block text-xs text-white/50">
          Coordinator notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="e.g. Matched with alumni mentor; student notified in SETU."
            className="mt-1 w-full rounded-lg border border-white/15 bg-navy-900 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-saffron-400 focus:outline-none"
          />
        </label>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={saveReview}
            disabled={loading}
            className="rounded-lg bg-leaf-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-leaf-400 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save review"}
          </button>
          {submission.reviewed_at && (
            <span className="text-xs text-white/40">
              Last reviewed{" "}
              {new Date(submission.reviewed_at).toLocaleString("en-IN", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
          )}
          {message && (
            <span className="text-xs text-leaf-400" role="status">
              {message}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
