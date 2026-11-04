import { promises as fs } from "fs";
import path from "path";
import {
  ensureMentorContactsSchema,
  getMentorContactFromDb,
  seedMentorContactsFromFileIfEmpty,
  type MentorContact,
} from "@/lib/mentor-contacts-db";

export type { MentorContact };

const PRIVATE_PATH = path.join(
  process.cwd(),
  "data",
  "mentor-contacts.private.json"
);

async function readContactsFile(): Promise<Record<string, MentorContact>> {
  try {
    const raw = await fs.readFile(PRIVATE_PATH, "utf8");
    return JSON.parse(raw) as Record<string, MentorContact>;
  } catch {
    return {};
  }
}

/** Coordinator / post-approval member flows only — never import in client components. */
export async function getMentorContact(
  mentorId: string
): Promise<MentorContact | null> {
  if (process.env.DATABASE_URL) {
    await ensureMentorContactsSchema();
    await seedMentorContactsFromFileIfEmpty();
    const row = await getMentorContactFromDb(mentorId);
    if (row) return row;
  }
  const file = await readContactsFile();
  const c = file[mentorId];
  if (!c) return null;
  return {
    email: normalizeContact(c.email),
    mobile: normalizeContact(c.mobile),
    whatsapp: normalizeContact(c.whatsapp),
  };
}

function normalizeContact(value: string | undefined) {
  const v = (value ?? "").trim();
  if (!v || v.toUpperCase() === "NA") return "";
  return v;
}

export function sanitizeContactForDisplay(contact: MentorContact) {
  return {
    email: contact.email || null,
    mobile: contact.mobile || null,
    whatsapp: contact.whatsapp || null,
  };
}
