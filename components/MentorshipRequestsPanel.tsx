"use client";

import { useCallback, useEffect, useState } from "react";

type RequestRow = {
  id: number;
  status: string;
  statusLabel: string;
  createdAt: string;
  field?: unknown;
  question?: unknown;
  requestedMentorName?: string | null;
  matchedMentorName?: string | null;
  contact?: {
    email: string | null;
    mobile: string | null;
    whatsapp: string | null;
  } | null;
};

export function MentorshipRequestsPanel() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/member/mentorship-requests", {
      cache: "no-store",
    });
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const json = (await res.json()) as { requests?: RequestRow[] };
    setRequests(json.requests ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  if (loading) {
    return (
      <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm text-white/45">
        Loading your mentorship requests…
      </section>
    );
  }

  if (requests.length === 0) return null;

  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Your mentorship requests</h2>
          <p className="mt-1 text-sm text-white/50">
            When a coordinator <strong className="font-medium text-white/70">approves</strong>{" "}
            your request and assigns the mentor you chose, their email and phone appear here
            (not on public mentor cards).
          </p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="shrink-0 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
        >
          Refresh
        </button>
      </div>
      <ul className="mt-6 space-y-4">
        {requests.map((r) => (
          <li
            key={r.id}
            className="rounded-2xl border border-white/10 bg-navy-950/40 p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-medium text-white">
                Request #{r.id}
                {r.field ? (
                  <span className="font-normal text-white/55"> · {String(r.field)}</span>
                ) : null}
              </p>
              <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-white/70">
                {r.statusLabel}
              </span>
            </div>
            {r.requestedMentorName && (
              <p className="mt-2 text-xs text-white/45">
                Requested mentor:{" "}
                <span className="text-white/70">{r.requestedMentorName}</span>
              </p>
            )}
            {r.matchedMentorName && (
              <p className="mt-1 text-xs text-white/45">
                Assigned mentor:{" "}
                <span className="text-saffron-400">{r.matchedMentorName}</span>
              </p>
            )}
            {r.contact &&
            (r.contact.email || r.contact.mobile || r.contact.whatsapp) ? (
              <div className="mt-4 rounded-xl border border-leaf-500/30 bg-leaf-500/10 px-4 py-3 text-sm">
                <p className="font-medium text-leaf-300">Mentor contact (approved)</p>
                <ul className="mt-2 space-y-1 text-white/85">
                  {r.contact.email && (
                    <li>
                      Email:{" "}
                      <a
                        href={`mailto:${r.contact.email}`}
                        className="text-saffron-400 hover:underline"
                      >
                        {r.contact.email}
                      </a>
                    </li>
                  )}
                  {r.contact.mobile && (
                    <li>
                      Phone:{" "}
                      <a href={`tel:${r.contact.mobile}`} className="text-saffron-400">
                        {r.contact.mobile}
                      </a>
                    </li>
                  )}
                  {r.contact.whatsapp && r.contact.whatsapp !== r.contact.mobile && (
                    <li>WhatsApp: {r.contact.whatsapp}</li>
                  )}
                </ul>
                <p className="mt-2 text-xs text-white/45">
                  Please introduce yourself politely and respect mentor availability.
                </p>
              </div>
            ) : (
              <p className="mt-3 text-xs text-white/40">
                {r.status === "pending"
                  ? "Waiting for coordinator review."
                  : r.status === "approved" || r.status === "matched"
                    ? "Approved — contact details could not be loaded yet. Tap Refresh; if still empty, NVRAA needs to seed mentor contacts on the server."
                    : "Contact details are not shared for this request."}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
