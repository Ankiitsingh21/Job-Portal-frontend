import Link from "next/link";
import { getJobs } from "@/lib/data/jobs";

export default async function RecruiterDashboardPage() {
  // job.service.listJobs is role-aware on the backend — a recruiter
  // calling GET /api/jobs only ever gets back jobs they posted.
  const jobs = await getJobs();
  const active = jobs.filter((j) => j.status === "active").length;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink-900">
        Recruiter dashboard
      </h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-card border border-ink-200 bg-white p-5">
          <p className="text-sm text-ink-500">Active jobs</p>
          <p className="mt-1 font-display text-3xl font-semibold text-admin-700">
            {active}
          </p>
        </div>
        <div className="rounded-card border border-ink-200 bg-white p-5">
          <p className="text-sm text-ink-500">Draft jobs</p>
          <p className="mt-1 font-display text-3xl font-semibold text-ink-900">
            {jobs.filter((j) => j.status === "draft").length}
          </p>
        </div>
        <div className="rounded-card border border-ink-200 bg-white p-5">
          <p className="text-sm text-ink-500">Total posted</p>
          <p className="mt-1 font-display text-3xl font-semibold text-ink-900">
            {jobs.length}
          </p>
        </div>
      </div>

      <Link
        href="/recruiter/jobs/new"
        className="inline-block rounded-card bg-admin-600 px-4 py-2 text-sm font-medium text-white hover:bg-admin-700"
      >
        + Post a job
      </Link>
    </div>
  );
}
