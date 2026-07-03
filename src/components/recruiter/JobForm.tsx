"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Industry, Job, JobType, Location, ShiftType, WageType } from "@/lib/types";

export default function JobForm({
  industries,
  locations,
}: {
  industries: Industry[];
  locations: Location[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [industryId, setIndustryId] = useState<number | "">("");
  const [locationId, setLocationId] = useState<number | "">("");
  const [headcountRequired, setHeadcountRequired] = useState(1);
  const [jobType, setJobType] = useState<JobType>("full_time");
  const [shiftType, setShiftType] = useState<ShiftType>("day");
  const [wageType, setWageType] = useState<WageType>("daily");
  const [wageMin, setWageMin] = useState("");
  const [wageMax, setWageMax] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!industryId || !locationId) {
      setError("Select an industry and a location.");
      return;
    }

    setLoading(true);
    try {
      // This category-based creation goes through job.middlewares'
      // categoryGuard on the backend — it 403s if this recruiter
      // hasn't been assigned this industryId by an admin.
      const job = await apiClient<Job>("/jobs", {
        method: "POST",
        body: JSON.stringify({
          title,
          description: description || undefined,
          industryId,
          locationId,
          headcountRequired,
          jobType,
          shiftType,
          wageType,
          wageMin: wageMin ? Number(wageMin) : undefined,
          wageMax: wageMax ? Number(wageMax) : undefined,
        }),
      });
      router.push(`/jobs/${job.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not post job.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink-700">Job title</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-ink-700">Industry</label>
          <select
            required
            value={industryId}
            onChange={(e) => setIndustryId(Number(e.target.value))}
            className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2"
          >
            <option value="">Select…</option>
            {industries.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700">Location</label>
          <select
            required
            value={locationId}
            onChange={(e) => setLocationId(Number(e.target.value))}
            className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2"
          >
            <option value="">Select…</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.locality}, {l.city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-ink-700">Job type</label>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value as JobType)}
            className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2"
          >
            <option value="full_time">Full time</option>
            <option value="part_time">Part time</option>
            <option value="contract">Contract</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700">Shift</label>
          <select
            value={shiftType}
            onChange={(e) => setShiftType(e.target.value as ShiftType)}
            className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2"
          >
            <option value="day">Day</option>
            <option value="night">Night</option>
            <option value="rotational">Rotational</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700">
            Openings
          </label>
          <input
            type="number"
            min={1}
            required
            value={headcountRequired}
            onChange={(e) => setHeadcountRequired(Number(e.target.value))}
            className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-ink-700">Wage type</label>
          <select
            value={wageType}
            onChange={(e) => setWageType(e.target.value as WageType)}
            className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700">
            Wage min (₹)
          </label>
          <input
            type="number"
            min={0}
            value={wageMin}
            onChange={(e) => setWageMin(e.target.value)}
            className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700">
            Wage max (₹)
          </label>
          <input
            type="number"
            min={0}
            value={wageMax}
            onChange={(e) => setWageMax(e.target.value)}
            className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-card bg-admin-600 py-2.5 font-medium text-white hover:bg-admin-700 disabled:opacity-50"
      >
        {loading ? "Posting…" : "Post job (as draft)"}
      </button>
    </form>
  );
}
