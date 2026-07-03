"use client";

import type { ApiEnvelope } from "./types";

export class ApiError extends Error {
  status: number;
  fieldErrors?: { message: string }[];
  constructor(message: string, status: number, fieldErrors?: { message: string }[]) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Every mutation (signup, login, posting a job, changing an
 * application's status, etc.) from a Client Component goes through
 * here. It always calls the SAME-ORIGIN `/api/*` path — never the raw
 * backend URL — so the browser sends the cookie automatically and we
 * never have to think about CORS on this side.
 */
export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!res.ok || !json || json.success === false) {
    throw new ApiError(
      json?.message || "Something went wrong. Please try again.",
      res.status,
      json?.errors,
    );
  }

  return json.data;
}
