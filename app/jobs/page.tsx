import { SubmitForm } from "@/components/SubmitForm";
import { getJobs } from "@/lib/data";

export default function JobsPage() {
  const jobs = getJobs("open");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm text-saffron-400 uppercase tracking-widest">Door 2</p>
      <h1 className="mt-2 text-3xl font-bold text-white">Jobs & Internships</h1>
      <p className="mt-3 max-w-2xl text-white/65">
        Verified openings shared by alumni and employers. Register your interest
        below; coordinators match eligible candidates without exposing personal
        data publicly.
      </p>

      <div className="mt-10 space-y-4">
        {jobs.map((job) => (
          <article
            key={job.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">{job.title}</h2>
                <p className="text-sm text-white/55">{job.company}</p>
              </div>
              <span className="rounded-full border border-leaf-500/40 px-3 py-1 text-xs text-leaf-500">
                {job.type}
              </span>
            </div>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-white/40">Location</dt>
                <dd className="text-white/80">{job.location}</dd>
              </div>
              <div>
                <dt className="text-white/40">Deadline</dt>
                <dd className="text-white/80">{job.deadline}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-white/40">Eligibility</dt>
                <dd className="text-white/80">{job.eligibility}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-white/40">Skills</dt>
                <dd className="text-white/80">{job.skills.join(", ")}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-white/45">{job.postedBy}</p>
            <a
              href={job.link.startsWith("http") ? job.link : "#"}
              className="mt-4 inline-block text-sm font-medium text-saffron-400 hover:text-saffron-400/80"
              rel="noopener noreferrer"
              target="_blank"
            >
              Application link (demo) →
            </a>
          </article>
        ))}
      </div>

      <div className="mt-14">
        <SubmitForm
          formType="job_seeker"
          title="Register as job seeker"
          description="Add qualification, skills, location and preferred role. Coordinators share relevant leads privately."
          fields={[
            { name: "fullName", label: "Your name", placeholder: "Demo name" },
            {
              name: "qualification",
              label: "Qualification",
              placeholder: "e.g. B.Tech CSE, Class XII",
            },
            {
              name: "skills",
              label: "Skills",
              placeholder: "Comma-separated",
            },
            {
              name: "location",
              label: "Preferred location",
              placeholder: "e.g. Patna, Remote",
            },
            {
              name: "roleType",
              label: "Preferred role",
              type: "select",
              options: [
                "Internship",
                "Full-time",
                "Apprenticeship",
                "Volunteer",
                "Any",
              ],
            },
            {
              name: "notes",
              label: "Additional notes",
              type: "textarea",
              required: false,
            },
          ]}
        />
      </div>
    </div>
  );
}
