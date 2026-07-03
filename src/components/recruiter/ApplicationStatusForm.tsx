"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Application, ApplicationStatus } from "@/lib/types";

// Mirrors ALLOWED_TRANSITIONS in application.service.ts exactly — we
// only ever offer moves the backend will actually accept, so a
// recruiter never hits a confusing 400 from clicking a dead-end option.
const ALLOWED_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  applied: ["shortlisted", "rejected"],
  shortlisted: ["interview_scheduled", "rejected"],
  interview_scheduled: ["hired", "rejected"],
  hired: [],
  rejected: [],
};

export default function ApplicationStatusForm({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: ApplicationStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nextOptions = ALLOWED_TRANSITIONS[currentStatus];

  async function moveTo(status: ApplicationStatus) {
    setLoading(true);
    setError(null);
    try {
      await apiClient<Application>(`/applications/${applicationId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update status.");
    } finally {
      setLoading(false);
    }
  }

  if (nextOptions.length === 0) {
    return (
      <p className="text-sm text-ink-500">
        This application is in a final state ({currentStatus.replace("_", " ")}).
      </p>
    );
  }

  return (
    <div>
      <p className="text-sm font-medium text-ink-700">Move to:</p>
      <div className="mt-2 flex gap-2">
        {nextOptions.map((status) => (
          <button
            key={status}
            onClick={() => moveTo(status)}
            disabled={loading}
            className="rounded-card border border-ink-200 px-3 py-1.5 text-sm hover:bg-ink-50 disabled:opacity-50"
          >
            {status.replace("_", " ")}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
