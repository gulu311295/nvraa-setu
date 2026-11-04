import { SubmitForm } from "@/components/SubmitForm";
import { getScholarships } from "@/lib/data";

export default function ScholarshipPage() {
  const scholarships = getScholarships("open");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm uppercase tracking-widest text-saffron-400">Door 5</p>
      <h1 className="mt-2 text-3xl font-bold text-white">Scholarships & Financial Aid</h1>
      <p className="mt-3 max-w-2xl text-white/65">
        Curated scholarships, fee support and application guidance for Navodayans.
        Coordinators verify listings and help match eligible students — no guarantee
        of award; we simplify finding trusted options.
      </p>

      <div className="mt-10 space-y-4">
        {scholarships.map((sch) => (
          <article
            key={sch.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">{sch.title}</h2>
                <p className="text-sm text-white/55">{sch.provider}</p>
              </div>
              <span className="rounded-full border border-saffron-500/40 px-3 py-1 text-xs text-saffron-400">
                {sch.amount}
              </span>
            </div>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-white/40">Education level</dt>
                <dd className="text-white/80">{sch.educationLevel}</dd>
              </div>
              <div>
                <dt className="text-white/40">Deadline</dt>
                <dd className="text-white/80">{sch.deadline}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-white/40">Eligibility</dt>
                <dd className="text-white/80">{sch.eligibility}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-white/45">{sch.postedBy}</p>
            <a
              href={sch.link.startsWith("http") ? sch.link : "#"}
              className="mt-4 inline-block text-sm font-medium text-saffron-400 hover:text-saffron-400/80"
              rel="noopener noreferrer"
              target="_blank"
            >
              Details / apply (demo) →
            </a>
          </article>
        ))}
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <SubmitForm
          formType="scholarship"
          title="Request scholarship support"
          description="Tell us your course, need and documents status. Coordinators suggest schemes and alumni who can help with applications."
          fields={[
            { name: "fullName", label: "Your name", placeholder: "Demo name" },
            {
              name: "classOrBatch",
              label: "Class / batch / year",
              placeholder: "e.g. Class XII 2026 or Batch 2018",
            },
            {
              name: "educationLevel",
              label: "Current education level",
              type: "select",
              options: [
                "Class VI–X",
                "Class XI–XII",
                "Undergraduate",
                "Postgraduate",
                "Professional course",
                "Other",
              ],
            },
            {
              name: "scholarshipCategory",
              label: "What are you looking for?",
              type: "select",
              options: [
                "Merit / general scholarship",
                "SC/ST/OBC / minority schemes",
                "Girls / women-specific",
                "Coaching / exam fee support",
                "Higher education (UG/PG)",
                "Not sure — need guidance",
              ],
            },
            {
              name: "familyIncome",
              label: "Approx. annual family income (optional)",
              type: "select",
              required: false,
              options: [
                "Prefer not to say",
                "Below ₹2.5 LPA",
                "₹2.5–4.5 LPA",
                "₹4.5–8 LPA",
                "Above ₹8 LPA",
              ],
            },
            {
              name: "documentsStatus",
              label: "Documents you already have",
              type: "textarea",
              required: false,
              placeholder: "e.g. income certificate, caste certificate, marksheets…",
            },
            {
              name: "needDescription",
              label: "Describe your need or question",
              type: "textarea",
              placeholder: "Course fees, hostel, coaching, specific scheme name, etc.",
            },
          ]}
        />

        <SubmitForm
          formType="scholarship_post"
          title="Share a scholarship or fund"
          description="Alumni, NGOs and partners can list schemes for coordinator verification before students see them."
          fields={[
            {
              name: "contactName",
              label: "Your name (for coordinator)",
              placeholder: "Demo",
            },
            { name: "title", label: "Scholarship / scheme name" },
            { name: "provider", label: "Organisation / sponsor" },
            { name: "amount", label: "Amount or benefit", placeholder: "e.g. ₹20,000 / fee waiver" },
            {
              name: "educationLevel",
              label: "Education level",
              placeholder: "e.g. Class XI–XII, UG",
            },
            { name: "eligibility", label: "Eligibility", type: "textarea" },
            { name: "deadline", label: "Deadline", placeholder: "YYYY-MM-DD or Rolling" },
            {
              name: "applicationLink",
              label: "Application link or contact for coordinator",
            },
          ]}
        />
      </div>
    </div>
  );
}
