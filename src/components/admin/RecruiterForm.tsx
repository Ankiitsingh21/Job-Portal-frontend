"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Industry, Recruiter } from "@/lib/types";

export default function RecruiterForm({ industries }: { industries: Industry[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [industryIds, setIndustryIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleIndustry(id: number) {
    setIndustryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (industryIds.length === 0) {
      setError("Select at least one category.");
      return;
    }

    setLoading(true);
    try {
      await apiClient<Recruiter>("/admin/recruiters", {
        method: "POST",
        body: JSON.stringify({ name, email, password, industryIds }),
      });
      router.push("/admin/recruiters");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create recruiter.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink-700">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink-700">
          Temporary password
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-700">
          Categories
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {industries.map((industry) => (
            <label
              key={industry.id}
              className="flex items-center gap-2 rounded-card border border-ink-200 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={industryIds.includes(industry.id)}
                onChange={() => toggleIndustry(industry.id)}
              />
              {industry.name}
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-card bg-admin-600 py-2.5 font-medium text-white hover:bg-admin-700 disabled:opacity-50"
      >
        {loading ? "Creating…" : "Create recruiter"}
      </button>
    </form>
  );
}
