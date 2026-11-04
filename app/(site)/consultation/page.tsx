import { SubmitForm } from "@/components/SubmitForm";
import { getConsultationDomains } from "@/lib/data";

export default function ConsultationPage() {
  const domains = getConsultationDomains();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm text-saffron-400 uppercase tracking-widest">Door 3</p>
      <h1 className="mt-2 text-3xl font-bold text-white">Exam & Domain Consultation</h1>
      <p className="mt-3 max-w-2xl text-white/65">
        Civil Services, SSC, Banking, Railways, Defence, Police, Teaching and
        more — request strategy and resources while preparing. Guidance without
        guarantees.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {domains.map((d) => (
          <div
            key={d.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <h2 className="font-semibold text-white">{d.name}</h2>
            <p className="mt-2 text-sm text-white/60">{d.description}</p>
            <p className="mt-3 text-xs text-leaf-500">
              ~{d.mentorCount} alumni volunteers (demo)
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <SubmitForm
          formType="consultation"
          title="Request exam consultation"
          description="Select your track and preparation stage. Coordinators connect you with experienced alumni."
          fields={[
            { name: "fullName", label: "Your name", placeholder: "Demo name" },
            {
              name: "examTrack",
              label: "Exam / domain",
              type: "select",
              options: domains.map((d) => d.name),
            },
            {
              name: "stage",
              label: "Preparation stage",
              type: "select",
              options: [
                "Just exploring",
                "Started preparation",
                "Prelims cleared",
                "Mains / Interview stage",
                "Reattempt",
              ],
            },
            {
              name: "language",
              label: "Preferred language",
              type: "select",
              options: ["Hindi", "English", "Hindi + English"],
            },
            {
              name: "request",
              label: "What do you need?",
              type: "textarea",
              placeholder: "Strategy, resources, mock interview, etc.",
            },
          ]}
        />
      </div>
    </div>
  );
}
