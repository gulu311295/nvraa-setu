import { Pool } from "pg";

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

const memorySubmissions: {
  id: number;
  form_type: string;
  payload: Record<string, unknown>;
  created_at: string;
}[] = [];
let memoryId = 1;

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
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await p.query(`
        CREATE INDEX IF NOT EXISTS submissions_created_at_idx
        ON submissions (created_at DESC)
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
};

export async function insertSubmission(
  formType: string,
  payload: Record<string, unknown>
): Promise<SubmissionRow> {
  const p = getPool();
  if (!p) {
    const row = {
      id: memoryId++,
      form_type: formType,
      payload,
      created_at: new Date().toISOString(),
    };
    memorySubmissions.unshift(row);
    if (memorySubmissions.length > 200) memorySubmissions.pop();
    return row;
  }

  await ensureSchema();
  const result = await p.query<{ id: number; created_at: Date }>(
    `INSERT INTO submissions (form_type, payload) VALUES ($1, $2::jsonb)
     RETURNING id, created_at`,
    [formType, JSON.stringify(payload)]
  );
  const row = result.rows[0];
  return {
    id: row.id,
    form_type: formType,
    payload,
    created_at: row.created_at.toISOString(),
  };
}

export async function listSubmissions(limit = 50): Promise<SubmissionRow[]> {
  const p = getPool();
  if (!p) {
    return memorySubmissions.slice(0, limit);
  }

  await ensureSchema();
  const result = await p.query<{
    id: number;
    form_type: string;
    payload: Record<string, unknown>;
    created_at: Date;
  }>(
    `SELECT id, form_type, payload, created_at
     FROM submissions
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );

  return result.rows.map((r) => ({
    id: r.id,
    form_type: r.form_type,
    payload: r.payload,
    created_at: r.created_at.toISOString(),
  }));
}
