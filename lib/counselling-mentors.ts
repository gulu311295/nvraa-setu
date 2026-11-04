import catalogue from "@/data/counselling-mentors.json";
import { mentorMatchesField } from "@/lib/career-fields";

export type CounsellingMentorPublic = {
  id: string;
  name: string;
  batch: string;
  admissionYear?: string;
  field: string;
  domain: string;
  location: string;
  languages: string[];
  availability: string;
  bio: string;
  topics: string[];
  organization?: string;
};

const mentors = catalogue.mentors as CounsellingMentorPublic[];

export function getCounsellingMentors(field?: string) {
  if (!field || field.toLowerCase() === "all") return mentors;
  return mentors.filter((m) => mentorMatchesField(m.field, field));
}

export function getCounsellingMentorById(id: string) {
  return mentors.find((m) => m.id === id) ?? null;
}

export function listCounsellingMentorsForCoordinator() {
  return mentors.map((m) => ({
    id: m.id,
    name: m.name,
    batch: m.batch,
    field: m.field,
  }));
}
