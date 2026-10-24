import { SubmitForm } from "@/components/SubmitForm";

export default function OfferPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm text-saffron-400 uppercase tracking-widest">Give back</p>
      <h1 className="mt-2 text-3xl font-bold text-white">Offer Support / Share a Job</h1>
      <p className="mt-3 max-w-2xl text-white/65">
        Alumni mentors, domain experts and employers can volunteer time or share
        verified openings. Coordinators review submissions before matching.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <SubmitForm
          formType="mentor_volunteer"
          title="Volunteer as mentor"
          description="Register your domain, availability and topics you can help with."
          fields={[
            { name: "fullName", label: "Your name", placeholder: "Demo name" },
            { name: "batch", label: "JNV batch / year", placeholder: "e.g. 2010" },
            {
              name: "field",
              label: "Primary field",
              type: "select",
              options: [
                "Engineering",
                "Medicine",
                "Civil Services",
                "Law",
                "Banking & SSC",
                "Teaching",
                "Defence",
                "Other",
              ],
            },
            {
              name: "availability",
              label: "Availability",
              placeholder: "e.g. 2 hrs/month, weekends",
            },
            {
              name: "topics",
              label: "Topics you can guide on",
              type: "textarea",
            },
            {
              name: "consent",
              label: "I consent to coordinator-managed introductions only",
              type: "text",
              placeholder: "Type YES to confirm",
            },
          ]}
        />

        <SubmitForm
          formType="job_post"
          title="Share a job or internship"
          description="Add role, location, eligibility, deadline and application link."
          fields={[
            { name: "contactName", label: "Your name (for coordinator)", placeholder: "Demo" },
            { name: "title", label: "Role title" },
            { name: "company", label: "Organisation" },
            { name: "location", label: "Location" },
            {
              name: "type",
              label: "Type",
              type: "select",
              options: ["Full-time", "Internship", "Contract", "Apprenticeship", "Volunteer"],
            },
            { name: "eligibility", label: "Eligibility", type: "textarea" },
            { name: "deadline", label: "Application deadline", placeholder: "YYYY-MM-DD or Rolling" },
            { name: "applicationLink", label: "Application link or email for coordinator" },
          ]}
        />
      </div>
    </div>
  );
}
