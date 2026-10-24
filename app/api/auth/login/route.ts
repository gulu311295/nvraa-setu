import {
  setCoordinatorSession,
  verifyCoordinatorPassword,
} from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = (await request.json()) as { password?: string };
    if (!password || !verifyCoordinatorPassword(password)) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    await setCoordinatorSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
