"use client";

import { useEffect } from "react";

/** Scroll to the mentorship request form when a mentor is chosen from the directory. */
export function MentorshipFormScroll({ mentorId }: { mentorId?: string | null }) {
  useEffect(() => {
    if (!mentorId) return;
    const el = document.getElementById("request-mentor-form");
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => window.clearTimeout(t);
  }, [mentorId]);

  return null;
}
