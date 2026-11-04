#!/usr/bin/env node
/**
 * Regenerate data/counselling-mentors.json and data/mentor-contacts.private.json
 * from Contact list.xlsx (sheet: councelling team).
 *
 *   npm run import:mentors
 *   npm run import:mentors -- --push-db
 */
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const xlsxPath = path.join(root, "Contact list.xlsx");
const pyScript = path.join(__dirname, "import-counselling-mentors.py");

if (!existsSync(xlsxPath)) {
  console.error("Missing Contact list.xlsx in project root.");
  process.exit(1);
}

const run = spawnSync("python3", [pyScript, xlsxPath, path.join(root, "data")], {
  cwd: root,
  encoding: "utf8",
});
if (run.status !== 0) {
  console.error(run.stderr || run.stdout);
  process.exit(run.status ?? 1);
}
console.log(run.stdout.trim());

if (process.argv.includes("--push-db")) {
  if (!process.env.DATABASE_URL) {
    console.error("Set DATABASE_URL to push mentor contacts to Postgres.");
    process.exit(1);
  }
  const contacts = JSON.parse(
    readFileSync(path.join(root, "data/mentor-contacts.private.json"), "utf8")
  );
  const pg = await import("pg");
  const pool = new pg.default.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.PGSSL === "false" ? false : { rejectUnauthorized: false },
  });
  await pool.query(`
    CREATE TABLE IF NOT EXISTS mentor_contacts (
      mentor_id TEXT PRIMARY KEY,
      email TEXT,
      mobile TEXT,
      whatsapp TEXT
    )
  `);
  for (const [mentorId, c] of Object.entries(contacts)) {
    await pool.query(
      `INSERT INTO mentor_contacts (mentor_id, email, mobile, whatsapp)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (mentor_id) DO UPDATE SET
         email = EXCLUDED.email, mobile = EXCLUDED.mobile, whatsapp = EXCLUDED.whatsapp`,
      [mentorId, c.email, c.mobile, c.whatsapp]
    );
  }
  await pool.end();
  console.log(`Pushed ${Object.keys(contacts).length} mentor contacts to Postgres.`);
}
