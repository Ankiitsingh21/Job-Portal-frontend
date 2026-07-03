"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Job, JobStatus } from "@/lib/types";

const OPTIONS: JobStatus[] = ["draft", "active", "closed"];

export default function JobStatusSelect({
  jobId,
  currentStatus,
}: {
  jobId: string;
  currentStatus: JobStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleChange(status: JobStatus) {
    setLoading(true);
    try {
      await apiClient<Job>(`/jobs/${jobId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Could not update status.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={currentStatus}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value as JobStatus)}
      className="rounded-card border border-ink-200 px-2 py-1 text-sm disabled:opacity-50"
    >
      {OPTIONS.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
