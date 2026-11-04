"use client";

import { FormEvent, useState } from "react";
import {
  alertErrorClass,
  btnPrimaryClass,
  cardClass,
  inputClass,
  labelClass,
  selectClass,
  textareaClass,
} from "@/components/ui/form-styles";
import { FormSuccess } from "./FormSuccess";

type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "textarea" | "select" | "hidden";
  required?: boolean;
  options?: string[];
  optionGroups?: { label: string; options: string[] }[];
  placeholder?: string;
};

export function SubmitForm({
  formType,
  title,
  description,
  fields,
  defaultValues = {},
}: {
  formType: string;
  title: string;
  description: string;
  fields: Field[];
  defaultValues?: Record<string, string>;
}) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType, ...data }),
      });
      if (res.status === 401) {
        setError("You must be signed in with an approved account before submitting.");
        return;
      }
      if (!res.ok) {
        setError("Could not submit. Try again or contact NVRAA coordinators.");
        return;
      }
      setDone(true);
      form.reset();
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <FormSuccess
        title="Request received"
        message="An NVRAA coordinator will review this in the mentorship queue at /coordinator. You can track status under “Your mentorship requests” on this page."
      />
    );
  }

  return (
    <div className={cardClass}>
      <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{description}</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        {fields.map((f) => (
          <div key={f.name} className={f.type === "hidden" ? "hidden" : undefined}>
            {f.type !== "hidden" && (
              <label htmlFor={f.name} className={labelClass}>
                {f.label}
                {f.required !== false && (
                  <span className="normal-case text-saffron-400"> *</span>
                )}
              </label>
            )}
            {f.type === "hidden" ? (
              <input
                type="hidden"
                id={f.name}
                name={f.name}
                defaultValue={defaultValues[f.name] ?? ""}
              />
            ) : f.type === "textarea" ? (
              <textarea
                id={f.name}
                name={f.name}
                required={f.required !== false}
                rows={4}
                placeholder={f.placeholder}
                defaultValue={defaultValues[f.name] ?? ""}
                className={textareaClass}
              />
            ) : f.type === "select" ? (
              <select
                id={f.name}
                name={f.name}
                required={f.required !== false}
                defaultValue={defaultValues[f.name] ?? ""}
                className={selectClass}
              >
                <option value="">Select…</option>
                {f.optionGroups
                  ? f.optionGroups.map((g) => (
                      <optgroup key={g.label} label={g.label}>
                        {g.options.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </optgroup>
                    ))
                  : (f.options ?? []).map((o) => (
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
                defaultValue={defaultValues[f.name] ?? ""}
                className={inputClass}
              />
            )}
          </div>
        ))}
        {error && <p className={alertErrorClass}>{error}</p>}
        <button type="submit" disabled={loading} className={btnPrimaryClass}>
          {loading ? "Submitting…" : "Submit for coordinator review"}
        </button>
      </form>
    </div>
  );
}
