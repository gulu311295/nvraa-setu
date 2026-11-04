"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  alertErrorClass,
  btnPrimaryClass,
  inputClass,
  labelClass,
} from "@/components/ui/form-styles";

export function MemberLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const res = await fetch("/api/auth/member/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email, password: data.password }),
    });
    const json = (await res.json()) as { ok?: boolean; reason?: string };
    setLoading(false);
    if (!json.ok) {
      if (json.reason === "pending") {
        setError(
          "Your access request is pending coordinator approval. Check back after NVRAA approves your account."
        );
      } else if (json.reason === "rejected") {
        setError("This access request was not approved. Contact NVRAA coordinators.");
      } else {
        setError("Invalid email or password.");
      }
      return;
    }
    router.push(next.startsWith("/") ? next : "/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className={labelClass} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className={inputClass}
        />
      </div>
      {error && <p className={alertErrorClass}>{error}</p>}
      <button type="submit" disabled={loading} className={btnPrimaryClass}>
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-sm text-white/45">
        No account?{" "}
        <Link href="/signup" className="font-medium text-saffron-400 hover:text-saffron-300">
          Request access
        </Link>
      </p>
    </form>
  );
}
