import Link from "next/link";
import { SubmitForm } from "@/components/SubmitForm";
import { getMentors, MENTOR_FIELDS } from "@/lib/data";

const fieldOptions = MENTOR_FIELDS.filter((f) => f !== "All");

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
        Choose a field, ask for a mentor or career conversation, and agree on
        follow-up with coordinator support. Profiles below are fictional demo
        entries — no direct contact on this site.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {MENTOR_FIELDS.map((f) => {
          const active =
            (f === "All" && activeField === "all") ||
            f.toLowerCase() === activeField?.toLowerCase();
          return (
            <Link
              key={f}
              href={f === "All" ? "/mentorship" : `/mentorship?field=${encodeURIComponent(f)}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-saffron-500 text-navy-950"
                  : "border border-white/15 text-white/70 hover:bg-white/10"
              }`}
            >
              {f}
            </Link>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {mentors.map((m) => (
          <article
            key={m.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-white">{m.name}</h2>
                <p className="text-sm text-white/50">Batch {m.batch} · {m.location}</p>
              </div>
              <span className="rounded-full bg-leaf-500/20 px-3 py-1 text-xs font-medium text-leaf-500">
                {m.field}
              </span>
            </div>
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
              label: "Field",
              type: "select",
              options: [...fieldOptions],
            },
            {
              name: "guidanceType",
              label: "Guidance type",
              type: "select",
              options: ["One-to-one conversation", "Group session", "Career exploration"],
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
