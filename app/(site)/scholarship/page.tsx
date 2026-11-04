import { NvraaWhatsAppNotice } from "@/components/NvraaWhatsAppNotice";
import { SubmitForm } from "@/components/SubmitForm";
import { getScholarships } from "@/lib/data";

export default function ScholarshipPage() {
  const scholarships = getScholarships("open");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm uppercase tracking-widest text-saffron-400">Door 5</p>
      <h1 className="mt-2 text-3xl font-bold text-white">Scholarships & Financial Aid</h1>
      <p className="mt-3 max-w-2xl text-white/65">
        Two paths: browse verified schemes and request help applying, or connect with a
        senior/alumni who adopts or funds support for a specific Navodayan — always
        coordinator-verified and consent-based.
      </p>

      <div className="mt-6 max-w-2xl">
        <NvraaWhatsAppNotice />
      </div>

      {/* Track 1 — Schemes & listings */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-white">1. Scholarships & schemes</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/55">
          Curated listings (government, NVRAA, alumni circles). Coordinators verify before
          students rely on them.
        </p>

        <div className="mt-8 space-y-4">
          {scholarships.map((sch) => (
            <article
              key={sch.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{sch.title}</h3>
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

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <SubmitForm
            formType="scholarship"
            title="Request scheme / application help"
            description="For listed or external scholarships — coordinators suggest options and help with applications."
            fields={[
              { name: "fullName", label: "Your name", placeholder: "Your name" },
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
            title="Share a scholarship or fund (listing)"
            description="Alumni, NGOs and partners can propose a scheme for coordinator verification before it appears above."
            fields={[
              {
                name: "contactName",
                label: "Your name (for coordinator)",
                placeholder: "Demo",
              },
              { name: "title", label: "Scholarship / scheme name" },
              { name: "provider", label: "Organisation / sponsor" },
              {
                name: "amount",
                label: "Amount or benefit",
                placeholder: "e.g. ₹20,000 / fee waiver",
              },
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
      </section>

      {/* Track 2 — Adopt / fund a person */}
      <section className="mt-20 border-t border-white/10 pt-14">
        <h2 className="text-xl font-semibold text-white">
          2. Adopt or fund a particular student
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/55">
          Seniors and alumni can sponsor a named Navodayan (fees, hostel, coaching, etc.).
          Students can also ask coordinators to match them with an adopting mentor. No direct
          money transfer on this site — NVRAA verifies both sides and facilitates introduction.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <SubmitForm
            formType="scholarship_adopt_request"
            title="Student: request adoption / sponsorship"
            description="If you need a senior to fund or adopt your support for a specific need, submit here. Coordinators review and match with willing alumni."
            fields={[
              { name: "fullName", label: "Your name" },
              {
                name: "classOrBatch",
                label: "Class / batch / year",
                placeholder: "e.g. Class XII or Batch 2020",
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
                name: "supportType",
                label: "Type of support needed",
                type: "select",
                options: [
                  "School / college fees",
                  "Hostel / accommodation",
                  "Coaching / exam fees",
                  "Books & materials",
                  "Multiple / full adoption",
                  "Other",
                ],
              },
              {
                name: "amountNeeded",
                label: "Approx. amount or duration (optional)",
                required: false,
                placeholder: "e.g. ₹25,000/year or Class XI–XII",
              },
              {
                name: "needDescription",
                label: "Your situation & how support would help",
                type: "textarea",
                placeholder: "Brief background coordinators can share with potential sponsors (no sensitive IDs on public site).",
              },
              {
                name: "consent",
                label: "Consent",
                type: "text",
                placeholder: 'Type YES — I consent to coordinator sharing my case with potential sponsors',
              },
            ]}
          />

          <SubmitForm
            formType="scholarship_adopt_offer"
            title="Senior / alumni: adopt or fund someone"
            description="Offer to adopt or fund a particular student (name known to you) or ask coordinators to match you with a verified case."
            fields={[
              { name: "contactName", label: "Your name" },
              { name: "batch", label: "Your JNV batch / year", placeholder: "e.g. 1996" },
              {
                name: "offerType",
                label: "How do you want to help?",
                type: "select",
                options: [
                  "Adopt / fund a student I already know",
                  "Fund a student NVRAA matches for me",
                  "Contribute to a pooled NVRAA adoption fund",
                ],
              },
              {
                name: "studentReference",
                label: "Student name / class (if you know them)",
                required: false,
                placeholder: "Leave blank if you want coordinator to match",
              },
              {
                name: "amount",
                label: "Amount or commitment",
                placeholder: "e.g. ₹30,000/year, one-time ₹15,000",
              },
              {
                name: "supportType",
                label: "Support covers",
                type: "select",
                options: [
                  "Fees",
                  "Hostel",
                  "Coaching",
                  "Books / materials",
                  "Flexible / full adoption",
                ],
              },
              {
                name: "duration",
                label: "Duration",
                type: "select",
                options: [
                  "One-time",
                  "One academic year",
                  "Multiple years",
                  "Until course completion",
                ],
              },
              {
                name: "notes",
                label: "Notes for coordinator",
                type: "textarea",
                required: false,
                placeholder: "Preferences, verification, how you prefer to pay (off-platform).",
              },
              {
                name: "consent",
                label: "Consent",
                type: "text",
                placeholder: "Type YES — coordinator-managed introduction only",
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
