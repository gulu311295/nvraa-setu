import {
  coordinatorCookieValid,
  memberCookieValid,
} from "@/lib/session-edge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = new Set(["/login", "/signup"]);

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/api/auth/signup")) return true;
  if (pathname.startsWith("/api/auth/member/login")) return true;
  if (pathname.startsWith("/api/auth/login")) return true;
  if (pathname.startsWith("/api/auth/logout")) return true;
  if (pathname.startsWith("/api/auth/member/logout")) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const coordCookie = request.cookies.get("nvraa_coord_session")?.value;
  const memberCookie = request.cookies.get("nvraa_member_session")?.value;

  if (pathname.startsWith("/coordinator")) {
    if (pathname === "/coordinator/login") {
      return NextResponse.next();
    }
    if (await coordinatorCookieValid(coordCookie)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/coordinator/login", request.url));
  }

  if (pathname.startsWith("/api/coordinator")) {
    if (await coordinatorCookieValid(coordCookie)) {
      return NextResponse.next();
    }
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (isPublicPath(pathname)) {
    if (
      (pathname === "/login" || pathname === "/signup") &&
      (await memberCookieValid(memberCookie))
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (await memberCookieValid(memberCookie)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { ok: false, error: "Sign in required" },
      { status: 401 }
    );
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
