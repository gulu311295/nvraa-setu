import { isCoordinatorAuthenticated } from "@/lib/auth";
import { getSubmissionById, updateSubmissionReview } from "@/lib/db";
import {
  isSubmissionStatus,
  type SubmissionStatus,
} from "@/lib/submission-status";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isCoordinatorAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as {
      status?: string;
      coordinatorNotes?: string | null;
      matchedMentorId?: string | null;
    };
    if (!body.status || !isSubmissionStatus(body.status)) {
      return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
    }

    const status = body.status as SubmissionStatus;
    let matchedMentorId =
      body.matchedMentorId === undefined
        ? undefined
        : body.matchedMentorId?.trim() || null;

    const existing = await getSubmissionById(id);
    if (
      existing?.form_type === "mentorship" &&
      (status === "approved" || status === "matched")
    ) {
      const preferred =
        typeof existing.payload.mentorId === "string"
          ? existing.payload.mentorId.trim()
          : "";
      if (!matchedMentorId && preferred) {
        matchedMentorId = preferred;
      }
    }

    const updated = await updateSubmissionReview(
      id,
      status,
      body.coordinatorNotes?.trim() || null,
      matchedMentorId
    );
    if (!updated) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    revalidatePath("/mentorship");
    revalidatePath("/coordinator");
    return NextResponse.json({ ok: true, submission: updated });
  } catch (e) {
    console.error("coordinator review error", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
