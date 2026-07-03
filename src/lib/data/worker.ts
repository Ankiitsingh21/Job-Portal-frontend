import "server-only";
import { serverFetch } from "../api-server";
import type { WorkerProfile } from "../types";

export async function getOwnProfile(): Promise<WorkerProfile | null> {
  const res = await serverFetch<WorkerProfile | null>("/api/worker/profile");
  return res?.data ?? null;
}

// getMyApplications lives in ./applications-mine.ts — it needs to join
// against getJob() to enrich bare application rows with a job title,
// so it's kept separate from this simple profile fetcher.
