import { hashPassword } from "@/lib/password";
import { createMemberUser } from "@/lib/users-db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const USER_TYPES = ["Student", "Alumni", "Teacher / staff", "Other"];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      fullName?: string;
      userType?: string;
      jnvBatch?: string;
      message?: string;
    };

    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    const fullName = body.fullName?.trim() ?? "";
    const userType = body.userType ?? "";
    const jnvBatch = body.jnvBatch?.trim() ?? "";
    const message = body.message?.trim() || null;

    if (!email || !password || !fullName || !userType || !jnvBatch) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ ok: false, error: "weak_password" }, { status: 400 });
    }
    if (!USER_TYPES.includes(userType)) {
      return NextResponse.json({ ok: false, error: "invalid_type" }, { status: 400 });
    }

    const password_hash = await hashPassword(password);
    const result = await createMemberUser({
      email,
      password_hash,
      full_name: fullName,
      user_type: userType,
      jnv_batch: jnvBatch,
      message,
    });

    if ("error" in result && result.error === "email_exists") {
      return NextResponse.json({ ok: false, error: "email_exists" }, { status: 409 });
    }

    revalidatePath("/coordinator");
    return NextResponse.json({ ok: true, status: "pending" });
  } catch (e) {
    console.error("signup error", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
