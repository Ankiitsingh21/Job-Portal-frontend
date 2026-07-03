import Link from "next/link";
import type { Job } from "@/lib/types";

function formatWage(job: Job): string | null {
  if (job.wageMin == null && job.wageMax == null) return null;
  const suffix = job.wageType === "monthly" ? "/month" : "/day";
  if (job.wageMin != null && job.wageMax != null && job.wageMin !== job.wageMax) {
    return `₹${job.wageMin}–${job.wageMax}${suffix}`;
  }
  return `₹${job.wageMin ?? job.wageMax}${suffix}`;
}

export default function JobCard({ job }: { job: Job }) {
  const wage = formatWage(job);

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block rounded-card border border-ink-200 bg-white p-4 transition hover:border-trust-500 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-ink-900">{job.title}</h3>
          <p className="mt-1 text-sm text-ink-500">
            {job.location
              ? `${job.location.locality}, ${job.location.city}`
              : "Location TBD"}
            {job.industry ? ` · ${job.industry.name}` : ""}
          </p>
        </div>
        {wage && (
          <span className="whitespace-nowrap rounded bg-signal-100 px-2 py-1 text-sm font-medium text-signal-600">
            {wage}
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-500">
        {job.jobType && (
          <span className="rounded bg-ink-100 px-2 py-0.5">
            {job.jobType.replace("_", " ")}
          </span>
        )}
        {job.shiftType && (
          <span className="rounded bg-ink-100 px-2 py-0.5">{job.shiftType} shift</span>
        )}
        <span className="rounded bg-ink-100 px-2 py-0.5">
          {Math.max(job.headcountRequired - job.headcountFilled, 0)} opening
          {job.headcountRequired - job.headcountFilled !== 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
}
