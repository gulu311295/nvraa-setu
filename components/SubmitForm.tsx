"use client";

import { FormEvent, useState } from "react";
import { FormSuccess } from "./FormSuccess";

type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "textarea" | "select";
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

export function SubmitForm({
  formType,
  title,
  description,
  fields,
}: {
  formType: string;
  title: string;
  description: string;
  fields: Field[];
}) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType, ...data }),
      });
      setDone(true);
      form.reset();
    } catch {
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <FormSuccess
        title="Request received"
        message="An NVRAA coordinator will review your submission and follow up with consent-based introductions. On Railway with PostgreSQL, your request is stored securely for coordinator review."
      />
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-white/60">{description}</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="block text-sm font-medium text-white/80">
              {f.label}
              {f.required !== false && <span className="text-saffron-400"> *</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea
                id={f.name}
                name={f.name}
                required={f.required !== false}
                rows={4}
                placeholder={f.placeholder}
                className="mt-1 w-full rounded-lg border border-white/15 bg-navy-900 px-3 py-2 text-white placeholder:text-white/30 focus:border-saffron-400 focus:outline-none focus:ring-1 focus:ring-saffron-400"
              />
            ) : f.type === "select" ? (
              <select
                id={f.name}
                name={f.name}
                required={f.required !== false}
                className="mt-1 w-full rounded-lg border border-white/15 bg-navy-900 px-3 py-2 text-white focus:border-saffron-400 focus:outline-none"
              >
                <option value="">Select…</option>
                {(f.options ?? []).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={f.name}
                name={f.name}
                type={f.type ?? "text"}
                required={f.required !== false}
                placeholder={f.placeholder}
                className="mt-1 w-full rounded-lg border border-white/15 bg-navy-900 px-3 py-2 text-white placeholder:text-white/30 focus:border-saffron-400 focus:outline-none focus:ring-1 focus:ring-saffron-400"
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-saffron-500 px-4 py-3 font-semibold text-navy-950 hover:bg-saffron-400 disabled:opacity-60 transition-colors"
        >
          {loading ? "Submitting…" : "Submit for coordinator review"}
        </button>
      </form>
    </div>
  );
}
