"use client";

import { useMemo, useState } from "react";
import type { Job } from "@/lib/types";
import JobCard from "./JobCard";

interface JobListProps {
  /**
   * Rendered server-side in page.tsx and handed down as a prop — this
   * component never re-fetches on mount. That initial payload IS the
   * data; client state below only filters/sorts it. This is the "no
   * data loss" contract: whatever the server fetched is exactly what
   * the user sees, instantly, before any client JS even runs.
   */
  initialJobs: Job[];
}

export default function JobList({ initialJobs }: JobListProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialJobs;
    return initialJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.location?.city.toLowerCase().includes(q) ||
        job.industry?.name.toLowerCase().includes(q),
    );
  }, [initialJobs, query]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold text-ink-900">
          Jobs for you ({filtered.length})
        </h2>
        <input
          type="search"
          placeholder="Search by title, city, or industry"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-72 rounded-card border border-ink-200 px-3 py-2 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-ink-500">
          No jobs match that search yet — try a different city or industry.
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
