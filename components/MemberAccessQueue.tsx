"use client";

import { useRouter } from "next/navigation";
import type { MemberUser } from "@/lib/users-db";
import { MemberAccessReviewCard } from "./MemberAccessReviewCard";

export function MemberAccessQueue({
  members,
  storageHint,
}: {
  members: MemberUser[];
  storageHint: string;
}) {
  const router = useRouter();
  const pending = members.filter((m) => m.status === "pending");
  const sorted = [
    ...members.filter((m) => m.status === "pending"),
    ...members.filter((m) => m.status !== "pending"),
  ];

  return (
    <section className="mt-10">
      {pending.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3">
          <p className="text-sm font-medium text-amber-100">
            {pending.length} new member sign-up{pending.length === 1 ? "" : "s"} waiting at{" "}
            <span className="text-amber-50">/signup</span> — approve below so they can use{" "}
            <span className="text-amber-50">/login</span>.
          </p>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="shrink-0 rounded-lg border border-amber-400/40 bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-50 hover:bg-amber-500/30"
          >
            Refresh list
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-white">Member sign-ups (/signup)</h2>
          <p className="mt-1 max-w-2xl text-sm text-white/50">
            These are <strong className="font-medium text-white/70">login accounts</strong>, not
            mentorship or job forms. Users must be approved here before they can sign in and submit
            requests on the site.
          </p>
          <p className="mt-2 text-xs text-white/40">{storageHint}</p>
        </div>
        {pending.length > 0 && (
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300">
            {pending.length} pending
          </span>
        )}
      </div>

      {members.length === 0 ? (
        <div className="mt-4 space-y-3 rounded-xl border border-dashed border-white/15 p-6 text-sm text-white/50">
          <p>No member sign-ups in storage yet.</p>
          <ol className="list-decimal list-inside space-y-2 text-white/45">
            <li>
              Open <span className="text-white/70">/signup</span> on the{" "}
              <strong className="font-medium text-white/60">same URL and port</strong> as this page
              (e.g. both on <span className="text-white/70">localhost:3000</span>).
            </li>
            <li>Submit the access form — you should see “Request submitted”.</li>
            <li>
              Return here and click <span className="text-white/70">Refresh list</span> (or reload
              the page).
            </li>
          </ol>
          <p className="text-xs text-white/35">
            Mentorship/job forms appear in the section below only after the user is approved and
            signed in.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {sorted.map((u) => (
            <MemberAccessReviewCard key={u.id} user={u} />
          ))}
        </div>
      )}
    </section>
  );
}
