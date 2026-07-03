import "server-only";
import { headers } from "next/headers";
import type { ApiEnvelope } from "./types";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

/**
 * Use this ONLY inside Server Components, layouts, or Route Handlers.
 *
 * IMPORTANT: we forward the cookie via `headers().get("cookie")`, NOT
 * `cookies().toString()`. The latter looks equivalent but isn't —
 * Next's `cookies()` API re-serializes each cookie value through
 * `encodeURIComponent`, which turns a literal `==` (base64 padding,
 * exactly what cookie-session produces) into `%3D%3D`. Your Express
 * backend never decodes that back — it just tries to base64-decode
 * the raw string — so the session cookie silently corrupts on arrival
 * and `requireAuth` sees no valid JWT. `headers().get("cookie")`
 * returns the exact bytes the browser sent, unmodified, so it
 * round-trips correctly.
 */
export async function serverFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiEnvelope<T> | null> {
  try {
    const cookieHeader = headers().get("cookie") ?? "";
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