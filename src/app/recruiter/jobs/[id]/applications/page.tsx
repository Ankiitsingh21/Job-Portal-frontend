import Link from "next/link";
import { getJob } from "@/lib/data/jobs";
import { getApplicationsForJob } from "@/lib/data/applications";
import { notFound } from "next/navigation";

const STATUS_COLOR: Record<string, string> = {
  applied: "bg-ink-100 text-ink-700",
  shortlisted: "bg-trust-100 text-trust-700",
  interview_scheduled: "bg-signal-100 text-signal-600",
  hired: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default async function JobApplicationsPage({
  params,
}: {
  params: { id: string };
}) {
  const [job, applications] = await Promise.all([
    getJob(params.id),
    getApplicationsForJob(params.id),
  ]);
  if (!job) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">
        Applicants — {job.title}
      </h1>

      <div className="mt-6 space-y-2">
        {applications.map((app) => (
          <Link
            key={app.id}
            href={`/recruiter/applications/${app.id}`}
            className="flex items-center justify-between rounded-card border border-ink-200 bg-white px-4 py-3 hover:border-admin-500"
          >
            {/* listByJob() doesn't include the worker relation, so we
                show the id here — full email/phone is on the detail
                page, which calls the endpoint that does include it. */}
            <span className="text-sm text-ink-900">
              Applicant {app.workerId.slice(0, 8)}
            </span>
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[app.status]}`}
            >
              {app.status.replace("_", " ")}
            </span>
          </Link>
        ))}
        {applications.length === 0 && (
          <p className="rounded-card border border-dashed border-ink-200 px-4 py-8 text-center text-ink-500">
            No applicants yet.
          </p>
        )}
      </div>
    </div>
  );
}
