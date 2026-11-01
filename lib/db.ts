import { Pool } from "pg";
import {
  ensureDemoSubmissionsIfEmpty,
  localInsertSubmission,
  localListSubmissions,
  localUpdateSubmissionReview,
} from "@/lib/local-submissions-store";
import {
  isSubmissionStatus,
  type SubmissionStatus,
} from "@/lib/submission-status";

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;
let demoSeeded = false;

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

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

async function ensureSchema() {
  const p = getPool();
  if (!p) return;
  if (!schemaReady) {
    schemaReady = (async () => {
      await p.query(`
        CREATE TABLE IF NOT EXISTS submissions (
          id SERIAL PRIMARY KEY,
          form_type TEXT NOT NULL,
          payload JSONB NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          coordinator_notes TEXT,
          reviewed_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await p.query(`
        ALTER TABLE submissions ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
      `);
      await p.query(`
        ALTER TABLE submissions ADD COLUMN IF NOT EXISTS coordinator_notes TEXT
      `);
      await p.query(`
        ALTER TABLE submissions ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ
      `);
      await p.query(`
        CREATE INDEX IF NOT EXISTS submissions_created_at_idx
        ON submissions (created_at DESC)
      `);
      await p.query(`
        CREATE INDEX IF NOT EXISTS submissions_status_idx
        ON submissions (status)
      `);
    })();
  }
  await schemaReady;
}

export type SubmissionRow = {
  id: number;
  form_type: string;
  payload: Record<string, unknown>;
  created_at: string;
  status: SubmissionStatus;
  coordinator_notes: string | null;
  reviewed_at: string | null;
};

function mapRow(r: {
  id: number;
  form_type: string;
  payload: Record<string, unknown>;
  created_at: Date | string;
  status?: string;
  coordinator_notes?: string | null;
  reviewed_at?: Date | string | null;
}): SubmissionRow {
  const status =
    r.status && isSubmissionStatus(r.status) ? r.status : "pending";
  return {
    id: r.id,
    form_type: r.form_type,
    payload: r.payload,
    created_at:
      typeof r.created_at === "string"
        ? r.created_at
        : r.created_at.toISOString(),
    status,
    coordinator_notes: r.coordinator_notes ?? null,
    reviewed_at: r.reviewed_at
      ? typeof r.reviewed_at === "string"
        ? r.reviewed_at
        : r.reviewed_at.toISOString()
      : null,
  };
}

async function ensureLocalDemoOnce() {
  if (demoSeeded) return;
  demoSeeded = true;
  if (process.env.NODE_ENV === "production") return;
  await ensureDemoSubmissionsIfEmpty();
}

export async function insertSubmission(
  formType: string,
  payload: Record<string, unknown>
): Promise<SubmissionRow> {
  const p = getPool();
  if (!p) {
    return localInsertSubmission(formType, payload);
  }

  await ensureSchema();
  const result = await p.query<{
    id: number;
    created_at: Date;
    status: string;
    coordinator_notes: string | null;
    reviewed_at: Date | null;
  }>(
    `INSERT INTO submissions (form_type, payload, status)
     VALUES ($1, $2::jsonb, 'pending')
     RETURNING id, created_at, status, coordinator_notes, reviewed_at`,
    [formType, JSON.stringify(payload)]
  );
  const row = result.rows[0];
  return mapRow({
    id: row.id,
    form_type: formType,
    payload,
    created_at: row.created_at,
    status: row.status,
    coordinator_notes: row.coordinator_notes,
    reviewed_at: row.reviewed_at,
  });
}

export async function listSubmissions(limit = 50): Promise<SubmissionRow[]> {
  const p = getPool();
  if (!p) {
    await ensureLocalDemoOnce();
    return localListSubmissions(limit);
  }

  await ensureSchema();
  const result = await p.query<{
    id: number;
    form_type: string;
    payload: Record<string, unknown>;
    created_at: Date;
    status: string;
    coordinator_notes: string | null;
    reviewed_at: Date | null;
  }>(
    `SELECT id, form_type, payload, created_at, status, coordinator_notes, reviewed_at
     FROM submissions
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );

  return result.rows.map(mapRow);
}

export async function updateSubmissionReview(
  id: number,
  status: SubmissionStatus,
  coordinatorNotes: string | null
): Promise<SubmissionRow | null> {
  const p = getPool();
  if (!p) {
    return localUpdateSubmissionReview(id, status, coordinatorNotes);
  }

  await ensureSchema();
  const result = await p.query<{
    id: number;
    form_type: string;
    payload: Record<string, unknown>;
    created_at: Date;
    status: string;
    coordinator_notes: string | null;
    reviewed_at: Date | null;
  }>(
    `UPDATE submissions
     SET status = $2, coordinator_notes = $3, reviewed_at = NOW()
     WHERE id = $1
     RETURNING id, form_type, payload, created_at, status, coordinator_notes, reviewed_at`,
    [id, status, coordinatorNotes]
  );
  if (result.rowCount === 0) return null;
  return mapRow(result.rows[0]);
}

export async function countPendingMentorship(): Promise<number> {
  const all = await listSubmissions(100);
  return all.filter(
    (s) => s.form_type === "mentorship" && s.status === "pending"
  ).length;
}
