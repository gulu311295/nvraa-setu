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

function effectiveMentorId(row: {
  matched_mentor_id: string | null;
  status: SubmissionStatus;
  payload: Record<string, unknown>;
}) {
  if (row.matched_mentor_id) return row.matched_mentor_id;
  if (!CONTACT_VISIBLE.includes(row.status)) return null;
  const preferred =
    typeof row.payload.mentorId === "string" ? row.payload.mentorId.trim() : "";
  return preferred || null;
}

export async function GET() {
  const member = await getAuthenticatedMember();
  if (!member) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const rows = await listMemberMentorshipSubmissions(member.id);
  const requests = await Promise.all(
    rows.map(async (row) => {
      const mentorId = effectiveMentorId(row);
      const showContact = CONTACT_VISIBLE.includes(row.status) && Boolean(mentorId);
      let contact = null;
      if (showContact && mentorId) {
        const raw = await getMentorContact(mentorId);
        contact = raw ? sanitizeContactForDisplay(raw) : null;
      }
      const matchedName = mentorId ? getCounsellingMentorById(mentorId)?.name ?? null : null;
      return {
        id: row.id,
        status: row.status,
        statusLabel: STATUS_LABELS[row.status],
        createdAt: row.created_at,
        field: row.payload.field,
        question: row.payload.question,
        requestedMentorName:
          typeof row.payload.mentorName === "string" ? row.payload.mentorName : null,
        matchedMentorId: mentorId,
        matchedMentorName: matchedName,
        contact,
      };
    })
  );

  return NextResponse.json({ ok: true, requests });
}
