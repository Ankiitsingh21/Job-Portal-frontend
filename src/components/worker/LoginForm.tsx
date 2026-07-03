"use client";

import { useState, FormEvent } from "react";
import { apiClient, ApiError } from "@/lib/api-client";
import { homeRouteForRole } from "@/lib/roles";
import type { AuthResult } from "@/lib/types";

export default function LoginForm({ nextPath }: { nextPath?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await apiClient<AuthResult>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // `nextPath` (set by middleware.ts when a guest hit a protected
      // URL directly) wins ONLY if it actually matches the account's
      // role — otherwise we send them to their real home, never to a
      // portal they don't have permission for.
      const roleHome = homeRouteForRole(result.user.role);
      const destination =
        nextPath && nextPath.startsWith(roleHome) ? nextPath : roleHome;

      window.location.href = destination; // full nav so SSR sees the new cookie
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-card border border-ink-200 px-3 py-2"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-card bg-trust-600 py-2.5 font-medium text-white hover:bg-trust-700 disabled:opacity-50"
      >
        {loading ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
