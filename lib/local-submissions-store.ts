import { promises as fs } from "fs";
import path from "path";
import type { SubmissionStatus } from "@/lib/submission-status";

export type LocalSubmissionRow = {
  id: number;
  form_type: string;
  payload: Record<string, unknown>;
  created_at: string;
  status: SubmissionStatus;
  coordinator_notes: string | null;
  reviewed_at: string | null;
};

type StoreFile = {
  nextId: number;
  submissions: LocalSubmissionRow[];
};

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "submissions.json");

async function readStore(): Promise<StoreFile> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as StoreFile;
    if (!parsed.submissions || !parsed.nextId) {
      return { nextId: 1, submissions: [] };
    }
    return parsed;
  } catch {
    return { nextId: 1, submissions: [] };
  }
}

async function writeStore(store: StoreFile) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function localListSubmissions(limit: number) {
  const store = await readStore();
  return store.submissions.slice(0, limit);
}

export async function localInsertSubmission(
  formType: string,
  payload: Record<string, unknown>
): Promise<LocalSubmissionRow> {
  const store = await readStore();
  const row: LocalSubmissionRow = {
    id: store.nextId++,
    form_type: formType,
    payload,
    created_at: new Date().toISOString(),
    status: "pending",
    coordinator_notes: null,
    reviewed_at: null,
  };
  store.submissions.unshift(row);
  if (store.submissions.length > 200) store.submissions.pop();
  await writeStore(store);
  return row;
}

export async function localUpdateSubmissionReview(
  id: number,
  status: SubmissionStatus,
  coordinatorNotes: string | null
): Promise<LocalSubmissionRow | null> {
  const store = await readStore();
  const idx = store.submissions.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  const reviewedAt = new Date().toISOString();
  store.submissions[idx] = {
    ...store.submissions[idx],
    status,
    coordinator_notes: coordinatorNotes,
    reviewed_at: reviewedAt,
  };
  await writeStore(store);
  return store.submissions[idx];
}

/** Demo rows so coordinators can explore the review UI before any live submit. */
export async function ensureDemoSubmissionsIfEmpty() {
  const store = await readStore();
  if (store.submissions.length > 0) return;
  const demos: Omit<LocalSubmissionRow, "id">[] = [
    {
      form_type: "mentorship",
      status: "pending",
      coordinator_notes: null,
      reviewed_at: null,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      payload: {
        fullName: "Demo Student (sample)",
        classOrBatch: "Class XII",
        field: "Civil Services (UPSC)",
        guidanceType: "One-to-one conversation",
        language: "Hindi + English",
        question: "Need guidance on starting UPSC preparation from Class XII.",
        availability: "Saturday evenings",
      },
    },
    {
      form_type: "mentorship",
      status: "pending",
      coordinator_notes: null,
      reviewed_at: null,
      created_at: new Date(Date.now() - 7200000).toISOString(),
      payload: {
        fullName: "Demo Aspirant (sample)",
        classOrBatch: "2024 pass-out",
        field: "Hotel management",
        guidanceType: "Career exploration",
        language: "Hindi",
        question: "Is NCHM-JEE the right path after Class XII?",
        availability: "Sunday morning",
      },
    },
  ];
  for (const d of demos) {
    store.submissions.push({ ...d, id: store.nextId++ });
  }
  await writeStore(store);
}
