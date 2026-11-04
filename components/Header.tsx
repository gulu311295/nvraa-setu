import Link from "next/link";
import { MemberLogoutButton } from "@/components/MemberLogoutButton";
import { getAuthenticatedMember } from "@/lib/member-auth";

const nav = [
  { href: "/mentorship", label: "Find a Mentor" },
  { href: "/jobs", label: "Jobs & Internships" },
  { href: "/consultation", label: "Exam Consultation" },
  { href: "/scholarship", label: "Scholarships" },
  { href: "/offer", label: "Offer Support" },
  { href: "/coordinator", label: "Coordinator" },
];

export async function Header() {
  const member = await getAuthenticatedMember();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex flex-col">
          <span className="text-xs font-medium uppercase tracking-widest text-saffron-400">
            JNV Rajgir · NVRAA
          </span>
          <span className="font-display text-xl font-semibold text-white group-hover:text-saffron-400 transition-colors">
            NVRAA SETU
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {member && (
            <>
              <span className="hidden text-sm text-white/50 sm:inline">
                {member.full_name}
              </span>
              <MemberLogoutButton />
            </>
          )}
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
