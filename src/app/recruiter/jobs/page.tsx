import Link from "next/link";
import { getJobs } from "@/lib/data/jobs";
import JobStatusSelect from "@/components/recruiter/JobStatusSelect";

const STATUS_COLOR: Record<string, string> = {
  draft: "bg-ink-100 text-ink-500",
  active: "bg-trust-100 text-trust-700",
  closed: "bg-red-100 text-red-700",
};

export default async function RecruiterJobsPage() {
  const jobs = await getJobs();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          My jobs
        </h1>
        <Link
          href="/recruiter/jobs/new"
          className="rounded-card bg-admin-600 px-4 py-2 text-sm font-medium text-white hover:bg-admin-700"
        >
          + Post a job
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex items-center justify-between rounded-card border border-ink-200 bg-white px-4 py-3"
          >
            <div>
              <Link href={`/jobs/${job.id}`} className="font-medium text-ink-900 hover:underline">
                {job.title}
              </Link>
              <p className="text-sm text-ink-500">
                {job.headcountRequired} opening
                {job.headcountRequired > 1 ? "s" : ""} ·{" "}
                <Link href={`/recruiter/jobs/${job.id}/applications`} className="text-admin-600">
                  View applications
                </Link>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[job.status]}`}
              >
                {job.status}
              </span>
              <JobStatusSelect jobId={job.id} currentStatus={job.status} />
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <p className="rounded-card border border-dashed border-ink-200 px-4 py-8 text-center text-ink-500">
            You haven't posted any jobs yet.
          </p>
        )}
      </div>
    </div>
  );
}
