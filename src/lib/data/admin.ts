import "server-only";
import { serverFetch } from "../api-server";
import type { Recruiter } from "../types";

export async function getRecruiters(): Promise<Recruiter[]> {
  const res = await serverFetch<Recruiter[]>("/api/admin/recruiters");
  return res?.data ?? [];
}

export async function getRecruiter(id: string): Promise<Recruiter | null> {
  const res = await serverFetch<Recruiter>(`/api/admin/recruiters/${id}`);
  return res?.data ?? null;
}
