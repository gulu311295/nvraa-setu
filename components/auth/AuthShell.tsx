import Link from "next/link";
import type { ReactNode } from "react";

const highlights = [
  "Mentorship across careers — UPSC to aviation",
  "Coordinator-verified jobs & introductions",
  "Private, consent-based Navodaya network",
];

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  variant = "member",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: "member" | "coordinator";
}) {
  return (
    <div className="relative min-h-[calc(100vh-0px)] lg:grid lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-saffron-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-leaf-500/15 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_50%)]" />
        </div>
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-400">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white xl:text-5xl">
            NVRAA SETU
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/65">
            {variant === "coordinator"
              ? "Secure workspace for NVRAA coordinators — review access, match mentors, track outcomes."
              : "A year-round bridge between JNV Rajgir students, alumni and opportunities — built for Navodayans."}
          </p>
        </div>
        <ul className="relative mt-10 space-y-4">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-white/70">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-500" />
              {item}
            </li>
          ))}
        </ul>
        <p className="relative text-xs text-white/35">NVRAA Meet 2026 · JNV Rajgir</p>
      </div>

      <div className="flex flex-col justify-center px-4 py-12 sm:px-8 lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/login" className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-400">
              NVRAA SETU
            </Link>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{subtitle}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/25 backdrop-blur-md sm:p-8">
            {children}
          </div>
          {footer && <div className="mt-6 text-center text-sm text-white/50">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
