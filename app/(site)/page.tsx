import Link from "next/link";
import { getRecentActivity, getStats } from "@/lib/data";

const doors = [
  {
    href: "/mentorship",
    title: "Find a Mentor",
    subtitle: "Career guidance & domain advice",
    icon: "🎓",
    steps: ["Choose a field", "Share your question", "Coordinator matches you"],
  },
  {
    href: "/jobs",
    title: "Find a Job / Internship",
    subtitle: "Register interest & view verified openings",
    icon: "💼",
    steps: ["Browse opportunities", "Register as seeker", "Get matched leads"],
  },
  {
    href: "/consultation",
    title: "Exam & Domain Consultation",
    subtitle: "UPSC, SSC, Banking, Defence & more",
    icon: "📚",
    steps: ["Pick exam track", "Request strategy help", "Connect with alumni"],
  },
  {
    href: "/scholarship",
    title: "Scholarships & Aid",
    subtitle: "Schemes, fee support & application help",
    icon: "🎖️",
    steps: ["Browse listings", "Request guidance", "Coordinator matches help"],
  },
  {
    href: "/offer",
    title: "Offer Support / Share a Job",
    subtitle: "Alumni mentors, consultants & employers",
    icon: "🤝",
    steps: ["Volunteer as mentor", "Post an opening", "Coordinator verifies"],
  },
];

export default function HomePage() {
  const stats = getStats();
  const activity = getRecentActivity();

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-widest text-saffron-400">
            NVRAA MEET 2026 · JNV Rajgir
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Welcome to NVRAA SETU
          </h1>
          <p className="mt-6 text-lg text-white/75 leading-relaxed">
            A trusted bridge between Navodayans and the next generation — from
            one-time reunion conversations to structured mentorship, jobs and
            exam guidance all year round.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {[
            { label: "Students", desc: "Ask & explore" },
            { label: "Alumni", desc: "Guide & mentor" },
            { label: "Employers", desc: "Share opportunities" },
            { label: "NVRAA", desc: "Connect & coordinate" },
          ].map((pill) => (
            <span
              key={pill.label}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm"
            >
              <span className="font-semibold text-saffron-400">{pill.label}</span>
              <span className="text-white/60"> — {pill.desc}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-navy-900/50">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
          {[
            { n: stats.mentorsOnboarded, label: "Mentors onboarded" },
            { n: stats.studentsHelped, label: "Students helped" },
            { n: stats.opportunitiesShared, label: "Opportunities shared" },
            { n: stats.introductionsMade, label: "Introductions made" },
          ].map((s) => (
            <div key={s.label} className="text-center sm:text-left">
              <p className="text-3xl font-bold text-leaf-500">{s.n}</p>
              <p className="text-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold text-white">Five doors into the network</h2>
        <p className="mt-2 max-w-2xl text-white/60">
          Choose what you need — the system routes your request to the relevant
          coordinator or alumni volunteer.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {doors.map((door) => (
            <Link
              key={door.href}
              href={door.href}
              className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-lg shadow-black/10 backdrop-blur-sm transition-all hover:border-saffron-400/40 hover:bg-white/[0.07] hover:shadow-glow"
            >
              <span className="text-3xl">{door.icon}</span>
              <h3 className="mt-4 text-xl font-semibold text-white group-hover:text-saffron-400 transition-colors">
                {door.title}
              </h3>
              <p className="mt-1 text-sm text-white/60">{door.subtitle}</p>
              <ul className="mt-4 space-y-1 text-sm text-white/50">
                {door.steps.map((step, i) => (
                  <li key={step}>
                    {i + 1}. {step}
                  </li>
                ))}
              </ul>
              <span className="mt-auto pt-4 text-sm font-medium text-leaf-500">
                Enter →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-navy-900/80 p-8">
          <h2 className="text-lg font-semibold text-white">How it works</h2>
          <p className="mt-2 text-white/70">
            Choose a path → Submit a form → NVRAA reviews → Relevant introduction
            → Follow-up
          </p>
          <p className="mt-4 text-sm text-white/50">
            Privacy note: contact details are shared only with authorised
            coordinators and with consent. We do not guarantee jobs or exam
            success — we make trusted guidance easier to find.
          </p>
        </div>

        <h2 className="mt-12 text-lg font-semibold text-white">Recent activity (demo)</h2>
        <ul className="mt-4 space-y-3">
          {activity.map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3 text-sm"
            >
              <span className="text-white/80">{a.text}</span>
              <time className="text-white/40">{a.date}</time>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
