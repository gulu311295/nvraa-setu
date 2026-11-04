"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  alertErrorClass,
  btnPrimaryClass,
  inputClass,
  labelClass,
} from "@/components/ui/form-styles";

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
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="password" className={labelClass}>
          Coordinator password
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
        {loading ? "Signing in…" : "Enter dashboard"}
      </button>
      <p className="text-center text-xs leading-relaxed text-white/40">
        Local dev: use{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-white/55">nvraa-demo</code> when{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-white/55">COORDINATOR_PASSWORD</code>{" "}
        is unset.
      </p>
    </form>
  );
}
