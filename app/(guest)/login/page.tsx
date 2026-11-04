import { AuthShell } from "@/components/auth/AuthShell";
import { MemberLoginForm } from "@/components/MemberLoginForm";
import Link from "next/link";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Member access"
      title="Welcome back"
      subtitle="Sign in with the email and password you used when your access was approved."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="font-medium text-saffron-400 hover:text-saffron-300">
            Request access
          </Link>
        </>
      }
    >
      <Suspense fallback={<p className="text-sm text-white/50">Loading…</p>}>
        <MemberLoginForm />
      </Suspense>
    </AuthShell>
  );
}
