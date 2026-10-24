"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/coordinator/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white/70 hover:bg-white/10"
    >
      Sign out
    </button>
  );
}
