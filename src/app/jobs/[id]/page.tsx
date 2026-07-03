import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import ApplyButton from "@/components/worker/ApplyButton";
import { getCurrentUser } from "@/lib/session";
import { getJob } from "@/lib/data/jobs";

function formatWage(job: NonNullable<Awaited<ReturnType<typeof getJob>>>): string | null {
  if (job.wageMin == null && job.wageMax == null) return null;
  const suffix = job.wageType === "monthly" ? "/ month" : "/ day";
  if (job.wageMin != null && job.wageMax != null && job.wageMin !== job.wageMax) {
    return `₹${job.wageMin}–${job.wageMax} ${suffix}`;
  }
  return `₹${job.wageMin ?? job.wageMax} ${suffix}`;
}

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/jobs/${params.id}`);

  const job = await getJob(params.id);
  if (!job) notFound();

  const wage = formatWage(job);

  return (
    <div className="min-h-screen">
      <Navbar user={user} variant="worker" />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          {job.title}
        </h1>
        <p className="mt-1 text-ink-500">
          {job.location ? `${job.location.locality}, ${job.location.city}` : ""}
          {job.industry ? ` · ${job.industry.name}` : ""}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {job.jobType && (
            <span className="rounded bg-ink-100 px-2 py-1">
              {job.jobType.replace("_", " ")}
            </span>
          )}
          {job.shiftType && (
            <span className="rounded bg-ink-100 px-2 py-1">{job.shiftType} shift</span>
          )}
          {wage && (
            <span className="rounded bg-signal-100 px-2 py-1 text-signal-600">
              {wage}
            </span>
          )}
        </div>

        {job.description && (
          <p className="mt-6 whitespace-pre-line text-ink-700">
            {job.description}
          </p>
        )}

        {user.role === "worker" && (
          <div className="mt-8">
            <ApplyButton jobId={job.id} />
          </div>
        )}
      </main>
    </div>
  );
}
