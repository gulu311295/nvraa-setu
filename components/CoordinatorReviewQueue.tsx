import { SubmissionReviewCard } from "@/components/SubmissionReviewCard";
import { listCounsellingMentorsForCoordinator } from "@/lib/counselling-mentors";
import type { SubmissionRow } from "@/lib/db";
import { STATUS_LABELS } from "@/lib/submission-status";

const SCHOLARSHIP_TYPES = new Set(["scholarship", "scholarship_post"]);

function isScholarship(formType: string) {
  return SCHOLARSHIP_TYPES.has(formType);
}

export function CoordinatorReviewQueue({
  submissions,
}: {
  submissions: SubmissionRow[];
}) {
  const mentorOptions = listCounsellingMentorsForCoordinator();
  const mentorship = submissions.filter((s) => s.form_type === "mentorship");
  const scholarship = submissions.filter((s) => isScholarship(s.form_type));
  const other = submissions.filter(
    (s) => s.form_type !== "mentorship" && !isScholarship(s.form_type)
  );
  const pendingMentorship = mentorship.filter((s) => s.status === "pending");
  const pendingScholarship = scholarship.filter((s) => s.status === "pending");
  const pendingAll = submissions.filter((s) => s.status === "pending");

  return (
    <div className="space-y-10">
      {pendingAll.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3">
          <p className="text-sm font-medium text-amber-100">
            {pendingAll.length} request{pendingAll.length === 1 ? "" : "s"} awaiting
            coordinator action
            {pendingMentorship.length > 0 && (
              <span className="text-amber-200/80">
                {" "}
                ({pendingMentorship.length} mentorship)
              </span>
            )}
            {pendingScholarship.length > 0 && (
              <span className="text-amber-200/80">
                {" "}
                ({pendingScholarship.length} scholarship)
              </span>
            )}
          </p>
          <span className="text-xs text-amber-200/60">Status: Pending review</span>
        </div>
      )}

      <section>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Mentorship requests — review queue
            </h2>
            <p className="mt-1 text-sm text-white/50">
              Full student details below. Use{" "}
              <strong className="font-medium text-white/70">Pending review</strong> →{" "}
              <strong className="font-medium text-white/70">Approved</strong> →{" "}
              <strong className="font-medium text-white/70">Matched</strong> when you
              introduce a mentor.
            </p>
          </div>
        </div>

        {mentorship.length === 0 ? (
          <div className="mt-4 space-y-2 rounded-xl border border-dashed border-white/15 p-6 text-sm text-white/50">
            <p>No mentorship requests in the queue yet.</p>
            <ol className="list-inside list-decimal space-y-1 text-white/45">
              <li>
                Open <span className="text-white/70">/mentorship</span> and submit the
                form (same dev URL/port as this page).
              </li>
              <li>
                Return here and refresh — requests persist in{" "}
                <span className="text-white/70">.data/submissions.json</span> locally.
              </li>
            </ol>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {mentorship.map((s) => (
              <SubmissionReviewCard
                key={s.id}
                submission={s}
                mentorOptions={mentorOptions}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Scholarship requests — review queue
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Student support requests and alumni/ partner scheme listings from{" "}
            <span className="text-white/70">/scholarship</span>. Same approve → match
            workflow as other forms.
          </p>
        </div>

        {scholarship.length === 0 ? (
          <div className="mt-4 space-y-2 rounded-xl border border-dashed border-white/15 p-6 text-sm text-white/50">
            <p>No scholarship submissions yet.</p>
            <p className="text-white/45">
              Submit from <span className="text-white/70">/scholarship</span> (request
              support or share a fund), then refresh this page.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {scholarship.map((s) => (
              <SubmissionReviewCard key={s.id} submission={s} />
            ))}
          </div>
        )}
      </section>

      {other.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white">
            Other submissions ({other.length})
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Job seekers, consultation, alumni job posts and mentor volunteers — same
            review workflow.
          </p>
          <div className="mt-6 space-y-4">
            {other.map((s) => (
              <SubmissionReviewCard key={s.id} submission={s} />
            ))}
          </div>
        </section>
      )}

      {submissions.length > 0 && (
        <p className="text-xs text-white/35">
          Status legend: {Object.values(STATUS_LABELS).join(" · ")}
        </p>
      )}
    </div>
  );
}
