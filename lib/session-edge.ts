/** HMAC helpers that work in Next.js middleware (Edge). */

function secret() {
  return (
    process.env.SESSION_SECRET || "nvraa-setu-dev-secret-change-in-production"
  );
}

async function hmacSha256Hex(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function coordinatorCookieValid(value: string | undefined) {
  if (!value) return false;
  const expected = await hmacSha256Hex("nvraa-coordinator-v1");
  return value === expected;
}

export async function memberCookieValid(value: string | undefined) {
  if (!value) return false;
  const dot = value.indexOf(".");
  if (dot <= 0) return false;
  const userId = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (!/^\d+$/.test(userId) || !sig) return false;
  const expected = await hmacSha256Hex(`nvraa-member-v1:${userId}`);
  return sig === expected;
}

export async function buildMemberCookieValue(userId: number) {
  const sig = await hmacSha256Hex(`nvraa-member-v1:${userId}`);
  return `${userId}.${sig}`;
}
