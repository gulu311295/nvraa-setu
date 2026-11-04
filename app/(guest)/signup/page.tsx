import { AuthShell } from "@/components/auth/AuthShell";
import { MemberSignupForm } from "@/components/MemberSignupForm";
import { NvraaWhatsAppNotice } from "@/components/NvraaWhatsAppNotice";
import Link from "next/link";

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Join the network"
      title="Request access"
      subtitle="Tell us who you are. An NVRAA coordinator will verify your Navodaya connection before you can use SETU."
      footer={
        <>
          Already approved?{" "}
          <Link href="/login" className="font-medium text-saffron-400 hover:text-saffron-300">
            Sign in
          </Link>
        </>
      }
    >
      <div className="mb-5">
        <NvraaWhatsAppNotice />
      </div>
      <MemberSignupForm />
    </AuthShell>
  );
}
