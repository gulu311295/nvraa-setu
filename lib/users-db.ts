import { Pool } from "pg";
import {
  localCreateUser,
  localGetUserByEmail,
  localGetUserById,
  localListUsers,
  localUpdateUserStatus,
} from "@/lib/local-users-store";

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

export type UserStatus = "pending" | "approved" | "rejected";

export type MemberUser = {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  user_type: string;
  jnv_batch: string;
  message: string | null;
  status: UserStatus;
  coordinator_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
};

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

async function ensureUserSchema() {
  const p = getPool();
  if (!p) return;
  if (!schemaReady) {
    schemaReady = (async () => {
      await p.query(`
        CREATE TABLE IF NOT EXISTS member_users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          full_name TEXT NOT NULL,
          user_type TEXT NOT NULL,
          jnv_batch TEXT NOT NULL DEFAULT '',
          message TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          coordinator_notes TEXT,
          reviewed_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await p.query(`
        CREATE INDEX IF NOT EXISTS member_users_status_idx ON member_users (status)
      `);
    })();
  }
  await schemaReady;
}

function mapUser(r: MemberUser): MemberUser {
  return r;
}

export async function getUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  const p = getPool();
  if (!p) {
    const u = await localGetUserByEmail(normalized);
    return u ? mapUser(u) : null;
  }
  await ensureUserSchema();
  const result = await p.query<MemberUser>(
    `SELECT * FROM member_users WHERE email = $1`,
    [normalized]
  );
  return result.rows[0] ?? null;
}

export async function getUserById(id: number) {
  const p = getPool();
  if (!p) {
    const u = await localGetUserById(id);
    return u ? mapUser(u) : null;
  }
  await ensureUserSchema();
  const result = await p.query<MemberUser>(
    `SELECT * FROM member_users WHERE id = $1`,
    [id]
  );
  return result.rows[0] ?? null;
}

export async function createMemberUser(input: {
  email: string;
  password_hash: string;
  full_name: string;
  user_type: string;
  jnv_batch: string;
  message: string | null;
}) {
  const email = input.email.trim().toLowerCase();
  const p = getPool();
  if (!p) {
    const result = await localCreateUser({
      email,
      password_hash: input.password_hash,
      full_name: input.full_name,
      user_type: input.user_type,
      jnv_batch: input.jnv_batch,
      message: input.message,
    });
    return result;
  }
  await ensureUserSchema();
  try {
    const result = await p.query<MemberUser>(
      `INSERT INTO member_users (email, password_hash, full_name, user_type, jnv_batch, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [
        email,
        input.password_hash,
        input.full_name,
        input.user_type,
        input.jnv_batch,
        input.message,
      ]
    );
    return { user: result.rows[0] };
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "23505") {
      return { error: "email_exists" as const };
    }
    throw e;
  }
}

export async function listMemberUsers(limit = 100) {
  const p = getPool();
  if (!p) {
    return localListUsers(limit);
  }
  await ensureUserSchema();
  const result = await p.query<MemberUser>(
    `SELECT * FROM member_users ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
}

export async function updateMemberUserStatus(
  id: number,
  status: UserStatus,
  coordinatorNotes: string | null
) {
  const p = getPool();
  if (!p) {
    const u = await localUpdateUserStatus(id, status, coordinatorNotes);
    return u ? mapUser(u) : null;
  }
  await ensureUserSchema();
  const result = await p.query<MemberUser>(
    `UPDATE member_users
     SET status = $2, coordinator_notes = $3, reviewed_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, status, coordinatorNotes]
  );
  return result.rows[0] ?? null;
}
