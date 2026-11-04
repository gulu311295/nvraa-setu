import { Pool } from "pg";
import { promises as fs } from "fs";
import path from "path";
export type MentorContact = {
  email: string;
  mobile: string;
  whatsapp: string;
};

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;
let seedInFlight: Promise<void> | null = null;

function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.PGSSL === "false"
          ? false
          : { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function ensureMentorContactsSchema() {
  const p = getPool();
  if (!p) return;
  if (!schemaReady) {
    schemaReady = (async () => {
      await p.query(`
        CREATE TABLE IF NOT EXISTS mentor_contacts (
          mentor_id TEXT PRIMARY KEY,
          email TEXT,
          mobile TEXT,
          whatsapp TEXT
        )
      `);
    })();
  }
  await schemaReady;
}

export async function getMentorContactFromDb(
  mentorId: string
): Promise<MentorContact | null> {
  const p = getPool();
  if (!p) return null;
  await ensureMentorContactsSchema();
  const result = await p.query<{
    email: string | null;
    mobile: string | null;
    whatsapp: string | null;
  }>(
    `SELECT email, mobile, whatsapp FROM mentor_contacts WHERE mentor_id = $1`,
    [mentorId]
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    email: row.email ?? "",
    mobile: row.mobile ?? "",
    whatsapp: row.whatsapp ?? "",
  };
}

export async function upsertMentorContacts(
  contacts: Record<string, MentorContact>
) {
  const p = getPool();
  if (!p) return { ok: false as const, reason: "no_database" as const };
  await ensureMentorContactsSchema();
  for (const [mentorId, c] of Object.entries(contacts)) {
    await p.query(
      `INSERT INTO mentor_contacts (mentor_id, email, mobile, whatsapp)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (mentor_id) DO UPDATE SET
         email = EXCLUDED.email,
         mobile = EXCLUDED.mobile,
         whatsapp = EXCLUDED.whatsapp`,
      [mentorId, c.email, c.mobile, c.whatsapp]
    );
  }
  return { ok: true as const, count: Object.keys(contacts).length };
}

const PRIVATE_PATH = path.join(
  process.cwd(),
  "data",
  "mentor-contacts.private.json"
);

function parseContactsJson(raw: string): Record<string, MentorContact> | null {
  try {
    const parsed = JSON.parse(raw) as Record<string, MentorContact>;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

async function runSeedIfEmpty() {
  const p = getPool();
  if (!p) return;
  await ensureMentorContactsSchema();
  const count = await p.query(`SELECT COUNT(*)::int AS n FROM mentor_contacts`);
  if ((count.rows[0]?.n ?? 0) > 0) return;

  const fromEnv = process.env.MENTOR_CONTACTS_JSON?.trim();
  if (fromEnv) {
    const contacts = parseContactsJson(fromEnv);
    if (contacts && Object.keys(contacts).length > 0) {
      await upsertMentorContacts(contacts);
      return;
    }
  }

  try {
    const raw = await fs.readFile(PRIVATE_PATH, "utf8");
    const contacts = parseContactsJson(raw);
    if (contacts) await upsertMentorContacts(contacts);
  } catch {
    // Local dev: run npm run import:mentors. Production: set MENTOR_CONTACTS_JSON on Railway.
  }
}

export async function seedMentorContactsIfEmpty() {
  if (!seedInFlight) {
    seedInFlight = runSeedIfEmpty().finally(() => {
      seedInFlight = null;
    });
  }
  await seedInFlight;
}

/** @deprecated use seedMentorContactsIfEmpty */
export async function seedMentorContactsFromFileIfEmpty() {
  return seedMentorContactsIfEmpty();
}
