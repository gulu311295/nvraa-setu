import { getCounsellingMentorById } from "@/lib/counselling-mentors";
import { listMemberMentorshipSubmissions } from "@/lib/db";
import { getAuthenticatedMember } from "@/lib/member-auth";
import {
  getMentorContact,
  sanitizeContactForDisplay,
} from "@/lib/mentor-contacts";
import { STATUS_LABELS, type SubmissionStatus } from "@/lib/submission-status";
import { NextResponse } from "next/server";

const CONTACT_VISIBLE: SubmissionStatus[] = ["approved", "matched"];

export async function GET() {
  const member = await getAuthenticatedMember();
  if (!member) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const rows = await listMemberMentorshipSubmissions(member.id);
  const requests = await Promise.all(
    rows.map(async (row) => {
      const mentorId =
        row.matched_mentor_id ||
        (typeof row.payload.mentorId === "string" ? row.payload.mentorId : null);
      const mentor = mentorId ? getCounsellingMentorById(mentorId) : null;
      const showContact =
        CONTACT_VISIBLE.includes(row.status) && Boolean(row.matched_mentor_id);
      let contact = null;
      if (showContact && row.matched_mentor_id) {
        const raw = await getMentorContact(row.matched_mentor_id);
        contact = raw ? sanitizeContactForDisplay(raw) : null;
      }
      return {
        id: row.id,
        status: row.status,
        statusLabel: STATUS_LABELS[row.status],
        createdAt: row.created_at,
        field: row.payload.field,
        question: row.payload.question,
        requestedMentorId: mentorId,
        requestedMentorName:
          mentor?.name ||
          (typeof row.payload.mentorName === "string" ? row.payload.mentorName : null),
        matchedMentorId: row.matched_mentor_id,
        matchedMentorName: row.matched_mentor_id
          ? getCounsellingMentorById(row.matched_mentor_id)?.name ?? null
          : null,
        contact,
      };
    })
  );

  return NextResponse.json({ ok: true, requests });
}
