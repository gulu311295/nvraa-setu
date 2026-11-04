import { isCoordinatorAuthenticated } from "@/lib/auth";
import { getCounsellingMentorById } from "@/lib/counselling-mentors";
import {
  getMentorContact,
  sanitizeContactForDisplay,
} from "@/lib/mentor-contacts";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isCoordinatorAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await context.params;
  const mentor = getCounsellingMentorById(id);
  if (!mentor) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  const contact = await getMentorContact(id);
  return NextResponse.json({
    ok: true,
    mentor: { id: mentor.id, name: mentor.name, batch: mentor.batch, field: mentor.field },
    contact: contact ? sanitizeContactForDisplay(contact) : null,
  });
}
