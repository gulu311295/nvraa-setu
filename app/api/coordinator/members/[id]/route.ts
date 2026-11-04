import { isCoordinatorAuthenticated } from "@/lib/auth";
import { updateMemberUserStatus } from "@/lib/users-db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const STATUSES = new Set(["pending", "approved", "rejected"]);

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isCoordinatorAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const body = (await request.json()) as {
      status?: string;
      coordinatorNotes?: string | null;
    };
    if (!body.status || !STATUSES.has(body.status)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const updated = await updateMemberUserStatus(
      id,
      body.status as "pending" | "approved" | "rejected",
      body.coordinatorNotes?.trim() || null
    );
    if (!updated) {
      return NextResponse.json({ ok: false }, { status: 404 });
    }
    revalidatePath("/coordinator");
    return NextResponse.json({ ok: true, user: updated });
  } catch (e) {
    console.error("member review error", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
