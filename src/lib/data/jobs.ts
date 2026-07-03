import "server-only";
import { serverFetch } from "../api-server";
import type { Job } from "../types";

// GET /api/jobs — role-aware on the backend (job.service.listJobs):
// workers see all active jobs, recruiters see their own, super_admin
// sees everything. Requires auth — there is currently no public
// unauthenticated listing endpoint (see the flag in chat).
export async function getJobs(): Promise<Job[]> {
  const res = await serverFetch<Job[]>("/api/jobs");
  return res?.data ?? [];
}

export async function getJob(id: string): Promise<Job | null> {
  const res = await serverFetch<Job>(`/api/jobs/${id}`);
  return res?.data ?? null;
}
