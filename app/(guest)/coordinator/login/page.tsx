import { AuthShell } from "@/components/auth/AuthShell";
import { CoordinatorLoginForm } from "@/components/CoordinatorLoginForm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isCoordinatorAuthenticated } from "@/lib/auth";

export default async function CoordinatorLoginPage() {
  if (await isCoordinatorAuthenticated()) {
    redirect("/coordinator");
  }

  return (
    <AuthShell
      variant="coordinator"
      eyebrow="Coordinator"
      title="Team sign-in"
      subtitle="Review submissions, approve member access, and match mentors — authorised NVRAA coordinators only."
      footer={
        <Link href="/" className="text-white/45 hover:text-white/70">
          ← Back to SETU home
        </Link>
      }
    >
      <CoordinatorLoginForm />
    </AuthShell>
  );
}
