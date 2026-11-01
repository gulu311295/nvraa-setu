import { FieldCategoryPicker } from "@/components/FieldCategoryPicker";
import { SubmitForm } from "@/components/SubmitForm";
import { getMentors } from "@/lib/data";
import { mentorFieldOptionGroups } from "@/lib/form-field-options";

export default async function MentorshipPage({
  searchParams,
}: {
  searchParams: Promise<{ field?: string }>;
}) {
  const { field } = await searchParams;
  const activeField = field ?? "all";
  const mentors = getMentors(activeField === "all" ? undefined : activeField);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm text-saffron-400 uppercase tracking-widest">Door 1</p>
      <h1 className="mt-2 text-3xl font-bold text-white">Mentorship</h1>
      <p className="mt-3 max-w-2xl text-white/65">
        Browse by career domain — from UPSC and engineering to hotel management,
        aviation, healthcare and more. Profiles are fictional demo entries; no
        direct contact on this site.
      </p>

      <FieldCategoryPicker activeField={activeField} />

      {mentors.length === 0 ? (
        <p className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
          No demo mentor listed for this field yet. Submit a request below — coordinators
          can match you from the wider alumni network.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {mentors.map((m) => (
            <article
              key={m.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
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
              <p className="mt-3 text-sm text-white/70">{m.bio}</p>
              <p className="mt-2 text-xs text-white/45">
                Languages: {m.languages.join(", ")} · {m.availability}
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
            </article>
          ))}
        </div>
      )}

      <div className="mt-14">
        <SubmitForm
          formType="mentorship"
          title="Request a mentor"
          description="Share your field, question and availability. Coordinators match you with a consenting volunteer."
          fields={[
            {
              name: "fullName",
              label: "Your name",
              placeholder: "Demo name only",
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
