import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "nvraa_coord_session";

function sessionSecret() {
  return process.env.SESSION_SECRET || "nvraa-setu-dev-secret-change-in-production";
}

export function coordinatorSessionToken() {
  return createHmac("sha256", sessionSecret())
    .update("nvraa-coordinator-v1")
    .digest("hex");
}

export function verifyCoordinatorPassword(password: string) {
  const expected = process.env.COORDINATOR_PASSWORD;
  if (!expected) {
    return process.env.NODE_ENV !== "production" && password === "nvraa-demo";
  }
  if (password.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(password), Buffer.from(expected));
}

export async function setCoordinatorSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, coordinatorSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearCoordinatorSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isCoordinatorAuthenticated() {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return false;
  const expected = coordinatorSessionToken();
  if (value.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
  } catch {
    return false;
  }
}
