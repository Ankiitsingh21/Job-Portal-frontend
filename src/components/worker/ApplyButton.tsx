"use client";

import { useState } from "react";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Application } from "@/lib/types";

export default function ApplyButton({ jobId }: { jobId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "applied" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function handleApply() {
    setStatus("loading");
    setError(null);
    try {
      await apiClient<Application>("/applications", {
        method: "POST",
        body: JSON.stringify({ jobId }),
      });
      setStatus("applied");
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Could not apply.");
    }
  }

  if (status === "applied") {
    return (
      <p className="rounded-card bg-trust-100 px-4 py-2 text-trust-700">
        Applied — the recruiter has been notified.
      </p>
    );
  }

  return (
    <div>
      <button
        onClick={handleApply}
        disabled={status === "loading"}
        className="rounded-card bg-trust-600 px-5 py-2.5 font-medium text-white hover:bg-trust-700 disabled:opacity-50"
      >
        {status === "loading" ? "Applying…" : "Apply for this job"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
