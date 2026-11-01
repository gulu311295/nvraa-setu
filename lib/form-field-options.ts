import { CAREER_FIELD_CATEGORIES } from "@/lib/career-fields";

export function mentorFieldOptionGroups() {
  return CAREER_FIELD_CATEGORIES.map((c) => ({
    label: c.label,
    options: c.fields,
  }));
}
