import "server-only";
import { cookies } from "next/headers";
import type { ApiEnvelope } from "./types";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

/**
 * Use this ONLY inside Server Components, layouts, or Route Handlers.
 * It reads the visitor's own incoming cookies (via next/headers) and
 * forwards them to Express, so `requireAuth` on the backend sees the
 * same session the browser has — SSR pages render already-authenticated
 * instead of flashing a loading state and fetching client-side.
 *
 * Returns `null` on any network/parse failure so callers can decide
 * whether that means "not logged in" or "backend is down" — we never
 * throw here because a failed fetch inside a Server Component would
 * otherwise crash the whole page render.
 */
export async function serverFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiEnvelope<T> | null> {
  try {
    const cookieHeader = cookies().toString();
    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
        ...init?.headers,
      },
      cache: "no-store",
    });

    const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;
    if (!res.ok || !json) return null;
    return json;
  } catch {
    return null;
  }
}
