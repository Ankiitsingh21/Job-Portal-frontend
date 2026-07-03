import "server-only";
import { serverFetch } from "./api-server";
import type { CurrentUser } from "./types";

export { homeRouteForRole } from "./roles";

/**
 * Calls GET /api/auth/me with the visitor's forwarded cookie.
 * Returns null if there's no session, the JWT is invalid/expired, or
 * the user was deactivated — every case where the backend's `me`
 * controller returns `data: null` or a non-200.
 *
 * This is the ONLY place that should decide "is this person logged
 * in" — every admin/recruiter/dashboard layout guard calls this
 * instead of trying to read/verify the JWT cookie itself, so there is
 * exactly one source of truth to keep in sync with the backend.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const res = await serverFetch<CurrentUser | null>("/api/auth/me");
  return res?.data ?? null;
}
