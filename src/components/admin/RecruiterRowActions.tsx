"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Recruiter } from "@/lib/types";

export default function RecruiterRowActions({
  recruiterId,
  isActive,
}: {
  recruiterId: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setLoading(true);
    setError(null);
    try {
      const action = isActive ? "deactivate" : "reactivate";
      await apiClient<Recruiter>(`/admin/recruiters/${recruiterId}/${action}`, {
        method: "PATCH",
      });
      // Re-run the SSR data fetch for this route so the table reflects
      // the change immediately, without a full page reload.
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Action failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-right">
      <button
        onClick={toggle}
        disabled={loading}
        className="text-sm text-admin-600 hover:underline disabled:opacity-50"
      >
        {loading ? "Working…" : isActive ? "Deactivate" : "Reactivate"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
