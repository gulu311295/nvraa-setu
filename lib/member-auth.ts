import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { buildMemberCookieValue } from "@/lib/session-edge";
import {
  getUserByEmail,
  getUserById,
  type MemberUser,
  type UserStatus,
} from "@/lib/users-db";
import { verifyPassword } from "@/lib/password";

const MEMBER_COOKIE = "nvraa_member_session";

function sessionSecret() {
  return (
    process.env.SESSION_SECRET || "nvraa-setu-dev-secret-change-in-production"
  );
}

export async function memberCookieValueForUser(userId: number) {
  return buildMemberCookieValue(userId);
}

/** Node-side verify (API / server components). */
export function verifyMemberCookieValue(value: string | undefined): number | null {
  if (!value) return null;
  const dot = value.indexOf(".");
  if (dot <= 0) return null;
  const userIdStr = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const userId = Number(userIdStr);
  if (!Number.isFinite(userId)) return null;
  const expected = createHmac("sha256", sessionSecret())
    .update(`nvraa-member-v1:${userId}`)
    .digest("hex");
  if (sig.length !== expected.length) return null;
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  return userId;
}

export async function setMemberSession(userId: number) {
  const value = await memberCookieValueForUser(userId);
  const store = await cookies();
  store.set(MEMBER_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearMemberSession() {
  const store = await cookies();
  store.delete(MEMBER_COOKIE);
}

export async function getAuthenticatedMember(): Promise<MemberUser | null> {
  const store = await cookies();
  const userId = verifyMemberCookieValue(store.get(MEMBER_COOKIE)?.value);
  if (!userId) return null;
  const user = await getUserById(userId);
  if (!user || user.status !== "approved") return null;
  return user;
}

export async function isMemberAuthenticated() {
  return (await getAuthenticatedMember()) !== null;
}

export type LoginResult =
  | { ok: true; user: MemberUser }
  | { ok: false; reason: "invalid" | "pending" | "rejected" };

export async function loginMember(
  email: string,
  password: string
): Promise<LoginResult> {
  const user = await getUserByEmail(email.trim().toLowerCase());
  if (!user) return { ok: false, reason: "invalid" };
  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return { ok: false, reason: "invalid" };
  if (user.status === "pending") return { ok: false, reason: "pending" };
  if (user.status === "rejected") return { ok: false, reason: "rejected" };
  await setMemberSession(user.id);
  return { ok: true, user };
}

export { type UserStatus, type MemberUser };
