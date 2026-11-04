import { loginMember } from "@/lib/member-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };
    if (!email || !password) {
      return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
    }
    const result = await loginMember(email, password);
    if (!result.ok) {
      return NextResponse.json({ ok: false, reason: result.reason }, { status: 403 });
    }
    return NextResponse.json({
      ok: true,
      user: {
        id: result.user.id,
        full_name: result.user.full_name,
        email: result.user.email,
      },
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
