"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  ALL_MENTOR_FIELDS,
  CAREER_FIELD_CATEGORIES,
  getCategoryForField,
} from "@/lib/career-fields";
import { selectClass } from "@/components/ui/form-styles";

export function FieldCategoryPicker({ activeField }: { activeField: string }) {
  const router = useRouter();
  const isAll = activeField === "all" || !activeField;

  const activeCategoryId = useMemo(() => {
    if (isAll) return "";
    return getCategoryForField(activeField)?.id ?? "";
  }, [activeField, isAll]);

  const fieldsInCategory = useMemo(() => {
    if (!activeCategoryId) return ALL_MENTOR_FIELDS;
    return (
      CAREER_FIELD_CATEGORIES.find((c) => c.id === activeCategoryId)?.fields ??
      ALL_MENTOR_FIELDS
    );
  }, [activeCategoryId]);

  function goToField(field: string | null) {
    if (!field) {
      router.push("/mentorship");
      return;
    }
    router.push(`/mentorship?field=${encodeURIComponent(field)}`);
  }

  function onCategoryChange(categoryId: string) {
    if (!categoryId) {
      goToField(null);
      return;
    }
    const cat = CAREER_FIELD_CATEGORIES.find((c) => c.id === categoryId);
    if (cat?.fields[0]) goToField(cat.fields[0]);
  }

  function onFieldChange(field: string) {
    if (!field) {
      goToField(null);
      return;
    }
    goToField(field);
  }

  return (
    <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 backdrop-blur-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Filter by domain</h2>
          <p className="mt-1 text-xs text-white/45 max-w-md">
            Choose a category and field to see matching demo mentors, or browse all.
          </p>
        </div>
        {!isAll && (
          <button
            type="button"
            onClick={() => goToField(null)}
            className="shrink-0 self-start rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10 sm:self-auto"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_minmax(0,1.2fr)]">
        <label className="block sm:col-span-1">
          <span className="text-xs font-medium text-white/50">Category</span>
          <select
            className={`mt-1 ${selectClass}`}
            value={activeCategoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All categories</option>
            {CAREER_FIELD_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block sm:col-span-1">
          <span className="text-xs font-medium text-white/50">Field</span>
          <select
            className={`mt-1 ${selectClass}`}
            value={isAll ? "" : activeField}
            onChange={(e) => onFieldChange(e.target.value)}
          >
            <option value="">All fields</option>
            {activeCategoryId ? (
              fieldsInCategory.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))
            ) : (
              CAREER_FIELD_CATEGORIES.map((cat) => (
                <optgroup key={cat.id} label={cat.label}>
                  {cat.fields.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </optgroup>
              ))
            )}
          </select>
        </label>

        <div className="hidden lg:block rounded-lg border border-white/10 bg-navy-950/80 px-3 py-2.5">
          <p className="text-xs text-white/40">Showing</p>
          <p className="mt-0.5 text-sm font-medium text-saffron-400 truncate">
            {isAll ? "All mentors" : activeField}
          </p>
        </div>
      </div>

      {/* Mobile: active filter summary */}
      {!isAll && (
        <p className="mt-3 text-xs text-white/50 lg:hidden">
          Active: <span className="text-leaf-400">{activeField}</span>
        </p>
      )}
    </div>
  );
}
