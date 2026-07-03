import "server-only";
import { serverFetch } from "../api-server";
import type { Application } from "../types";

// NOTE: repo.listByJob() has no Prisma `include`, so each row here only
// has jobId/workerId/status — no worker name/email/phone. For the full
// picture (used on the application detail page) we call GET
// /applications/:id instead, which DOES include the worker relation
// (application.repository.findById). This mirrors exactly what the
// backend supports today rather than pretending data exists that
// isn't actually returned.
export async function getApplicationsForJob(jobId: string): Promise<Application[]> {
  const res = await serverFetch<Application[]>(`/api/applications/job/${jobId}`);
  return res?.data ?? [];
}

export async function getApplication(id: string): Promise<Application | null> {
  const res = await serverFetch<Application>(`/api/applications/${id}`);
  return res?.data ?? null;
}
