import "server-only";
import { serverFetch } from "../api-server";
import { getJob } from "./jobs";
import type { Application } from "../types";

export interface MyApplicationView extends Application {
  jobTitle: string;
}

/**
 * GET /api/applications/my (application.repository.listByWorker) returns
 * bare rows — jobId, status, etc — with no `job` relation included.
 * Rather than have the dashboard show a raw UUID, we fetch each
 * referenced job's title here (deduped, in parallel) and merge it in.
 *
 * This is a frontend-side join to work around a backend gap; if you'd
 * rather fix it at the source, add `include: { job: true }` to
 * repo.listByWorker() in application.repository.ts and this file
 * collapses down to a single pass-through.
 */
export async function getMyApplications(): Promise<MyApplicationView[]> {
  const res = await serverFetch<Application[]>("/api/applications/my");
  const applications = res?.data ?? [];

  const uniqueJobIds = Array.from(new Set(applications.map((a) => a.jobId)));
  const jobTitleById = new Map<string, string>();
  await Promise.all(
    uniqueJobIds.map(async (jobId) => {
      const job = await getJob(jobId);
      jobTitleById.set(jobId, job?.title ?? "Job no longer available");
    }),
  );

  return applications.map((app) => ({
    ...app,
    jobTitle: jobTitleById.get(app.jobId) ?? "Job no longer available",
  }));
}
