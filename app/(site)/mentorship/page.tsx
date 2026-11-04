import { NvraaWhatsAppNotice } from "@/components/NvraaWhatsAppNotice";
import { FieldCategoryPicker } from "@/components/FieldCategoryPicker";
import { MentorshipFormScroll } from "@/components/MentorshipFormScroll";
import { MentorshipRequestsPanel } from "@/components/MentorshipRequestsPanel";
import { SubmitForm } from "@/components/SubmitForm";
import { getCounsellingMentorById, getCounsellingMentors } from "@/lib/counselling-mentors";
import { mentorFieldOptionGroups } from "@/lib/form-field-options";
import { getAuthenticatedMember } from "@/lib/member-auth";
import Link from "next/link";

export default async function MentorshipPage({
  searchParams,
}: {
  searchParams: Promise<{ field?: string; mentor?: string }>;
}) {
  const { field, mentor: mentorParam } = await searchParams;
  const activeField = field ?? "all";
  const mentors = getCounsellingMentors(activeField === "all" ? undefined : activeField);
  const selectedMentor = mentorParam ? getCounsellingMentorById(mentorParam) : null;
  const member = await getAuthenticatedMember();

  const formDefaults: Record<string, string> = {};
  if (member?.full_name) formDefaults.fullName = member.full_name;
  if (selectedMentor) {
    formDefaults.mentorId = selectedMentor.id;
    formDefaults.mentorName = selectedMentor.name;
    if (!field) formDefaults.field = selectedMentor.field;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm uppercase tracking-widest text-saffron-400">Door 1</p>
      <h1 className="mt-2 text-3xl font-bold text-white">Mentorship</h1>
      <p className="mt-3 max-w-2xl text-white/65">
        NVRAA counselling team alumni — real volunteers from our contact directory.
        Profiles never show email or phone; after your request is approved, the coordinator
        assigns a mentor and contact details appear in your request status below.
      </p>

      <div className="mt-6 max-w-2xl">
        <NvraaWhatsAppNotice />
      </div>

      <MentorshipRequestsPanel />
      <MentorshipFormScroll mentorId={selectedMentor?.id} />

      <FieldCategoryPicker activeField={activeField} />

      {mentors.length === 0 ? (
        <p className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
          No mentor listed for this filter yet. Try another field or submit a general
          request below.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {mentors.map((m) => (
            <article
              key={m.id}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-white">{m.name}</h2>
                  <p className="text-sm text-white/50">
                    Batch {m.batch} · {m.location}
                  </p>
                </div>
                <span className="rounded-full bg-leaf-500/20 px-3 py-1 text-xs font-medium text-leaf-500">
                  {m.field}
                </span>
              </div>
              <p className="mt-1 text-xs text-saffron-400/80">{m.domain}</p>
              {m.organization && (
                <p className="mt-2 text-xs text-white/45">{m.organization}</p>
              )}
              <p className="mt-3 text-sm text-white/70">{m.bio}</p>
              <p className="mt-2 text-xs text-white/45">
                Languages: {m.languages.join(", ")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {m.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-navy-900 px-2 py-1 text-xs text-white/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-auto pt-4">
                <Link
                  href={`/mentorship?mentor=${encodeURIComponent(m.id)}${activeField !== "all" ? `&field=${encodeURIComponent(activeField)}` : ""}#request-mentor-form`}
                  className="text-sm font-medium text-saffron-400 hover:text-saffron-300"
                >
                  Choose this mentor →
                </Link>
                <p className="mt-1 text-xs text-white/40">
                  Opens the form below — you still need to submit it for coordinator review.
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      <div id="request-mentor-form" className="mt-14 scroll-mt-24">
        {selectedMentor && (
          <p className="mb-4 rounded-xl border border-saffron-500/30 bg-saffron-500/10 px-4 py-3 text-sm text-saffron-100">
            Step 2 — Complete the form to send your request to coordinators:{" "}
            <strong>{selectedMentor.name}</strong> (Batch {selectedMentor.batch}). Nothing is
            sent until you press <strong>Submit for coordinator review</strong>.
          </p>
        )}
        {!selectedMentor && (
          <p className="mb-4 text-sm text-white/45">
            Step 1: pick a mentor above (optional). Step 2: fill this form and submit — that
            creates the entry in the coordinator mentorship queue.
          </p>
        )}
        <SubmitForm
          formType="mentorship"
          title="Request a mentor"
          description="Share your field, question and availability. After submit, coordinators see this under Mentorship requests on /coordinator."
          defaultValues={formDefaults}
          fields={[
            { name: "mentorId", label: "Mentor ID", type: "hidden", required: false },
            { name: "mentorName", label: "Mentor name", type: "hidden", required: false },
            {
              name: "fullName",
              label: "Your name",
              placeholder: "Your name",
            },
            {
              name: "classOrBatch",
              label: "Class / pass-out year",
              placeholder: "e.g. Class XII or 2024",
            },
            {
              name: "field",
              label: "Field / domain",
              type: "select",
              optionGroups: mentorFieldOptionGroups(),
            },
            {
              name: "guidanceType",
              label: "Guidance type",
              type: "select",
              options: [
                "One-to-one conversation",
                "Group session",
                "Career exploration",
              ],
            },
            {
              name: "language",
              label: "Preferred language",
              type: "select",
              options: ["Hindi", "English", "Hindi + English"],
            },
            {
              name: "question",
              label: "Your question or goal",
              type: "textarea",
              placeholder: "What guidance are you looking for?",
            },
            {
              name: "availability",
              label: "Your availability",
              placeholder: "e.g. Weekends after 4 PM",
            },
          ]}
        />
      </div>
    </div>
  );
}
