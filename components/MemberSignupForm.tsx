"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  alertErrorClass,
  alertSuccessClass,
  btnPrimaryClass,
  inputClass,
  labelClass,
  selectClass,
  textareaClass,
} from "@/components/ui/form-styles";

export function MemberSignupForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        userType: data.userType,
        jnvBatch: data.jnvBatch,
        message: data.message,
      }),
    });
    setLoading(false);
    if (res.status === 409) {
      setError("An account with this email already exists.");
      return;
    }
    if (!res.ok) {
      setError("Could not submit. Check all fields (password at least 8 characters).");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className={`${alertSuccessClass} text-center`}>
        <p className="text-lg font-semibold text-leaf-300">Request submitted</p>
        <p className="mt-2 text-sm text-white/70">
          An NVRAA coordinator will review this at{" "}
          <span className="text-white/85">/coordinator</span> under{" "}
          <span className="text-white/85">Member sign-ups</span> — not the mentorship/job forms.
          You can sign in at <span className="text-white/85">/login</span> only after approval.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm font-semibold text-saffron-400 hover:text-saffron-300"
        >
          Go to sign in →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className={labelClass} htmlFor="fullName">
          Full name
        </label>
        <input id="fullName" name="fullName" required className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor="signup-email">
          Email
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Min 8 characters"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="confirmPassword">
            Confirm
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="userType">
          I am a
        </label>
        <select id="userType" name="userType" required className={selectClass}>
          <option value="">Select…</option>
          <option>Student</option>
          <option>Alumni</option>
          <option>Teacher / staff</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className={labelClass} htmlFor="jnvBatch">
          JNV batch / class
        </label>
        <input
          id="jnvBatch"
          name="jnvBatch"
          required
          placeholder="e.g. 2015 or Class XII"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="message">
          Why do you need access?
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className={textareaClass}
          placeholder="Optional note for coordinators"
        />
      </div>
      {error && <p className={alertErrorClass}>{error}</p>}
      <button type="submit" disabled={loading} className={btnPrimaryClass}>
        {loading ? "Submitting…" : "Request access"}
      </button>
    </form>
  );
}
