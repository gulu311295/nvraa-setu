"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { MemberUser, UserStatus } from "@/lib/users-db";

const STATUS_LABELS: Record<UserStatus, string> = {
  pending: "Pending approval",
  approved: "Approved",
  rejected: "Rejected",
};

const STATUS_STYLES: Record<UserStatus, string> = {
  pending: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  approved: "bg-leaf-500/20 text-leaf-400 border-leaf-500/40",
  rejected: "bg-red-500/20 text-red-300 border-red-500/40",
};

export function MemberAccessReviewCard({ user }: { user: MemberUser }) {
  const router = useRouter();
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [notes, setNotes] = useState(user.coordinator_notes ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function save() {
    setLoading(true);
    setMessage("");
    const res = await fetch(`/api/coordinator/members/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, coordinatorNotes: notes }),
    });
    setLoading(false);
    if (!res.ok) {
      setMessage("Could not save.");
      return;
    }
    setMessage("Saved — user can sign in after approval.");
    router.refresh();
  }

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{user.full_name}</h3>
          <p className="text-sm text-white/55">{user.email}</p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-white/40">Role</dt>
          <dd className="text-white/85">{user.user_type}</dd>
        </div>
        <div>
          <dt className="text-white/40">Batch / class</dt>
          <dd className="text-white/85">{user.jnv_batch}</dd>
        </div>
        <div>
          <dt className="text-white/40">Requested</dt>
          <dd className="text-white/85">
            {new Date(user.created_at).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </dd>
        </div>
        {user.message && (
          <div className="sm:col-span-2">
            <dt className="text-white/40">Message</dt>
            <dd className="text-white/85 whitespace-pre-wrap">{user.message}</dd>
          </div>
        )}
      </dl>

      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="flex flex-wrap gap-2">
          {(["pending", "approved", "rejected"] as UserStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                status === s
                  ? "bg-saffron-500 text-navy-950"
                  : "border border-white/15 text-white/70 hover:bg-white/10"
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Internal notes (optional)"
          className="mt-3 w-full rounded-lg border border-white/15 bg-navy-900 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-saffron-400 focus:outline-none"
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={loading}
            className="rounded-lg bg-leaf-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-leaf-400 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save access decision"}
          </button>
          {message && <span className="text-xs text-leaf-400">{message}</span>}
        </div>
      </div>
    </article>
  );
}
