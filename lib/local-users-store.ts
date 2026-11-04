import { promises as fs } from "fs";
import path from "path";
import type { UserStatus } from "@/lib/users-db";

export type LocalUserRow = {
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

type StoreFile = {
  nextId: number;
  users: LocalUserRow[];
};

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "users.json");

async function readStore(): Promise<StoreFile> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as StoreFile;
    if (!parsed.users || !parsed.nextId) return { nextId: 1, users: [] };
    return parsed;
  } catch {
    return { nextId: 1, users: [] };
  }
}

async function writeStore(store: StoreFile) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function localListUsers(limit = 100) {
  const store = await readStore();
  return store.users
    .slice()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, limit);
}

export async function localGetUserByEmail(email: string) {
  const store = await readStore();
  return store.users.find((u) => u.email === email) ?? null;
}

export async function localGetUserById(id: number) {
  const store = await readStore();
  return store.users.find((u) => u.id === id) ?? null;
}

export async function localCreateUser(data: Omit<LocalUserRow, "id" | "created_at" | "status" | "coordinator_notes" | "reviewed_at">) {
  const store = await readStore();
  if (store.users.some((u) => u.email === data.email)) {
    return { error: "email_exists" as const };
  }
  const row: LocalUserRow = {
    ...data,
    id: store.nextId++,
    status: "pending",
    coordinator_notes: null,
    reviewed_at: null,
    created_at: new Date().toISOString(),
  };
  store.users.push(row);
  await writeStore(store);
  return { user: row };
}

export async function localUpdateUserStatus(
  id: number,
  status: UserStatus,
  coordinatorNotes: string | null
) {
  const store = await readStore();
  const idx = store.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  store.users[idx] = {
    ...store.users[idx],
    status,
    coordinator_notes: coordinatorNotes,
    reviewed_at: new Date().toISOString(),
  };
  await writeStore(store);
  return store.users[idx];
}
