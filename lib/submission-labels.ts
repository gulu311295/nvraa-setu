const FIELD_LABELS: Record<string, string> = {
  fullName: "Name",
  classOrBatch: "Class / pass-out year",
  field: "Field / domain",
  guidanceType: "Guidance type",
  language: "Preferred language",
  question: "Question or goal",
  availability: "Availability",
  qualification: "Qualification",
  skills: "Skills",
  location: "Location",
  roleType: "Preferred role",
  notes: "Notes",
  examTrack: "Exam / domain",
  stage: "Preparation stage",
  request: "Request details",
  contactName: "Contact name",
  title: "Role title",
  company: "Organisation",
  type: "Type",
  eligibility: "Eligibility",
  deadline: "Deadline",
  applicationLink: "Application link",
  batch: "JNV batch",
  topics: "Topics",
  consent: "Consent",
};

export function labelForPayloadKey(key: string) {
  return FIELD_LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

export function formTypeLabel(formType: string) {
  const map: Record<string, string> = {
    mentorship: "Mentorship request",
    job_seeker: "Job seeker registration",
    consultation: "Exam consultation",
    mentor_volunteer: "Mentor volunteer",
    job_post: "Job / vacancy posted",
  };
  return map[formType] ?? formType;
}
