import { LogoutButton } from "@/components/LogoutButton";
import {
  getConsultationDomains,
  getJobs,
  getMentors,
  getRecentActivity,
  getStats,
} from "@/lib/data";
import { hasDatabase, listSubmissions } from "@/lib/db";

export default async function CoordinatorPage() {
  const stats = getStats();
  const mentors = getMentors();
  const jobs = getJobs("all");
  const domains = getConsultationDomains();
  const activity = getRecentActivity();
  const submissions = await listSubmissions(30);
  const db = hasDatabase();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Master tracker</h1>
          <p className="mt-2 text-white/60">
            Review · match · introduce · follow up
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-6 rounded-xl border border-leaf-500/30 bg-leaf-500/10 px-4 py-3 text-sm text-leaf-200/90">
        Storage:{" "}
        {db
          ? "PostgreSQL (Railway DATABASE_URL) — form submissions persist."
          : "In-memory (dev) — add PostgreSQL on Railway and set DATABASE_URL."}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className="rounded-xl border border-white/10 bg-white/5 p-4 text-center"
          >
            <p className="text-2xl font-bold text-saffron-400">{value}</p>
            <p className="mt-1 text-xs text-white/50 capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">
          Incoming form submissions ({submissions.length})
        </h2>
        <p className="mt-1 text-sm text-white/50">
          Latest requests from mentorship, jobs, consultation and offer forms.
        </p>
        {submissions.length === 0 ? (
          <p className="mt-4 text-sm text-white/45">No submissions yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-navy-900 text-white/50">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Summary</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id} className="border-t border-white/5 align-top">
                    <td className="px-4 py-3 whitespace-nowrap text-white/50">
                      {new Date(s.created_at).toLocaleString("en-IN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3 text-saffron-400">{s.form_type}</td>
                    <td className="px-4 py-3 text-white/75">
                      <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                        {JSON.stringify(s.payload, null, 0).slice(0, 280)}
                        {JSON.stringify(s.payload).length > 280 ? "…" : ""}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Mentor directory ({mentors.length})</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-navy-900 text-white/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Batch</th>
                <th className="px-4 py-3">Field</th>
                <th className="px-4 py-3">Availability</th>
              </tr>
            </thead>
            <tbody>
              {mentors.map((m) => (
                <tr key={m.id} className="border-t border-white/5">
                  <td className="px-4 py-3 text-white">{m.name}</td>
                  <td className="px-4 py-3 text-white/70">{m.batch}</td>
                  <td className="px-4 py-3 text-white/70">{m.field}</td>
                  <td className="px-4 py-3 text-white/70">{m.availability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Opportunities ({jobs.length})</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-navy-900 text-white/50">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-t border-white/5">
                  <td className="px-4 py-3 text-white">{j.title}</td>
                  <td className="px-4 py-3 text-white/70">{j.type}</td>
                  <td className="px-4 py-3 text-white/70">{j.deadline}</td>
                  <td className="px-4 py-3">
                    <span className="text-leaf-500">{j.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Consultation domains ({domains.length})</h2>
        <ul className="mt-4 space-y-2 text-sm text-white/70">
          {domains.map((d) => (
            <li key={d.id} className="rounded-lg bg-white/5 px-4 py-2">
              {d.name} — {d.mentorCount} volunteers
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Follow-up log (seed demo)</h2>
        <ul className="mt-4 space-y-2">
          {activity.map((a) => (
            <li
              key={a.id}
              className="flex justify-between gap-4 rounded-lg border border-white/5 px-4 py-3 text-sm"
            >
              <span className="text-white/75">{a.text}</span>
              <span className="shrink-0 text-white/40">{a.date}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
