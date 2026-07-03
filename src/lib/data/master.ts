import "server-only";
import { serverFetch } from "../api-server";
import type { Industry, Location } from "../types";

export async function getIndustries(): Promise<Industry[]> {
  const res = await serverFetch<Industry[]>("/api/master/industries");
  return res?.data ?? [];
}

export async function getLocations(): Promise<Location[]> {
  const res = await serverFetch<Location[]>("/api/master/locations");
  return res?.data ?? [];
}
