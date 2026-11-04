"use client";

import { useRouter } from "next/navigation";

export function MemberLogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/member/logout", { method: "POST" });
    router.push("/login");
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
