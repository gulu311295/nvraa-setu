import { insertSubmission } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const formType = String(body.formType ?? "unknown");
    const { formType: _, ...payload } = body;
    await insertSubmission(formType, payload);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("submit error", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
