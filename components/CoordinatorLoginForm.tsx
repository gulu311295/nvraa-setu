"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function CoordinatorLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const password = new FormData(e.currentTarget).get("password") as string;
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Incorrect password. Contact NVRAA admin.");
      return;
    }
    router.push("/coordinator");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm text-white/80">
          Coordinator password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-white/15 bg-navy-900 px-3 py-2 text-white focus:border-saffron-400 focus:outline-none"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-saffron-500 py-2.5 font-semibold text-navy-950 hover:bg-saffron-400 disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-xs text-white/45 text-center">
        Local dev default: <code className="text-white/60">nvraa-demo</code> when{" "}
        <code className="text-white/60">COORDINATOR_PASSWORD</code> is unset.
      </p>
    </form>
  );
}
