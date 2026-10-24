import { redirect } from "next/navigation";
import { CoordinatorLoginForm } from "@/components/CoordinatorLoginForm";
import { isCoordinatorAuthenticated } from "@/lib/auth";

export default async function CoordinatorLoginPage() {
  if (await isCoordinatorAuthenticated()) {
    redirect("/coordinator");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-white">Coordinator sign-in</h1>
      <p className="mt-2 text-sm text-white/60">
        Master tracker for submissions, matching and follow-up. Authorised NVRAA
        team members only.
      </p>
      <div className="mt-8 max-w-sm">
        <CoordinatorLoginForm />
      </div>
    </div>
  );
}
