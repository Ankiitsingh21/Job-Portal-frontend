"use client";

import { useState, FormEvent } from "react";
import { apiClient, ApiError } from "@/lib/api-client";
import { homeRouteForRole } from "@/lib/roles";
import type { AuthResult, CurrentUser } from "@/lib/types";

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

      // The login response itself proves the backend accepted the
      // credentials — but it does NOT prove the browser actually
      // stored the Set-Cookie it came with. Rather than blindly
      // navigating to a protected route and letting the middleware/
      // layout silently bounce us back to /login if the cookie didn't
      // stick, we make a second call — through the exact same
      // same-origin /api/* path, with credentials included — and
      // check that the backend recognizes US as logged in before
      // going anywhere. This turns a silent failure into a real
      // error message.
      let confirmed: CurrentUser | null = null;
      try {
        confirmed = await apiClient<CurrentUser | null>("/auth/me");
      } catch {
        confirmed = null;
      }

      if (!confirmed) {
        setError(
          "Login succeeded on the server, but the browser didn't keep the session " +
            "cookie — this is almost always a cookie/extension/dev-server issue, " +
            "not wrong credentials. Try: (1) an Incognito window with extensions " +
            "off, (2) hard-restarting `npm run dev` for the frontend, (3) checking " +
            "DevTools → Application → Cookies for a `session` entry right now.",
        );
        return;
      }

      if (confirmed.role !== result.user.role) {
        setError(
          `Session role mismatch: login said "${result.user.role}" but /auth/me ` +
            `says "${confirmed.role}". This points at a real backend bug — tell Claude ` +
            `this exact message.`,
        );
        return;
      }

      const roleHome = homeRouteForRole(confirmed.role);
      const destination =
        nextPath && nextPath.startsWith(roleHome) ? nextPath : roleHome;

      window.location.href = destination;
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

      {error && (
        <p className="whitespace-pre-line rounded-card bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

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