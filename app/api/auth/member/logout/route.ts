import { clearMemberSession } from "@/lib/member-auth";
import { NextResponse } from "next/server";

export async function POST() {
  await clearMemberSession();
  return NextResponse.json({ ok: true });
}
