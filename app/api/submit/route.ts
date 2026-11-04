import { insertSubmission } from "@/lib/db";
import { getAuthenticatedMember } from "@/lib/member-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const member = await getAuthenticatedMember();
  if (!member) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const formType = String(body.formType ?? "unknown");
    const { formType: _, ...payload } = body;
    await insertSubmission(formType, payload, member.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("submit error", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
