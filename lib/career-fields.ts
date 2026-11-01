/** Career / mentorship domains — grouped for browsing and forms. */

export type CareerFieldCategory = {
  id: string;
  label: string;
  description: string;
  fields: string[];
};

export const CAREER_FIELD_CATEGORIES: CareerFieldCategory[] = [
  {
    id: "health",
    label: "Healthcare & life sciences",
    description: "Clinical, research and allied health paths",
    fields: [
      "Medicine",
      "Nursing & paramedical",
      "Pharmacy",
      "Psychology & counselling",
    ],
  },
  {
    id: "public",
    label: "Public service & governance",
    description: "Policy, law and uniformed services",
    fields: [
      "Civil Services (UPSC)",
      "Law & judiciary",
      "Defence (NDA/CDS/AFCAT)",
      "Police & CAPF",
    ],
  },
  {
    id: "govt-jobs",
    label: "Government exams & PSUs",
    description: "Competitive exams and public-sector careers",
    fields: [
      "Banking & SSC",
      "Railways & RRB",
      "Teaching (CTET / TET)",
      "PSU & technical trades",
    ],
  },
  {
    id: "tech",
    label: "Engineering & technology",
    description: "Core engineering, software and emerging tech",
    fields: [
      "Engineering (core branches)",
      "Computer science & IT",
      "Data science & AI",
    ],
  },
  {
    id: "business",
    label: "Business, hospitality & aviation",
    description: "Management, finance, hotels and airlines",
    fields: [
      "Management & MBA",
      "Commerce (CA / CS / CMA)",
      "Hotel management",
      "Aviation & aerospace",
      "Entrepreneurship & startups",
    ],
  },
  {
    id: "creative",
    label: "Design, media & social impact",
    description: "Creative industries and development sector",
    fields: [
      "Architecture & design",
      "Media & journalism",
      "Social work & NGOs",
    ],
  },
  {
    id: "agri",
    label: "Agriculture & environment",
    description: "Farming sciences, veterinary and forestry",
    fields: ["Agriculture & veterinary", "Environment & forestry"],
  },
  {
    id: "explore",
    label: "Still exploring",
    description: "Not fixed on a track — general career guidance",
    fields: ["Career exploration (undecided)"],
  },
];

export const ALL_MENTOR_FIELDS = CAREER_FIELD_CATEGORIES.flatMap((c) => c.fields);

/** Legacy alias: filter chips include "All" on the mentorship page. */
export const MENTOR_FILTER_FIELDS = ["All", ...ALL_MENTOR_FIELDS] as const;

export function getCategoryForField(field: string) {
  return CAREER_FIELD_CATEGORIES.find((c) =>
    c.fields.some((f) => f.toLowerCase() === field.toLowerCase())
  );
}

export function normalizeFieldKey(field: string) {
  return field.toLowerCase().replace(/\s+/g, " ").trim();
}

export function mentorMatchesField(mentorField: string, selectedField: string) {
  if (normalizeFieldKey(selectedField) === "all") return true;
  const m = normalizeFieldKey(mentorField);
  const s = normalizeFieldKey(selectedField);
  if (m === s) return true;
  // Map legacy seed labels to new taxonomy
  const aliases: Record<string, string[]> = {
    "civil services (upsc)": ["civil services"],
    "law & judiciary": ["law"],
    "engineering (core branches)": ["engineering"],
    "computer science & it": ["engineering"],
    "banking & ssc": ["banking & ssc"],
  };
  for (const [canonical, legacy] of Object.entries(aliases)) {
    if (s === canonical && legacy.includes(m)) return true;
    if (m === canonical && legacy.includes(s)) return true;
  }
  return m.includes(s) || s.includes(m);
}
