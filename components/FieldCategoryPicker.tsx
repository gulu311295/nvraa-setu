import Link from "next/link";
import { CAREER_FIELD_CATEGORIES } from "@/lib/career-fields";

export function FieldCategoryPicker({ activeField }: { activeField: string }) {
  const isAll = activeField === "all" || !activeField;

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/mentorship"
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            isAll
              ? "bg-saffron-500 text-navy-950"
              : "border border-white/15 text-white/70 hover:bg-white/10"
          }`}
        >
          All fields
        </Link>
      </div>

      {CAREER_FIELD_CATEGORIES.map((cat) => (
        <div key={cat.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <h2 className="text-sm font-semibold text-white">{cat.label}</h2>
          <p className="mt-0.5 text-xs text-white/45">{cat.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {cat.fields.map((f) => {
              const active = f.toLowerCase() === activeField?.toLowerCase();
              return (
                <Link
                  key={f}
                  href={`/mentorship?field=${encodeURIComponent(f)}`}
                  className={`rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                    active
                      ? "bg-leaf-500 text-navy-950"
                      : "border border-white/15 text-white/70 hover:border-saffron-400/40 hover:text-white"
                  }`}
                >
                  {f}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
