import seed from "@/data/seed.json";
import {
  ALL_MENTOR_FIELDS,
  MENTOR_FILTER_FIELDS,
  mentorMatchesField,
} from "@/lib/career-fields";

export type Mentor = (typeof seed.mentors)[number];
export type Job = (typeof seed.jobs)[number];
export type ConsultationDomain = (typeof seed.consultationDomains)[number];
export type Activity = (typeof seed.recentActivity)[number];

export function getSeedData() {
  return seed;
}

export function getMentors(field?: string) {
  if (!field || field.toLowerCase() === "all") return seed.mentors;
  return seed.mentors.filter((m) => mentorMatchesField(m.field, field));
}

export function getJobs(status: "open" | "all" = "open") {
  if (status === "all") return seed.jobs;
  return seed.jobs.filter((j) => j.status === "open");
}

export function getConsultationDomains() {
  return seed.consultationDomains;
}

export function getStats() {
  return seed.stats;
}

export function getRecentActivity() {
  return seed.recentActivity;
}

export const MENTOR_FIELDS = MENTOR_FILTER_FIELDS;
export { ALL_MENTOR_FIELDS, CAREER_FIELD_CATEGORIES } from "@/lib/career-fields";
