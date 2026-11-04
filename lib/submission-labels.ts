const FIELD_LABELS: Record<string, string> = {
  mentorId: "Preferred mentor ID",
  mentorName: "Preferred mentor name",
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
  provider: "Organisation / sponsor",
  amount: "Amount or benefit",
  educationLevel: "Education level",
  scholarshipCategory: "Scholarship category",
  familyIncome: "Family income",
  documentsStatus: "Documents status",
  needDescription: "Need / question",
  supportType: "Type of support",
  amountNeeded: "Amount needed",
  offerType: "Offer type",
  studentReference: "Student reference",
  duration: "Duration",
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
    scholarship: "Scholarship support request",
    scholarship_post: "Scholarship / fund posted",
    scholarship_adopt_request: "Adoption / sponsorship request (student)",
    scholarship_adopt_offer: "Adopt / fund a student (alumni)",
  };
  return map[formType] ?? formType;
}
